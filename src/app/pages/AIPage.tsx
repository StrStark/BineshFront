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
} from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
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
  const [activeTab, setActiveTab] =
    useState<TabType>("capabilities");
  const [customPrompts, setCustomPrompts] = useState<string[]>(
    [],
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPrompt, setNewPrompt] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<
    string | null
  >(null);
  const [showProjectPanel, setShowProjectPanel] =
    useState(false);
  const [selectedProject, setSelectedProject] = useState<
    string | null
  >(null);
  const [projectHistories, setProjectHistories] = useState<
    Record<string, Message[]>
  >({});
  const [retryCount, setRetryCount] = useState(0);
  const [conversations, setConversations] = useState<
    ChatConversation[]
  >([]);
  const [isLoadingConversations, setIsLoadingConversations] =
    useState(false);
  const [conversationsError, setConversationsError] = useState<
    string | null
  >(null);
  const [selectedConversationId, setSelectedConversationId] =
    useState<string | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] =
    useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [conversationToDelete, setConversationToDelete] =
    useState<string | null>(null);
  const [isDeletingConversation, setIsDeletingConversation] =
    useState(false);
  const [isWebSocketConnected, setIsWebSocketConnected] =
    useState(false);
  const isMounted = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const streamingMessageIdRef = useRef<number | null>(null);
  const selectedConversationIdRef = useRef<string | null>(null);
  const messagesRef = useRef<Message[]>([]);
  const colors = useCurrentColors();

  // Sidebar Items
  const sidebarMenu = [
    { icon: Search, label: "جستجوی چت‌ها" },
    { icon: ImageIcon, label: "تصاویر" },
    { icon: LayoutGrid, label: "برنامه‌ها" },
    { icon: Code, label: "کدکس" },
  ];

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

  // Component mount status
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Sync selectedConversationId with ref
  useEffect(() => {
    selectedConversationIdRef.current = selectedConversationId;
    console.log(
      "selectedConversationId updated:",
      selectedConversationId,
    );
  }, [selectedConversationId]);

  // Sync messages with ref
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // WebSocket connection
  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;
    let isEffectActive = true;
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 10;

    const connectWebSocket = () => {
      try {
        // Don't close existing connection if it's already open
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          console.log("WebSocket already connected, skipping...");
          return;
        }

        // Close any existing connection that's not open
        if (wsRef.current) {
          wsRef.current.close();
        }

        if (isEffectActive) {
          setIsConnecting(true);
          setConnectionError(null);
        }

        console.log("Connecting to WebSocket...");
        const ws = new WebSocket(
          "wss://panel.bineshafzar.ir/api/WebSocket/ChatStreamSocket/Get",
        );

        ws.onopen = () => {
          console.log("WebSocket connected successfully");
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
            console.log("WebSocket message received:", data);

            // Handle ConversationCreated event
            if (
              data.type === "ConversationCreated" ||
              data.Type === "ConversationCreated"
            ) {
              const conversationId =
                data.payload || data.Payload;
              console.log(
                "New conversation created:",
                conversationId,
              );
              setSelectedConversationId(conversationId);

              // Reload conversations list to include the new conversation
              chatAPI
                .getConversations()
                .then((response) => {
                  if (response.code === 200 && response.body) {
                    setConversations(response.body);
                  }
                })
                .catch((error) => {
                  console.error(
                    "Failed to reload conversations:",
                    error,
                  );
                });
              return;
            }

            // Handle Component event (render_table, etc.)
            if (data.type === "Component" || data.Type === "Component") {
              const payload = data.payload || data.Payload;
              
              if (payload && payload.component) {
                console.log("Component received:", payload.component, payload.args);
                
                const newId = Date.now();
                const componentMessage: Message = {
                  id: newId,
                  text: "", // Will be filled by following Token messages
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

            // Handle Done event (streaming completed)
            if (data.type === "Done" || data.Type === "Done") {
              console.log("Streaming completed - WebSocket remains open");
              if (streamingMessageIdRef.current !== null) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === streamingMessageIdRef.current
                      ? { ...msg, isStreaming: false }
                      : msg,
                  ),
                );
              }
              streamingMessageIdRef.current = null;
              // CRITICAL: Don't close WebSocket - keep it open for next message
              return;
            }

            // Handle Token event (streaming AI response)
            if (
              data.type === "Token" ||
              data.Type === "Token"
            ) {
              const payload = data.payload || data.Payload;

              // If payload is null or undefined, ignore
              if (payload == null) {
                return;
              }

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
            console.error(
              "Error parsing WebSocket message:",
              error,
            );
          }
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          if (isEffectActive) {
            setConnectionError("عدم دسترسی به سرور هوش مصنوعی");
            setIsConnecting(false);
            setIsWebSocketConnected(false);
          }
        };

        ws.onclose = (event) => {
          console.log("WebSocket closed:", event.code, event.reason);
          wsRef.current = null;
          
          if (isEffectActive) {
            setIsConnecting(false);
            setIsWebSocketConnected(false);

            // Always try to reconnect unless it was intentional or max attempts reached
            if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
              reconnectAttempts++;
              const delay = Math.min(1000 * Math.pow(2, reconnectAttempts - 1), 10000);
              console.log(`WebSocket closed. Reconnecting in ${delay}ms... (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
              
              reconnectTimeout = setTimeout(() => {
                if (isEffectActive && isMounted.current) {
                  console.log("Attempting to reconnect WebSocket...");
                  connectWebSocket();
                }
              }, delay);
            } else {
              console.error("Max reconnection attempts reached");
              setConnectionError("اتصال به سرور قطع شد. لطفاً صفحه را رفرش کنید.");
            }
          }
        };

        wsRef.current = ws;
      } catch (error) {
        console.error("Error creating WebSocket:", error);
        if (isEffectActive) {
          setConnectionError("خطا در برقراری اتصال");
          setIsConnecting(false);
          setIsWebSocketConnected(false);
        }
      }
    };

    connectWebSocket();

    return () => {
      console.log("Cleaning up WebSocket connection");
      isEffectActive = false;
      clearTimeout(reconnectTimeout);
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounting");
        wsRef.current = null;
      }
    };
  }, []); // Empty dependency array - only connect once

  // Load custom prompts from localStorage
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

  // Load project histories from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("projectChatHistories");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        const histories: Record<string, Message[]> = {};
        Object.keys(parsed).forEach((key) => {
          histories[key] = parsed[key].map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
        });
        setProjectHistories(histories);
      } catch (e) {
        console.error("Failed to load project histories:", e);
      }
    }
  }, []);

  // Save project histories to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(projectHistories).length > 0) {
      localStorage.setItem(
        "projectChatHistories",
        JSON.stringify(projectHistories),
      );
    }
  }, [projectHistories]);

  // Save current chat to project history when messages change
  useEffect(() => {
    if (selectedProject && messages.length > 0) {
      setProjectHistories((prev) => ({
        ...prev,
        [selectedProject]: messages,
      }));
    }
  }, [messages, selectedProject]);

  // Load project chat history when project is selected
  const handleProjectSelect = (projectName: string) => {
    // Save current messages to current project before switching
    if (selectedProject && messages.length > 0) {
      setProjectHistories((prev) => ({
        ...prev,
        [selectedProject]: messages,
      }));
    }

    // Switch to new project
    setSelectedProject(projectName);

    // Load chat history for new project
    const projectHistory = projectHistories[projectName] || [];
    setMessages(projectHistory);
  };

  // Save custom prompts to localStorage
  useEffect(() => {
    if (customPrompts.length > 0) {
      localStorage.setItem(
        "customAIPrompts",
        JSON.stringify(customPrompts),
      );
    }
  }, [customPrompts]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    // Use setTimeout to ensure state has updated and refs are current
    setTimeout(() => {
      if (
        wsRef.current &&
        wsRef.current.readyState === WebSocket.OPEN
      ) {
        const token = getCookie("authToken");

        if (!token) {
          console.error("No auth token found");
          return;
        }

        // Build messages array for API using ref to get latest messages
        const apiMessages = messagesRef.current.map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        }));

        // Add the new user message
        apiMessages.push({
          role: "user",
          content: messageText,
        });

        const payload = {
          token: token,
          conversationId: selectedConversationIdRef.current,
          messages: apiMessages,
        };

        console.log("Sending WebSocket message:", payload);
        wsRef.current.send(JSON.stringify(payload));
      } else {
        // Fallback for when WebSocket is not connected (Demo Mode)
        setIsConnecting(true);
        setTimeout(() => {
          setIsConnecting(false);
          const newId = Date.now();
          const aiMessage: Message = {
            id: newId,
            text: "در حال حاضر ارتباط با سرور هوش مصنوعی برقرار نیست (نسخه نمایشی). لطفاً بعداً تلاش کنید یا اتصال اینترنت خود را بررسی نمایید.",
            sender: "ai",
            timestamp: new Date(),
            isStreaming: false,
          };
          setMessages((prev) => [...prev, aiMessage]);
        }, 1000);
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

  const allSuggestions = [
    ...defaultSuggestions,
    ...customPrompts,
  ];

  // Load conversation messages
  const handleLoadConversation = async (
    conversationId: string,
  ) => {
    setIsLoadingMessages(true);
    setSelectedConversationId(conversationId);

    try {
      const response =
        await chatAPI.getConversationMessages(conversationId);

      if (response.code === 200 && response.body) {
        // Convert API messages to our Message format
        const loadedMessages: Message[] = response.body
          .filter((msg: any) => msg.role !== "tool") // Skip tool messages
          .map((msg: any, index: number) => {
            const message: Message = {
              id: Date.now() + index,
              text: msg.content || "",
              sender: msg.role === "user" ? "user" : "ai",
              timestamp: new Date(msg.createdAt || Date.now()),
              isStreaming: false,
            };

            // Parse toolCall if exists
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
        console.error("Failed to load conversation messages");
        setMessages([]);
      }
    } catch (error: any) {
      console.error("Failed to load conversation:", error);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Delete conversation
  const handleDeleteConversation = async () => {
    if (!conversationToDelete) return;

    setIsDeletingConversation(true);

    try {
      const response = await chatAPI.deleteConversation(
        conversationToDelete,
      );

      if (response.code === 200) {
        // Remove from conversations list
        setConversations((prev) =>
          prev.filter((c) => c.id !== conversationToDelete),
        );

        // If the deleted conversation was selected, clear messages
        if (selectedConversationId === conversationToDelete) {
          setMessages([]);
          setSelectedConversationId(null);
        }
      } else {
        console.error("Failed to delete conversation");
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
    <div
      className="flex h-full overflow-hidden"
      dir="rtl"
      style={{ backgroundColor: colors.background }}
    >
      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Add Prompt Modal */}
        {showAddModal && (
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn backdrop-blur-sm">
            <div
              className="rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-fadeIn"
              style={{ backgroundColor: colors.cardBackground }}
            >
              <div className="flex items-center justify-between">
                <h3
                  className="text-lg"
                  style={{ color: colors.textPrimary }}
                >
                  افزودن پرامپت جدید
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewPrompt("");
                  }}
                  className="transition-colors"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color =
                      colors.textPrimary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color =
                      colors.textSecondary;
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <label
                  className="block text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  متن پرامپت
                </label>
                <textarea
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  placeholder="پرامپت دلخواه خود را وارد کنید..."
                  className="w-full rounded-lg p-3 text-sm outline-none transition-colors resize-none"
                  style={{
                    backgroundColor: colors.backgroundSecondary,
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      colors.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      colors.border;
                  }}
                  rows={3}
                  dir="rtl"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewPrompt("");
                  }}
                  className="px-4 py-2 text-sm transition-colors"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color =
                      colors.textPrimary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color =
                      colors.textSecondary;
                  }}
                >
                  انصراف
                </button>
                <button
                  onClick={handleAddPrompt}
                  disabled={!newPrompt.trim()}
                  className="px-4 py-2 text-sm text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: colors.primary }}
                >
                  افزودن
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn backdrop-blur-sm">
            <div
              className="rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-fadeIn"
              style={{ backgroundColor: colors.cardBackground }}
            >
              <div className="flex items-center justify-between">
                <h3
                  className="text-lg"
                  style={{ color: colors.textPrimary }}
                >
                  حذف چت
                </h3>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setConversationToDelete(null);
                  }}
                  className="transition-colors"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color =
                      colors.textPrimary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color =
                      colors.textSecondary;
                  }}
                  disabled={isDeletingConversation}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p
                className="text-sm"
                style={{ color: colors.textSecondary }}
              >
                آیا از حذف این چت اطمینان دارید؟ این عمل قابل
                بازگشت نیست.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setConversationToDelete(null);
                  }}
                  disabled={isDeletingConversation}
                  className="px-4 py-2 text-sm transition-colors disabled:opacity-50"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => {
                    if (!isDeletingConversation) {
                      e.currentTarget.style.color =
                        colors.textPrimary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDeletingConversation) {
                      e.currentTarget.style.color =
                        colors.textSecondary;
                    }
                  }}
                >
                  انصراف
                </button>
                <button
                  onClick={handleDeleteConversation}
                  disabled={isDeletingConversation}
                  className="px-4 py-3 text-sm text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  style={{ backgroundColor: colors.error }}
                >
                  {isDeletingConversation && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  <span>حذف</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Loading Messages Indicator */}
          {isLoadingMessages && (
            <div
              className="mb-4 px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
              style={{
                backgroundColor: colors.primary + "20",
                color: colors.primary,
              }}
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>در حال بارگذاری پیام‌ها...</span>
            </div>
          )}

          {/* Connection Status */}
          {(isConnecting || connectionError) && (
            <div
              className="mb-4 px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
              style={{
                backgroundColor: connectionError
                  ? colors.error + "20"
                  : colors.primary + "20",
                color: connectionError
                  ? colors.error
                  : colors.primary,
              }}
            >
              {isConnecting && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              <span>
                {connectionError || "در حال اتصال به سرور..."}
              </span>
            </div>
          )}

          {messages.length === 0 ? (
            // Welcome Screen
            <div className="max-w-3xl w-full space-y-4 sm:space-y-8">
              {/* Welcome Header */}
              <div className="text-center space-y-2 sm:space-y-4">
                <h1
                  className="text-2xl sm:text-4xl"
                  dir="auto"
                  style={{ color: colors.textPrimary }}
                >
                  {selectedProject
                    ? selectedProject
                    : "مدیر گرامی"}
                </h1>
                <p
                  className="text-base sm:text-xl"
                  dir="auto"
                  style={{ color: colors.textSecondary }}
                >
                  چطور می‌توانم به شما کمک کنم؟
                </p>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
                {(Object.keys(tabContent) as TabType[]).map(
                  (tab) => {
                    const Icon = tabIcons[tab];
                    const isActive = activeTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all text-xs sm:text-sm"
                        style={{
                          backgroundColor: isActive
                            ? colors.primary
                            : colors.cardBackground,
                          color: isActive
                            ? "#ffffff"
                            : colors.textSecondary,
                          border: `1px solid ${isActive ? colors.primary : colors.border}`,
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor =
                              colors.backgroundSecondary;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor =
                              colors.cardBackground;
                          }
                        }}
                      >
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>{tabLabels[tab]}</span>
                      </button>
                    );
                  },
                )}
              </div>

              {/* Tab Content */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {tabContent[activeTab].map((item, index) => (
                  <div
                    key={index}
                    className="p-3 sm:p-4 rounded-lg transition-colors"
                    style={{
                      backgroundColor: colors.cardBackground,
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: colors.border,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        colors.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        colors.border;
                    }}
                  >
                    <p
                      className="text-xs sm:text-sm"
                      dir="auto"
                      style={{ color: colors.textPrimary }}
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Messages Area
            <div className="max-w-3xl w-full space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"} animate-fadeIn`}
                >
                  <div
                    className={`rounded-lg p-3 sm:p-4 space-y-3 ${
                      message.sender === "user"
                        ? "max-w-[85%] sm:max-w-[70%]"
                        : message.toolCall
                        ? "w-full"
                        : "max-w-[85%] sm:max-w-[70%]"
                    }`}
                    style={{
                      backgroundColor:
                        message.sender === "user"
                          ? colors.primary
                          : colors.cardBackground,
                      color:
                        message.sender === "user"
                          ? "#ffffff"
                          : colors.textPrimary,
                      borderWidth:
                        message.sender === "user" ? "0" : "1px",
                      borderStyle: "solid",
                      borderColor:
                        message.sender === "user"
                          ? "transparent"
                          : colors.border,
                    }}
                  >
                    {/* Render component based on toolCall functionName */}
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
                        console.error("Error rendering component:", error);
                        return (
                          <div className="text-xs text-red-500">
                            خطا در نمایش کامپوننت
                          </div>
                        );
                      }
                    })()}
                    
                    {/* Render text if it exists (explanation after component) */}
                    {message.text && (
                      <p
                        className="text-xs sm:text-sm"
                        dir="auto"
                      >
                        {message.text}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div
          className="border-t p-3 sm:p-6"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.cardBackground,
          }}
        >
          <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
            {/* Suggestions */}
            {messages.length === 0 && (
              <div className="flex gap-2 justify-center flex-wrap">
                {allSuggestions.map((suggestion, index) => {
                  const isCustom =
                    index >= defaultSuggestions.length;
                  const customIndex =
                    index - defaultSuggestions.length;

                  return (
                    <div key={index} className="relative group">
                      <button
                        onClick={() =>
                          handleSuggestionClick(suggestion)
                        }
                        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors"
                        style={{
                          backgroundColor:
                            colors.cardBackground,
                          color: colors.textPrimary,
                          border: `1px solid ${colors.border}`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            colors.backgroundSecondary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            colors.cardBackground;
                        }}
                      >
                        {suggestion}
                      </button>

                      {isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePrompt(customIndex);
                          }}
                          className="absolute -top-2 -left-2 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          style={{
                            backgroundColor: colors.error,
                          }}
                          aria-label="حذف پرامپت"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Input Box */}
            <div
              className="rounded-lg p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3"
              style={{
                backgroundColor: colors.backgroundSecondary,
              }}
            >
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="text-white p-1.5 sm:p-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="ارسال پیام"
                style={{ backgroundColor: colors.primary }}
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                className="hidden sm:block transition-colors"
                style={{ color: colors.textSecondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color =
                    colors.textPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    colors.textSecondary;
                }}
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="پیام خود را اینجا بنویسید..."
                className="flex-1 bg-transparent outline-none text-xs sm:text-sm"
                style={{ color: colors.textPrimary }}
                dir="rtl"
              />

              <button
                onClick={() => setShowAddModal(true)}
                className="transition-colors"
                aria-label="افزودن پرامپت جدید"
                style={{ color: colors.textSecondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color =
                    colors.textPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    colors.textSecondary;
                }}
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Right side (now on left in visual order because it is second child in RTL) */}
      <div
        className="w-72 flex-shrink-0 flex flex-col border-r fixed right-0 top-[64px] bottom-0 overflow-y-auto hidden md:flex transition-colors duration-200"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        {/* New Chat Button */}
        <div className="p-3 sticky top-0 bg-inherit z-10">
          <button
            onClick={() => {
              setMessages([]);
              setInputValue("");
              setSelectedConversationId(null);
            }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg border transition-all hover:opacity-80 shadow-sm"
            style={{
              borderColor: colors.border,
              color: colors.textPrimary,
              backgroundColor: colors.backgroundSecondary,
            }}
          >
            <Edit className="w-4 h-4" />
            <span className="text-sm font-medium">چت جدید</span>
          </button>
        </div>

        {/* Menu Items */}

        {/* Projects */}
        <div className="px-3 py-4 mt-2">
          <h3
            className="text-xs font-semibold mb-2 px-3 opacity-60"
            style={{ color: colors.textSecondary }}
          >
            پروژه‌ها
          </h3>
          <button
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: colors.textPrimary }}
            onClick={() => setShowProjectPanel(true)}
          >
            <FolderPlus className="w-5 h-5 opacity-70" />
            <span className="text-sm">پروژه جدید</span>
          </button>
          {projects.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleProjectSelect(item.label)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all hover:bg-black/5 dark:hover:bg-white/5"
              style={{
                color: colors.textPrimary,
                backgroundColor:
                  selectedProject === item.label
                    ? colors.primary + "15"
                    : "transparent",
              }}
            >
              <Folder className="w-5 h-5 opacity-70" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Your Chats */}
        <div className="px-3 py-2 flex-1 overflow-y-auto mt-2">
          <h3
            className="text-xs font-semibold mb-2 px-3 opacity-60"
            style={{ color: colors.textSecondary }}
          >
            چت‌های شما
          </h3>
          {isLoadingConversations ? (
            <div
              className="flex items-center justify-center py-4"
              style={{ color: colors.textSecondary }}
            >
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : conversationsError ? (
            <div
              className="px-3 py-2 text-xs"
              style={{ color: colors.error }}
            >
              {conversationsError}
            </div>
          ) : conversations.length === 0 ? (
            <div
              className="px-3 py-2 text-xs opacity-60"
              style={{ color: colors.textSecondary }}
            >
              هنوز چتی ندارید
            </div>
          ) : (
            conversations.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center gap-2 w-full group relative"
              >
                <button
                  className="flex flex-col items-start gap-1 flex-1 px-3 py-2.5 rounded-lg transition-all hover:bg-black/5 dark:hover:bg-white/5 text-right"
                  style={{
                    color: colors.textPrimary,
                    backgroundColor:
                      selectedConversationId === chat.id
                        ? colors.primary + "15"
                        : "transparent",
                  }}
                  onClick={() => {
                    handleLoadConversation(chat.id);
                  }}
                >
                  <span
                    className="text-sm truncate w-full opacity-80 group-hover:opacity-100"
                    dir="auto"
                  >
                    {chat.title}
                  </span>
                  <span
                    className="text-xs opacity-50"
                    style={{ color: colors.textSecondary }}
                  >
                    {new Date(
                      chat.updatedAt,
                    ).toLocaleDateString("fa-IR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConversationToDelete(chat.id);
                    setShowDeleteModal(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"
                  style={{ color: colors.error }}
                  aria-label="حذف چت"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Project Creation Panel */}
      {showProjectPanel && (
        <ProjectCreationPanel
          isOpen={showProjectPanel}
          onClose={() => setShowProjectPanel(false)}
          onCreateProject={(projectData: ProjectData) => {
            // Handle project creation
            console.log("Project Created:", projectData);
            setShowProjectPanel(false);
          }}
        />
      )}
    </div>
  );
}