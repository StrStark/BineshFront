import { useState, useRef, useEffect } from "react";
import {
  Send,
  Mic,
  Plus,
  AlertTriangle,
  Sparkles,
  Lightbulb,
  X,
  Trash2,
  Loader2,
  Edit,
  Search,
  Image as ImageIcon,
  LayoutGrid,
  Code,
  FolderPlus,
  Folder,
  PanelLeftOpen,
  PanelLeftClose,
  ChevronsRight,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { imgRectangle34624214 } from "../../imports/svg-zgd3h";
import {
  ProjectCreationPanel,
  ProjectData,
} from "../components/ProjectCreationPanel";
import { chatAPI, ChatConversation } from "../api/chatAPI";
import { getCookie } from "../utils/auth";
import { AITableRenderer } from "../components/AITableRenderer";
import { AIBarChart } from "../components/AIBarChart";
import { AIPieChart } from "../components/AIPieChart";
import { AIDonutChart } from "../components/AIDonutChart";
import { AILineChart } from "../components/AILineChart";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AICopyButton } from "../components/AIExportButtons";

interface ToolCall {
  toolCallId: string;
  functionName: string;
  argumentsJson: string;
}

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  isStreaming?: boolean;
  toolCall?: ToolCall;
  status?: string;
  statusTimestamp?: Date;
}

type TabType = "limitations" | "capabilities" | "examples";

const defaultSuggestions = [
  "تحلیل‌های بخش فروش",
  "تحلیل‌های بخش محصولات",
  "تحلیل‌های بخش انبار",
  "تحلیل‌های بخش مالی",
];

const tabContent = {
  limitations: [
    "ممکن است گاهی اوقات اطلاعات نادرست تولید کند",
    "ممکن است گاهی اوقات دستورالعمل‌های مضر تولید کند",
    "دانش محدود در مورد رویدادهای پس از سال 2021",
  ],
  capabilities: [
    "به سوالات مربوط به داده‌های داشبورد پاسخ می‌دهد",
    "می‌تواند گفتگو را در طول جلسه به خاطر بسپارد",
    "امکان ارائه پیگیری‌های تکمیلی را فراهم می‌کند",
  ],
  examples: [
    "چطور می‌توانم به شما کمک کنم؟",
    "میزان فروش امروز چقدر است؟",
    "آمار تماس‌های امروز را نشان بده",
  ],
};

const tabIcons = {
  limitations: AlertTriangle,
  capabilities: Sparkles,
  examples: Lightbulb,
};

const tabLabels = {
  limitations: "محدودیت‌ها",
  capabilities: "توانایی‌ها",
  examples: "مثال‌ها",
};

export function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("capabilities");
  const [customPrompts, setCustomPrompts] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPrompt, setNewPrompt] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [showProjectPanel, setShowProjectPanel] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projectHistories, setProjectHistories] = useState<Record<string, Message[]>>({});
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [conversationsError, setConversationsError] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const [isDeletingConversation, setIsDeletingConversation] = useState(false);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
  const [aiThinkingStatus, setAiThinkingStatus] = useState<string | null>(null);
  const [thinkingStartTime, setThinkingStartTime] = useState<number | null>(null);
  const [thinkingElapsed, setThinkingElapsed] = useState(0);
  
  const isMounted = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const streamingMessageIdRef = useRef<number | null>(null);
  const selectedConversationIdRef = useRef<string | null>(null);
  const messagesRef = useRef<Message[]>([]);
  const sidebarHoverRef = useRef(false);
  const sidebarHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const colors = useCurrentColors();

  // Smooth beep sound using Web Audio API
  const playDoneBeep = useRef(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = ctx.currentTime;

      // Two-tone chime: C6 → E6 (soft, Figma-like)
      const frequencies = [1047, 1319];
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.15, now + i * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.4);
      });

      // Cleanup
      setTimeout(() => ctx.close(), 1000);
    } catch (e) {
      // Audio not available, silently ignore
    }
  }).current;

  const projects = [{ label: "گاز" }, { label: "RFID" }];

  // Load conversations from API
  useEffect(() => {
    const loadConversations = async () => {
      setIsLoadingConversations(true);
      setConversationsError(null);

      try {
        const response = await chatAPI.getConversations();
        if (response.code === 200 && response.body) {
          setConversations(response.body);
        } else {
          setConversationsError("خطا در دریافت لیست چت‌ها");
        }
      } catch (error: any) {
        console.error("Failed to load conversations:", error);
        setConversationsError("خطا در دریافت لیست چت‌ها");
      } finally {
        setIsLoadingConversations(false);
      }
    };

    loadConversations();
  }, []);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    selectedConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Thinking elapsed timer
  useEffect(() => {
    if (thinkingStartTime === null) {
      setThinkingElapsed(0);
      return;
    }
    const interval = setInterval(() => {
      setThinkingElapsed(Math.floor((Date.now() - thinkingStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [thinkingStartTime]);

  // WebSocket connection
  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;
    let isEffectActive = true;
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 10;

    const connectWebSocket = () => {
      try {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          return;
        }

        if (wsRef.current) {
          wsRef.current.close();
        }

        if (isEffectActive) {
          setIsConnecting(true);
          setConnectionError(null);
        }

        const ws = new WebSocket(
          "wss://panel.bineshafzar.ir/api/WebSocket/ChatStreamSocket/Get",
        );

        ws.onopen = () => {
          reconnectAttempts = 0;
          if (isEffectActive) {
            setIsConnecting(false);
            setConnectionError(null);
            setIsWebSocketConnected(true);
          }
        };

        ws.onmessage = (event) => {
          if (!isEffectActive) return;
          try {
            const data = JSON.parse(event.data);

            console.log('[AI WebSocket] Raw event:', event.data);
            console.log('[AI WebSocket] Parsed data:', data);
            console.log('[AI WebSocket] Type:', data.type || data.Type, '| Payload:', data.payload || data.Payload);

            if (data.type === "ConversationCreated" || data.Type === "ConversationCreated") {
              const conversationId = data.payload || data.Payload;
              setSelectedConversationId(conversationId);
              chatAPI.getConversations().then((response) => {
                if (response.code === 200 && response.body) {
                  setConversations(response.body);
                }
              });
              return;
            }

            if (data.type === "Status" || data.Type === "Status") {
              const payload = data.payload || data.Payload;
              if (payload) {
                // Update thinking indicator (shown before tokens arrive)
                setAiThinkingStatus(payload);
                if (streamingMessageIdRef.current !== null) {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === streamingMessageIdRef.current
                        ? { ...msg, status: payload, statusTimestamp: new Date() }
                        : msg,
                    ),
                  );
                }
              }
              return;
            }

            if (data.type === "Component" || data.Type === "Component") {
              const payload = data.payload || data.Payload;
              // Clear thinking indicator when component arrives
              setAiThinkingStatus(null);
              setThinkingStartTime(null);
              if (payload && payload.component) {
                const newId = Date.now();
                const componentMessage: Message = {
                  id: newId,
                  text: "",
                  sender: "ai",
                  timestamp: new Date(),
                  isStreaming: true,
                  toolCall: {
                    toolCallId: `component_${newId}`,
                    functionName: payload.component,
                    argumentsJson: JSON.stringify(payload.args),
                  },
                };
                setMessages((prev) => [...prev, componentMessage]);
                streamingMessageIdRef.current = newId;
              }
              return;
            }

            if (data.type === "Done" || data.Type === "Done") {
              // Clear thinking indicator
              setAiThinkingStatus(null);
              setThinkingStartTime(null);
              if (streamingMessageIdRef.current !== null) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === streamingMessageIdRef.current
                      ? { ...msg, isStreaming: false, status: undefined, statusTimestamp: undefined }
                      : msg,
                  ),
                );
              }
              streamingMessageIdRef.current = null;
              playDoneBeep();
              return;
            }

            if (data.type === "Token" || data.Type === "Token") {
              const payload = data.payload || data.Payload;
              if (payload == null) return;

              // Clear thinking indicator when first real token arrives
              setAiThinkingStatus(null);
              setThinkingStartTime(null);

              if (streamingMessageIdRef.current === null) {
                const newId = Date.now();
                streamingMessageIdRef.current = newId;
                const aiMessage: Message = {
                  id: newId,
                  text: payload,
                  sender: "ai",
                  timestamp: new Date(),
                  isStreaming: true,
                };
                setMessages((prev) => [...prev, aiMessage]);
              } else {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === streamingMessageIdRef.current
                      ? { ...msg, text: msg.text + payload }
                      : msg,
                  ),
                );
              }
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        ws.onerror = () => {
          if (isEffectActive) {
            setConnectionError("عدم دسترسی به سرور هوش مصنوعی");
            setIsConnecting(false);
            setIsWebSocketConnected(false);
          }
        };

        ws.onclose = () => {
          wsRef.current = null;
          if (isEffectActive) {
            setIsConnecting(false);
            setIsWebSocketConnected(false);
            if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
              reconnectAttempts++;
              const delay = Math.min(1000 * Math.pow(2, reconnectAttempts - 1), 10000);
              reconnectTimeout = setTimeout(() => {
                if (isEffectActive && isMounted.current) {
                  connectWebSocket();
                }
              }, delay);
            }
          }
        };

        wsRef.current = ws;
      } catch (error) {
        if (isEffectActive) {
          setConnectionError("خطا در برقراری اتصال");
          setIsConnecting(false);
          setIsWebSocketConnected(false);
        }
      }
    };

    connectWebSocket();

    return () => {
      isEffectActive = false;
      clearTimeout(reconnectTimeout);
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounting");
        wsRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("customAIPrompts");
    if (saved) {
      try {
        setCustomPrompts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load custom prompts:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (customPrompts.length > 0) {
      localStorage.setItem("customAIPrompts", JSON.stringify(customPrompts));
    }
  }, [customPrompts]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, aiThinkingStatus]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue("");

    // Start thinking indicator
    setAiThinkingStatus("در حال پردازش درخواست شما...");
    setThinkingStartTime(Date.now());

    setTimeout(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const token = getCookie("authToken");
        if (!token) return;

        const apiMessages = messagesRef.current.map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        }));

        apiMessages.push({
          role: "user",
          content: messageText,
        });

        const payload = {
          token: token,
          conversationId: selectedConversationIdRef.current,
          messages: apiMessages,
        };

        wsRef.current.send(JSON.stringify(payload));
      }
    }, 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAddPrompt = () => {
    if (!newPrompt.trim()) return;
    setCustomPrompts((prev) => [...prev, newPrompt.trim()]);
    setNewPrompt("");
    setShowAddModal(false);
  };

  const handleDeletePrompt = (index: number) => {
    setCustomPrompts((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) {
        localStorage.removeItem("customAIPrompts");
      }
      return updated;
    });
  };

  const allSuggestions = [...defaultSuggestions, ...customPrompts];

  const handleLoadConversation = async (conversationId: string) => {
    setIsLoadingMessages(true);
    setSelectedConversationId(conversationId);

    try {
      const response = await chatAPI.getConversationMessages(conversationId);
      if (response.code === 200 && response.body) {
        const loadedMessages: Message[] = response.body
          .filter((msg: any) => msg.role !== "tool")
          .map((msg: any, index: number) => {
            const message: Message = {
              id: Date.now() + index,
              text: msg.content || "",
              sender: msg.role === "user" ? "user" : "ai",
              timestamp: new Date(msg.createdAt || Date.now()),
              isStreaming: false,
            };

            if (msg.toolCall) {
              message.toolCall = {
                toolCallId: msg.toolCall.toolCallId,
                functionName: msg.toolCall.functionName,
                argumentsJson: msg.toolCall.argumentsJson,
              };
            }

            return message;
          });

        setMessages(loadedMessages);
      } else {
        setMessages([]);
      }
    } catch (error: any) {
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleDeleteConversation = async () => {
    if (!conversationToDelete) return;
    setIsDeletingConversation(true);

    try {
      const response = await chatAPI.deleteConversation(conversationToDelete);
      if (response.code === 200) {
        setConversations((prev) => prev.filter((c) => c.id !== conversationToDelete));
        if (selectedConversationId === conversationToDelete) {
          setMessages([]);
          setSelectedConversationId(null);
        }
      }
    } catch (error: any) {
      console.error("Failed to delete conversation:", error);
    } finally {
      setIsDeletingConversation(false);
      setShowDeleteModal(false);
      setConversationToDelete(null);
    }
  };

  return (
    <div className="flex h-full overflow-hidden" dir="rtl" style={{ backgroundColor: colors.background }}>
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Add Prompt Modal */}
        {showAddModal && (
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn backdrop-blur-sm">
            <div className="rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-fadeIn" style={{ backgroundColor: colors.cardBackground }}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg" style={{ color: colors.textPrimary }}>افزودن پرامپت جدید</h3>
                <button onClick={() => { setShowAddModal(false); setNewPrompt(""); }} className="transition-colors" style={{ color: colors.textSecondary }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <label className="block text-sm" style={{ color: colors.textSecondary }}>متن پرامپت</label>
                <textarea value={newPrompt} onChange={(e) => setNewPrompt(e.target.value)} placeholder="پرامپت دلخواه خود را وارد کنید..." className="w-full rounded-lg p-3 text-sm outline-none transition-colors resize-none" style={{ backgroundColor: colors.backgroundSecondary, borderWidth: "1px", borderStyle: "solid", borderColor: colors.border, color: colors.textPrimary }} rows={3} dir="rtl" autoFocus />
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => { setShowAddModal(false); setNewPrompt(""); }} className="px-4 py-2 text-sm transition-colors" style={{ color: colors.textSecondary }}>انصراف</button>
                <button onClick={handleAddPrompt} disabled={!newPrompt.trim()} className="px-4 py-2 text-sm text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: colors.primary }}>افزودن</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn backdrop-blur-sm">
            <div className="rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-fadeIn" style={{ backgroundColor: colors.cardBackground }}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg" style={{ color: colors.textPrimary }}>حذف چت</h3>
                <button onClick={() => { setShowDeleteModal(false); setConversationToDelete(null); }} disabled={isDeletingConversation} className="transition-colors" style={{ color: colors.textSecondary }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm" style={{ color: colors.textSecondary }}>آیا از حذف این چت اطمینان دارید؟ این عمل قابل بازگشت نیست.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => { setShowDeleteModal(false); setConversationToDelete(null); }} disabled={isDeletingConversation} className="px-4 py-2 text-sm transition-colors disabled:opacity-50" style={{ color: colors.textSecondary }}>انصراف</button>
                <button onClick={handleDeleteConversation} disabled={isDeletingConversation} className="px-4 py-3 text-sm text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" style={{ backgroundColor: colors.error }}>
                  {isDeletingConversation && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>حذف</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {isLoadingMessages && (
            <div className="mb-4 px-4 py-2 rounded-lg flex items-center gap-2 text-sm" style={{ backgroundColor: colors.primary + "20", color: colors.primary }}>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>در حال بارگذاری پیام‌ها...</span>
            </div>
          )}

          {(isConnecting || connectionError) && (
            <div className="mb-4 px-4 py-2 rounded-lg flex items-center gap-2 text-sm" style={{ backgroundColor: connectionError ? colors.error + "20" : colors.primary + "20", color: connectionError ? colors.error : colors.primary }}>
              {isConnecting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{connectionError || "در حال اتصال به سرور..."}</span>
            </div>
          )}

          {messages.length === 0 ? (
            <div className="max-w-3xl w-full space-y-4 sm:space-y-8">
              <div className="text-center space-y-2 sm:space-y-4">
                <h1 className="text-2xl sm:text-4xl" dir="auto" style={{ color: colors.textPrimary }}>مدیر گرامی</h1>
                <p className="text-base sm:text-xl" dir="auto" style={{ color: colors.textSecondary }}>چطور می‌توانم به شما کمک کنم؟</p>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
                {(Object.keys(tabContent) as TabType[]).map((tab) => {
                  const Icon = tabIcons[tab];
                  const isActive = activeTab === tab;
                  return (
                    <button key={tab} onClick={() => setActiveTab(tab)} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all text-xs sm:text-sm" style={{ backgroundColor: isActive ? colors.primary : colors.cardBackground, color: isActive ? "#ffffff" : colors.textSecondary, border: `1px solid ${isActive ? colors.primary : colors.border}` }}>
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{tabLabels[tab]}</span>
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {tabContent[activeTab].map((item, index) => (
                  <div key={index} className="p-3 sm:p-4 rounded-lg transition-colors" style={{ backgroundColor: colors.cardBackground, borderWidth: "1px", borderStyle: "solid", borderColor: colors.border }}>
                    <p className="text-xs sm:text-sm" dir="auto" style={{ color: colors.textPrimary }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl w-full space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"} animate-fadeIn`}>
                  <div className={`rounded-lg p-3 sm:p-4 space-y-3 ${message.sender === "user" ? "max-w-[85%] sm:max-w-[70%]" : message.toolCall ? "w-full" : "max-w-[85%] sm:max-w-[70%]"}`} style={{ backgroundColor: message.sender === "user" ? colors.primary : colors.cardBackground, color: message.sender === "user" ? "#ffffff" : colors.textPrimary, borderWidth: message.sender === "user" ? "0" : "1px", borderStyle: "solid", borderColor: message.sender === "user" ? "transparent" : colors.border }}>
                    
                    {message.sender === "ai" && message.status && message.statusTimestamp && (
                      <div className="flex items-center gap-2 pb-2 mb-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
                        <div className="relative flex items-center justify-center w-5 h-5">
                          <div className="absolute w-5 h-5 rounded-full animate-ping" style={{ backgroundColor: colors.primary, opacity: 0.4 }} />
                          <div className="relative w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium" style={{ color: colors.textPrimary }}>{message.status}</p>
                        </div>
                        <span className="text-xs" style={{ color: colors.textSecondary, opacity: 0.7 }}>
                          {message.statusTimestamp.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                    
                    {message.toolCall && (() => {
                      try {
                        const parsedData = JSON.parse(message.toolCall.argumentsJson);
                        switch (message.toolCall.functionName) {
                          case "render_table":
                            return <AITableRenderer data={parsedData} />;
                          case "render_bar_chart":
                            return <AIBarChart data={parsedData} />;
                          case "render_pie_chart":
                            return <AIPieChart data={parsedData} />;
                          case "render_donut_chart":
                            return <AIDonutChart data={parsedData} />;
                          case "render_line_chart":
                            return <AILineChart data={parsedData} />;
                          default:
                            return null;
                        }
                      } catch (error) {
                        return <div className="text-xs text-red-500">خطا در نمایش کامپوننت</div>;
                      }
                    })()}
                    
                    {message.text && (
                      message.sender === "user" ? (
                        <p className="text-xs sm:text-sm whitespace-pre-wrap" dir="auto" style={{ color: "#ffffff" }}>{message.text}</p>
                      ) : (
                        <div className="text-xs sm:text-sm" dir="auto">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({node, ...props}) => <h1 style={{ color: colors.textPrimary, fontSize: '1.5em', fontWeight: 'bold', marginTop: '0.75em', marginBottom: '0.5em', lineHeight: '1.3' }} {...props} />,
                              h2: ({node, ...props}) => <h2 style={{ color: colors.textPrimary, fontSize: '1.3em', fontWeight: 'bold', marginTop: '0.75em', marginBottom: '0.5em', lineHeight: '1.3' }} {...props} />,
                              h3: ({node, ...props}) => <h3 style={{ color: colors.textPrimary, fontSize: '1.1em', fontWeight: 'bold', marginTop: '0.75em', marginBottom: '0.5em', lineHeight: '1.3' }} {...props} />,
                              p: ({node, ...props}) => <p style={{ color: colors.textPrimary, marginTop: '0.5em', marginBottom: '0.5em', lineHeight: '1.6' }} {...props} />,
                              ul: ({node, ...props}) => <ul style={{ color: colors.textPrimary, paddingRight: '1.5em', marginTop: '0.5em', marginBottom: '0.5em', listStyleType: 'disc' }} {...props} />,
                              ol: ({node, ...props}) => <ol style={{ color: colors.textPrimary, paddingRight: '1.5em', marginTop: '0.5em', marginBottom: '0.5em' }} {...props} />,
                              li: ({node, ...props}) => <li style={{ color: colors.textPrimary, marginTop: '0.25em', marginBottom: '0.25em', lineHeight: '1.6' }} {...props} />,
                              code: ({node, inline, className, children, ...props}: any) => 
                                inline ? (
                                  <code style={{ backgroundColor: colors.backgroundSecondary, color: colors.primary, padding: '0.2em 0.4em', borderRadius: '0.25rem', fontSize: '0.9em', fontFamily: 'monospace' }} {...props}>{children}</code>
                                ) : (
                                  <pre style={{ backgroundColor: colors.backgroundSecondary, borderRadius: '0.5rem', padding: '1em', marginTop: '0.5em', marginBottom: '0.5em', overflowX: 'auto' }}>
                                    <code style={{ color: colors.textPrimary, fontSize: '0.9em', fontFamily: 'monospace' }} className={className} {...props}>{children}</code>
                                  </pre>
                                ),
                              a: ({node, ...props}) => <a style={{ color: colors.primary, textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer" {...props} />,
                              strong: ({node, ...props}) => <strong style={{ color: colors.textPrimary, fontWeight: 'bold' }} {...props} />,
                              em: ({node, ...props}) => <em style={{ color: colors.textPrimary, fontStyle: 'italic' }} {...props} />,
                              blockquote: ({node, ...props}) => <blockquote style={{ borderRight: `3px solid ${colors.border}`, paddingRight: '1em', marginRight: '0', color: colors.textSecondary, fontStyle: 'italic', marginTop: '0.5em', marginBottom: '0.5em' }} {...props} />,
                              hr: ({node, ...props}) => <hr style={{ borderColor: colors.border, marginTop: '1em', marginBottom: '1em' }} {...props} />,
                              table: ({node, ...props}) => <div style={{ overflowX: 'auto', marginTop: '0.5em', marginBottom: '0.5em' }}><table style={{ borderCollapse: 'collapse', width: '100%', color: colors.textPrimary }} {...props} /></div>,
                              th: ({node, ...props}) => <th style={{ border: `1px solid ${colors.border}`, padding: '0.5em', backgroundColor: colors.backgroundSecondary, color: colors.textPrimary, fontWeight: 'bold' }} {...props} />,
                              td: ({node, ...props}) => <td style={{ border: `1px solid ${colors.border}`, padding: '0.5em', color: colors.textPrimary }} {...props} />,
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
                        </div>
                      )
                    )}
                    
                    {message.sender === "ai" && (message.text || message.toolCall) && !message.isStreaming && (
                      <div className="flex items-center justify-end pt-2 mt-2" style={{ borderTop: `1px solid ${colors.border}40` }}>
                        <AICopyButton text={message.text} />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* AI Thinking Status Indicator */}
              {aiThinkingStatus && (
                <div className="flex justify-end animate-fadeIn">
                  <div className="rounded-lg px-4 py-3 flex items-center gap-3" style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.border}` }}>
                    {/* Animated dot grid */}
                    <div className="grid grid-cols-3 gap-[3px] w-[18px] h-[18px] flex-shrink-0">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div
                          key={i}
                          className="w-[4px] h-[4px] rounded-full"
                          style={{
                            backgroundColor: colors.textSecondary,
                            opacity: 0.4,
                            animation: `thinkingDot 1.4s ease-in-out ${i * 0.15}s infinite`,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-sm" style={{ color: colors.textSecondary }}>{aiThinkingStatus}</span>
                    {thinkingElapsed > 0 && (
                      <>
                        <span className="text-sm" style={{ color: colors.textSecondary, opacity: 0.5 }}>•</span>
                        <span className="text-sm tabular-nums" style={{ color: colors.textSecondary, opacity: 0.6 }}>{thinkingElapsed}s</span>
                      </>
                    )}
                    <style>{`
                      @keyframes thinkingDot {
                        0%, 100% { opacity: 0.25; transform: scale(0.8); }
                        50% { opacity: 0.8; transform: scale(1.1); }
                      }
                    `}</style>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t p-3 sm:p-6" style={{ borderColor: 'transparent', backgroundColor: 'transparent' }}>
          <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
            {messages.length === 0 && (
              <div className="flex gap-2 justify-center flex-wrap">
                {allSuggestions.map((suggestion, index) => {
                  const isCustom = index >= defaultSuggestions.length;
                  const customIndex = index - defaultSuggestions.length;
                  return (
                    <div key={index} className="relative group">
                      <button onClick={() => handleSuggestionClick(suggestion)} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors" style={{ backgroundColor: colors.cardBackground, color: colors.textPrimary, border: `1px solid ${colors.border}` }}>{suggestion}</button>
                      {isCustom && (
                        <button onClick={(e) => { e.stopPropagation(); handleDeletePrompt(customIndex); }} className="absolute -top-2 -left-2 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" style={{ backgroundColor: colors.error }} aria-label="حذف پرامپت">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <div className="rounded-full p-1.5 sm:p-2.5 flex items-center gap-2 sm:gap-3 border" style={{ backgroundColor: colors.cardBackground, borderColor: colors.border + '60', boxShadow: `0 0 20px 4px ${colors.primary}18, 0 0 40px 8px ${colors.primary}10, 0 0 0 1px ${colors.border}30` }}>
              <button onClick={handleSend} disabled={!inputValue.trim()} className="text-white p-1.5 sm:p-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed" aria-label="ارسال پیام" style={{ backgroundColor: colors.primary }}>
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={handleKeyPress} placeholder="پیام خود را اینجا بنویسید..." className="flex-1 bg-transparent outline-none text-xs sm:text-sm py-1 sm:py-1.5 px-2" style={{ color: colors.textPrimary }} dir="rtl" />
              <button onClick={() => setShowAddModal(true)} className="transition-colors" aria-label="افزودن پرامپت جدید" style={{ color: colors.textSecondary }}>
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ChatGPT-style Sidebar - Always visible, toggles between collapsed/expanded */}
      <div
        className="hidden md:flex flex-col fixed left-0 top-[64px] bottom-0 z-30 transition-all duration-300 ease-in-out"
        style={{
          width: isChatSidebarOpen ? '272px' : '60px',
          backgroundColor: colors.cardBackground,
          borderRight: `1px solid ${colors.border}40`,
        }}
        onMouseEnter={() => {
          if (!isChatSidebarOpen) {
            if (sidebarHoverTimeoutRef.current) clearTimeout(sidebarHoverTimeoutRef.current);
            sidebarHoverTimeoutRef.current = setTimeout(() => {
              sidebarHoverRef.current = true;
              setIsChatSidebarOpen(true);
            }, 200);
          }
        }}
        onMouseLeave={() => {
          if (sidebarHoverTimeoutRef.current) {
            clearTimeout(sidebarHoverTimeoutRef.current);
            sidebarHoverTimeoutRef.current = null;
          }
          if (sidebarHoverRef.current) {
            sidebarHoverRef.current = false;
            setIsChatSidebarOpen(false);
          }
        }}
      >
        {/* Top section - Logo & actions */}
        <div className="flex flex-col items-center gap-1 pt-3 px-2">
          {/* AI Logo */}
          

          {isChatSidebarOpen && (
            <div className="w-full flex items-center justify-between px-1 mb-1">
              <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>بینش AI</span>
            </div>
          )}

          {/* New Chat */}
          <button
            onClick={() => { setMessages([]); setInputValue(""); setSelectedConversationId(null); }}
            className={`flex items-center gap-3 rounded-lg transition-all hover:opacity-80 w-full ${isChatSidebarOpen ? 'px-3 py-2.5' : 'justify-center py-2.5'}`}
            style={{ color: colors.textPrimary }}
            title="چت جدید"
          >
            <Edit className="w-5 h-5 flex-shrink-0" />
            {isChatSidebarOpen && <span className="text-sm">چت جدید</span>}
          </button>

          {/* Search */}
          <button
            className={`flex items-center gap-3 rounded-lg transition-all hover:opacity-80 w-full ${isChatSidebarOpen ? 'px-3 py-2.5' : 'justify-center py-2.5'}`}
            style={{ color: colors.textSecondary }}
            title="جستجو"
          >
            <Search className="w-5 h-5 flex-shrink-0" />
            {isChatSidebarOpen && <span className="text-sm">جستجو</span>}
          </button>
        </div>

        {/* Divider */}
        <div className="mx-3 my-2" style={{ borderBottom: `1px solid ${colors.border}30` }} />

        {/* Conversations list - only in expanded mode */}
        {isChatSidebarOpen ? (
          <div className="flex-1 overflow-y-auto px-2">
            <h3 className="text-xs mb-2 px-2 pt-1" style={{ color: colors.textSecondary, opacity: 0.7 }}>چت‌های اخیر</h3>
            {isLoadingConversations ? (
              <div className="flex items-center justify-center py-4" style={{ color: colors.primary }}>
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : conversationsError ? (
              <div className="px-2 py-2 text-xs rounded-lg" style={{ color: colors.error, backgroundColor: colors.error + '15' }}>{conversationsError}</div>
            ) : conversations.length === 0 ? (
              <div className="px-2 py-3 text-xs text-center rounded-lg" style={{ color: colors.textSecondary, backgroundColor: colors.backgroundSecondary + '40' }}>هنوز چتی ندارید</div>
            ) : (
              <div className="space-y-0.5">
                {conversations.map((chat) => (
                  <div key={chat.id} className="group relative">
                    <button
                      className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg transition-all text-right"
                      style={{
                        color: colors.textPrimary,
                        backgroundColor: selectedConversationId === chat.id ? colors.primary + '15' : 'transparent',
                      }}
                      onClick={() => handleLoadConversation(chat.id)}
                      onMouseEnter={(e) => {
                        if (selectedConversationId !== chat.id) {
                          e.currentTarget.style.backgroundColor = colors.backgroundSecondary + '80';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = selectedConversationId === chat.id ? colors.primary + '15' : 'transparent';
                      }}
                    >
                      <MessageSquare className="w-4 h-4 flex-shrink-0 opacity-50" />
                      <span className="text-sm truncate flex-1" dir="auto">{chat.title}</span>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setConversationToDelete(chat.id); setShowDeleteModal(true); }}
                      className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all p-1 rounded-md"
                      style={{ color: colors.error, backgroundColor: colors.cardBackground }}
                      aria-label="حذف چت"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center gap-1 px-2 overflow-y-auto">
            {/* Show conversation icons in collapsed mode */}
            {conversations.slice(0, 8).map((chat) => (
              <button
                key={chat.id}
                onClick={() => { setIsChatSidebarOpen(true); handleLoadConversation(chat.id); }}
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:opacity-80 flex-shrink-0"
                style={{
                  backgroundColor: selectedConversationId === chat.id ? colors.primary + '15' : 'transparent',
                  color: selectedConversationId === chat.id ? colors.primary : colors.textSecondary,
                }}
                title={chat.title}
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            ))}
          </div>
        )}

        {/* Bottom section */}
        <div className="mt-auto px-2 pb-3 pt-2" style={{ borderTop: `1px solid ${colors.border}30` }}>
          {!isChatSidebarOpen ? (
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-white"
                style={{ backgroundColor: colors.primary }}
              >
                <User className="w-4 h-4" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg transition-colors cursor-pointer hover:opacity-80" style={{ backgroundColor: colors.backgroundSecondary + '40' }}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0"
                style={{ backgroundColor: colors.primary }}
              >
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: colors.textPrimary }}>مدیر سیستم</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showProjectPanel && (
        <ProjectCreationPanel isOpen={showProjectPanel} onClose={() => setShowProjectPanel(false)} onCreateProject={(projectData: ProjectData) => { setShowProjectPanel(false); }} />
      )}
    </div>
  );
}