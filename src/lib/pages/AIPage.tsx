"use client"

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Square,
  Plus,
  AlertTriangle,
  Sparkles,
  Lightbulb,
  X,
  Trash2,
  Loader2,
  Edit,
  Search,
  MessageSquare,
  User,
  Pin,
  Pencil,
  Key,
  Eye,
  EyeOff,
  Settings,
  Bot,
  BookOpen,
  ChevronLeft,
} from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import {
  ProjectCreationPanel,
  ProjectData,
} from "../components/ProjectCreationPanel";
import { AITableRenderer } from "../components/AITableRenderer";
import { AIBarChart } from "../components/AIBarChart";
import { AIPieChart } from "../components/AIPieChart";
import { AIDonutChart } from "../components/AIDonutChart";
import { AILineChart } from "../components/AILineChart";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AICopyButton } from "../components/AIExportButtons";
import { useChatSessions } from "../hooks/useChatSessions";
import { useAiSettings, type AiSettings } from "../hooks/useAiSettings";

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
  const [aiThinkingStatus, setAiThinkingStatus] = useState<string | null>(null);
  const [thinkingStartTime, setThinkingStartTime] = useState<number | null>(null);
  const [thinkingElapsed, setThinkingElapsed] = useState(0);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"personality" | "apikey">("personality");
  const [usageStats, setUsageStats] = useState(() => {
    const saved = localStorage.getItem("aiUsageStats");
    return saved ? JSON.parse(saved) : { totalTokens: 0, totalCost: 0, sessionTokens: 0 };
  });
  const [availableModels] = useState<{ id: string }[]>([
    { id: "gapgpt-qwen-3.5" },
    { id: "gapgpt-qwen-3.5-thinking" },
    { id: "gapgpt-qwen-3.6" },
    { id: "gapgpt-qwen-3.6-thinking" },
  ]);
  const [loadingModels] = useState(false);
  const [modelError] = useState<string | null>(null);
  const [draftSettings, setDraftSettings] = useState<AiSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userName, setUserName] = useState("");

  const chatSessions = useChatSessions();
  const aiSettings = useAiSettings();
  const settings = aiSettings.settings;

  // Fetch logged-in user's name
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((json) => {
        const data = json.body || json.data || json;
        if (data.name) setUserName(data.name);
      })
      .catch(() => {});
  }, []);

  // Sync settings into draft when modal opens
  useEffect(() => {
    if (showSettings && settings) {
      setDraftSettings({ ...settings })
    }
  }, [showSettings, settings])
  const isMounted = useRef(true);
  const sessionIdRef = useRef<string | null>(null);
  const sendingRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const streamingMessageIdRef = useRef<number | null>(null);
  const messagesRef = useRef<Message[]>([]);
  const colors = useCurrentColors();
  const [renamingSessionId, setRenamingSessionId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [expandedConversations, setExpandedConversations] = useState<Set<string>>(new Set());

  const currentSessionId = chatSessions.currentSessionId;

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


  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);


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

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    if (sendingRef.current) return;

    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    sendingRef.current = true;
    setIsProcessing(true);

    let sessionId = chatSessions.currentSessionId || sessionIdRef.current;

    // Create session if none is active
    if (!sessionId) {
      try {
        sessionId = await chatSessions.createSession(inputValue);
        sessionIdRef.current = sessionId;
      } catch {
        // Session creation failed (e.g. auth issue); send anyway without saving
      }
    }

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
    setConnectionError(null);

    const apiMessages = messagesRef.current.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    }));

    apiMessages.push({
      role: "user",
      content: messageText,
    });

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, conversationId: sessionId }),
        signal: controller.signal,
      });

      if (!response.ok) {
        let errMsg = "خطا در ارتباط با سرور";
        try {
          const errText = await response.text();
          const m = errText.match(/data: ({.*?})/);
          if (m) {
            const parsed = JSON.parse(m[1]);
            if (parsed.message) errMsg = parsed.message;
          } else if (errText) {
            errMsg = errText;
          }
        } catch {
          // ignore parse errors
        }
        throw new Error(errMsg);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");
      readerRef.current = reader;

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let currentEvent = "";

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            try {
              const data = JSON.parse(dataStr);

              if (currentEvent === "status" && data.status) {
                setAiThinkingStatus(data.status);
                if (streamingMessageIdRef.current !== null) {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === streamingMessageIdRef.current
                        ? { ...msg, status: data.status, statusTimestamp: new Date() }
                        : msg,
                    ),
                  );
                }
              } else if (currentEvent === "token" && data.token != null) {
                setAiThinkingStatus(null);
                setThinkingStartTime(null);

                if (streamingMessageIdRef.current === null) {
                  const newId = Date.now();
                  streamingMessageIdRef.current = newId;
                  const aiMessage: Message = {
                    id: newId,
                    text: data.token,
                    sender: "ai",
                    timestamp: new Date(),
                    isStreaming: true,
                  };
                  setMessages((prev) => [...prev, aiMessage]);
                } else {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === streamingMessageIdRef.current
                        ? { ...msg, text: msg.text + data.token }
                        : msg,
                    ),
                  );
                }
              } else if (currentEvent === "done") {
                setAiThinkingStatus(null);
                setThinkingStartTime(null);
                if (streamingMessageIdRef.current !== null) {
                  const finalMsgs = messagesRef.current;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === streamingMessageIdRef.current
                        ? { ...msg, isStreaming: false, status: undefined, statusTimestamp: undefined }
                        : msg,
                    ),
                  );

                  // Persist messages to session
                  if (sessionId) {
                    const firstUserText = finalMsgs.find((m) => m.sender === "user")?.text;
                    chatSessions.saveMessagesToSession(
                      sessionId,
                      finalMsgs.map((m) => ({
                        id: m.id,
                        text: m.text,
                        sender: m.sender,
                        timestamp: m.timestamp.toISOString(),
                        isStreaming: false,
                        toolCall: m.toolCall
                          ? { toolCallId: m.toolCall.toolCallId, functionName: m.toolCall.functionName, argumentsJson: m.toolCall.argumentsJson }
                          : undefined,
                        status: m.status,
                        statusTimestamp: m.statusTimestamp?.toISOString(),
                      })),
                      firstUserText,
                    )
                  }
                }
                streamingMessageIdRef.current = null;
                playDoneBeep();
              } else if (currentEvent === "usage" && data.totalTokens) {
                const costPerModel: Record<string, { in: number; out: number }> = {
                  "gapgpt-qwen-3.5": { in: 0.25, out: 2.00 },
                  "gapgpt-qwen-3.5-thinking": { in: 0.25, out: 2.00 },
                  "gapgpt-qwen-3.6": { in: 0.25, out: 2.00 },
                  "gapgpt-qwen-3.6-thinking": { in: 0.25, out: 2.00 },
                };
                const rates = costPerModel[data.model];
                const costUsd = rates
                  ? (data.promptTokens / 1_000_000 * rates.in) + (data.completionTokens / 1_000_000 * rates.out)
                  : 0;
                setUsageStats((prev: typeof usageStats) => {
                  const next = {
                    totalTokens: prev.totalTokens + data.totalTokens,
                    totalCost: prev.totalCost + costUsd,
                    sessionTokens: data.totalTokens,
                  };
                  localStorage.setItem("aiUsageStats", JSON.stringify(next));
                  return next;
                });
              } else if (currentEvent === "error") {
                setConnectionError(data.message || "خطا در پردازش درخواست");
                setAiThinkingStatus(null);
                setThinkingStartTime(null);
              }
            } catch {
              // Invalid JSON in SSE data, skip
            }
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && (err.name === "AbortError" || err.name === "TypeError")) {
        // Request was aborted or stream cancelled (user pressed stop)
        return;
      }
      const errorMsg = err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور هوش مصنوعی";
      setConnectionError(errorMsg);
      setAiThinkingStatus(null);
      setThinkingStartTime(null);
    } finally {
      sendingRef.current = false;
      setIsProcessing(false);
      readerRef.current = null;
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
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

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto">
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
              <button
                onClick={isProcessing ? () => {
                  readerRef.current?.cancel();
                  abortControllerRef.current?.abort();
                  setIsProcessing(false);
                  setAiThinkingStatus(null);
                  setThinkingStartTime(null);
                  if (streamingMessageIdRef.current !== null) {
                    setMessages((prev) => prev.filter((m) => m.id !== streamingMessageIdRef.current));
                    streamingMessageIdRef.current = null;
                  }
                } : handleSend}
                disabled={!isProcessing && !inputValue.trim()}
                className="text-white p-1.5 sm:p-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={isProcessing ? "توقف" : "ارسال پیام"}
                style={{ backgroundColor: isProcessing ? colors.error : colors.primary }}
              >
                {isProcessing ? <Square className="w-4 h-4 sm:w-5 sm:h-5" /> : <Send className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={handleKeyPress} placeholder="پیام خود را اینجا بنویسید..." className="flex-1 bg-transparent outline-none text-xs sm:text-sm py-1 sm:py-1.5 px-2" style={{ color: colors.textPrimary }} dir="rtl" />
              <button onClick={() => setShowAddModal(true)} className="transition-colors" aria-label="افزودن پرامپت جدید" style={{ color: colors.textSecondary }}>
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Left sidebar - hover expand like main sidebar */}
      <div
        className="group hidden md:flex flex-col fixed top-0 left-0 z-30 h-screen w-20 transition-all duration-300 ease-in-out hover:w-80 overflow-hidden pt-[56px]"
        style={{
          backgroundColor: colors.cardBackground,
          borderRight: `1px solid ${colors.border}40`,
        }}
      >
        <div className="flex flex-col gap-1 p-3">

          {/* New Chat */}
          <button
            onClick={() => {
              sessionIdRef.current = null;
              chatSessions.newChat();
              setMessages([]);
              setInputValue("");
            }}
            className="flex h-12 w-full items-center gap-0 group-hover:gap-3 rounded-xl px-0 group-hover:px-3 text-sm font-medium transition-all duration-200 hover:opacity-80 justify-center group-hover:justify-start overflow-hidden"
            style={{ color: colors.textPrimary }}
            title="چت جدید"
          >
            <span className="flex h-12 w-10 shrink-0 items-center justify-center">
              <Edit className="h-5 w-5 shrink-0" />
            </span>
            <span className="whitespace-nowrap transition-all duration-200 opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden">چت جدید</span>
          </button>

          {/* Search */}
          <button
            className="flex h-12 w-full items-center gap-0 group-hover:gap-3 rounded-xl px-0 group-hover:px-3 text-sm font-medium transition-all duration-200 hover:opacity-80 justify-center group-hover:justify-start overflow-hidden"
            style={{ color: colors.textSecondary }}
            title="جستجو"
          >
            <span className="flex h-12 w-10 shrink-0 items-center justify-center">
              <Search className="h-5 w-5 shrink-0" />
            </span>
            <span className="whitespace-nowrap transition-all duration-200 opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden">جستجو</span>
          </button>
        </div>

        {/* Divider */}
        <div className="mx-3 my-2" style={{ borderBottom: `1px solid ${colors.border}30` }} />

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto px-2">
          <div className="w-full px-2 pt-1 mb-2">
            <span className="text-xs whitespace-nowrap transition-all duration-200 opacity-0 group-hover:opacity-100 overflow-hidden" style={{ color: colors.textSecondary }}>تاریخچه گفت و گوها</span>
          </div>
          {chatSessions.sortedSessions.length === 0 ? (
            <div className="px-2 py-3 text-xs text-center transition-opacity duration-200 opacity-0 group-hover:opacity-100 rounded-lg" style={{ color: colors.textSecondary, backgroundColor: colors.backgroundSecondary + '40' }}>هنوز گفت و گویی ندارید</div>
          ) : (
            <div className="space-y-0.5">
              {chatSessions.sortedSessions.map((conv) => {
                const isExpanded = expandedConversations.has(conv.id);
                const isActive = currentSessionId === conv.id;
                return (
                  <div key={conv.id} className="group/session">
                    {/* Conversation header */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setExpandedConversations((prev) => {
                            const next = new Set(prev);
                            if (next.has(conv.id)) next.delete(conv.id);
                            else next.add(conv.id);
                            return next;
                          });
                        }}
                        className="shrink-0 w-0 group-hover/session:w-7 h-7 flex items-center justify-center rounded-lg overflow-hidden opacity-0 group-hover/session:opacity-100 transition-all duration-200"
                        style={{ color: colors.textSecondary }}
                        title={isExpanded ? "بستن" : "باز کردن"}
                      >
                        <ChevronLeft className={`w-3.5 h-3.5 shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                      </button>
                      <button
                        className="flex h-12 items-center gap-0 group-hover:gap-3 rounded-xl px-0 group-hover:px-3 text-sm font-medium transition-all duration-200 text-right flex-1 min-w-0 justify-center group-hover:justify-start overflow-hidden"
                        style={{
                          color: colors.textPrimary,
                          backgroundColor: isActive ? colors.primary + '15' : 'transparent',
                        }}
                        onClick={async () => {
                          await chatSessions.loadSession(conv.id);
                          sessionIdRef.current = conv.id;
                          const msgs = chatSessions.loadedSessionMessages;
                          if (msgs) {
                            setMessages(
                              msgs.map((m) => ({
                                id: m.id,
                                text: m.text,
                                sender: m.sender,
                                timestamp: new Date(m.timestamp),
                                isStreaming: m.isStreaming,
                                toolCall: m.toolCall,
                                status: m.status,
                                statusTimestamp: m.statusTimestamp ? new Date(m.statusTimestamp) : undefined,
                              })),
                            );
                          }
                        }}
                        title={conv.title}
                      >
                        <span className="flex h-12 w-10 shrink-0 items-center justify-center">
                          <MessageSquare className="h-5 w-5 shrink-0" />
                        </span>
                        {renamingSessionId === conv.id ? (
                          <input
                            autoFocus
                            className="text-sm bg-transparent outline-none border-b flex-1 min-w-0"
                            style={{ color: colors.textPrimary, borderColor: colors.primary }}
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onBlur={() => {
                              if (renameValue.trim()) {
                                chatSessions.renameSession(conv.id, renameValue.trim());
                              }
                              setRenamingSessionId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                if (renameValue.trim()) {
                                  chatSessions.renameSession(conv.id, renameValue.trim());
                                }
                                setRenamingSessionId(null);
                              }
                              if (e.key === "Escape") setRenamingSessionId(null);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span className="text-sm truncate whitespace-nowrap transition-all duration-200 opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto group-hover:flex-1 overflow-hidden" dir="auto">
                            {conv.pinned && "📌 "}{conv.title}
                          </span>
                        )}
                      </button>
                      {/* Pin button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); chatSessions.togglePinSession(conv.id); }}
                        className="shrink-0 w-0 group-hover/session:w-7 h-7 flex items-center justify-center rounded-lg overflow-hidden opacity-0 group-hover/session:opacity-100 transition-all duration-200"
                        style={{ color: conv.pinned ? colors.primary : colors.textSecondary }}
                        title={conv.pinned ? "لغو سنجاق" : "سنجاق کردن"}
                      >
                        <Pin className="w-3.5 h-3.5 shrink-0" />
                      </button>
                      {/* Rename button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenamingSessionId(conv.id);
                          setRenameValue(conv.title);
                        }}
                        className="shrink-0 w-0 group-hover/session:w-7 h-7 flex items-center justify-center rounded-lg overflow-hidden opacity-0 group-hover/session:opacity-100 transition-all duration-200"
                        style={{ color: colors.textSecondary }}
                        title="تغییر نام"
                      >
                        <Pencil className="w-3.5 h-3.5 shrink-0" />
                      </button>
                      {/* Delete button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); if (currentSessionId === conv.id) { sessionIdRef.current = null; } chatSessions.deleteSession(conv.id); if (currentSessionId === conv.id) { setMessages([]); } }}
                        className="shrink-0 w-0 group-hover/session:w-7 h-7 flex items-center justify-center rounded-lg overflow-hidden opacity-0 group-hover/session:opacity-100 transition-all duration-200 hover:!opacity-100"
                        style={{ color: colors.error }}
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    </div>
                    {/* Nested sessions */}
                    {isExpanded && conv.sessions.length > 0 && (
                      <div className="mr-8 border-r pr-2 space-y-0.5" style={{ borderColor: colors.border + '40' }}>
                        {conv.sessions.map((s) => (
                          <div key={s.id} className="flex items-center gap-1">
                            <button
                              className="flex h-9 items-center gap-2 rounded-lg px-2 text-xs font-medium transition-all duration-200 text-right flex-1 min-w-0 hover:opacity-80"
                              style={{
                                color: colors.textSecondary,
                              }}
                              onClick={async () => {
                                await chatSessions.loadSession(conv.id);
                                sessionIdRef.current = conv.id;
                                const msgs = chatSessions.loadedSessionMessages;
                                if (msgs) {
                                  setMessages(
                                    msgs.map((m) => ({
                                      id: m.id,
                                      text: m.text,
                                      sender: m.sender,
                                      timestamp: new Date(m.timestamp),
                                      isStreaming: m.isStreaming,
                                      toolCall: m.toolCall,
                                      status: m.status,
                                      statusTimestamp: m.statusTimestamp ? new Date(m.statusTimestamp) : undefined,
                                    })),
                                  );
                                }
                              }}
                              title={s.userText}
                            >
                              <span className="w-3 h-3 rounded-full shrink-0" style={{
                                backgroundColor: s.status === "done" ? colors.success || "#22c55e"
                                  : s.status === "error" ? colors.error
                                  : s.status === "processing" ? colors.primary
                                  : colors.textSecondary,
                                opacity: s.status === "processing" ? 0.7 : 0.5,
                              }} />
                              <span className="truncate" dir="auto">{s.userText.slice(0, 30)}{s.userText.length > 30 ? "…" : ""}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mx-3 my-2" style={{ borderBottom: `1px solid ${colors.border}30` }} />

        {/* Settings */}
        <div className="px-3 pb-3">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex h-12 w-full items-center gap-0 group-hover:gap-3 rounded-xl px-0 group-hover:px-3 text-sm font-medium transition-all duration-200 hover:opacity-80 justify-center group-hover:justify-start overflow-hidden"
                    style={{ color: colors.textSecondary }}
                    title="تنظیمات"
                  >
                    <span className="flex h-12 w-10 shrink-0 items-center justify-center">
                      <Settings className="h-5 w-5 shrink-0" />
                    </span>
                    <span className="whitespace-nowrap transition-all duration-200 opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden">تنظیمات</span>
                  </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn backdrop-blur-sm">
          <div className="rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col animate-fadeIn" style={{ backgroundColor: colors.cardBackground }}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>تنظیمات هوش مصنوعی</h3>
              <button onClick={() => setShowSettings(false)} className="transition-colors" style={{ color: colors.textSecondary }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-6 border-b" style={{ borderColor: colors.border }}>
              <button
                onClick={() => setSettingsTab("personality")}
                className="px-4 py-2.5 text-sm font-medium transition-colors border-b-2"
                style={{
                  color: settingsTab === "personality" ? colors.primary : colors.textSecondary,
                  borderColor: settingsTab === "personality" ? colors.primary : "transparent",
                }}
              >
                شخصی‌سازی
              </button>
              <button
                onClick={() => setSettingsTab("apikey")}
                className="px-4 py-2.5 text-sm font-medium transition-colors border-b-2"
                style={{
                  color: settingsTab === "apikey" ? colors.primary : colors.textSecondary,
                  borderColor: settingsTab === "apikey" ? colors.primary : "transparent",
                }}
              >
                API Key و مدل
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {settingsTab === "personality" ? (
                <>
                  {/* Character Selection */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
                      <Bot className="w-4 h-4" />
                      انتخاب شخصیت
                    </label>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>شخصیت مورد نظر خود را انتخاب کنید</p>
                    <div className="flex flex-wrap gap-2">
                      {["حرفه‌ای", "خوره", "دوستانه", "خلاق"].map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            setDraftSettings((prev) => prev ? { ...prev, character: c } : prev);
                          }}
                          className="px-3 py-1.5 text-sm rounded-lg transition-colors"
                          style={{
                            backgroundColor: draftSettings?.character === c ? colors.primary : colors.backgroundSecondary,
                            color: draftSettings?.character === c ? "#fff" : colors.textPrimary,
                          }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Instructions */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
                      <BookOpen className="w-4 h-4" />
                      دستورات
                    </label>
                    <textarea
                      value={draftSettings?.customInstructions || ""}
                      onChange={(e) => {
                        setDraftSettings((prev) => prev ? { ...prev, customInstructions: e.target.value } : prev);
                      }}

                      placeholder="پاسخ‌ها را به صورت کاملا حرفه‌ای، دقیق و ساختاریافته ارائه کن..."
                      className="w-full rounded-lg p-3 text-sm outline-none transition-colors resize-none"
                      style={{
                        backgroundColor: colors.backgroundSecondary,
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: colors.border,
                        color: colors.textPrimary,
                      }}
                      rows={4}
                    />
                  </div>

                  {/* About You */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
                      <User className="w-4 h-4" />
                      درباره شما
                    </label>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>اطلاعات شما برای پاسخ‌های شخصی‌سازی‌شده</p>
                    <div className="rounded-lg p-3" style={{ backgroundColor: colors.backgroundSecondary, borderWidth: "1px", borderStyle: "solid", borderColor: colors.border }}>
                      <p className="text-sm" style={{ color: colors.textPrimary }}>
                        {userName || "در حال بارگذاری..."}
                      </p>
                    </div>
                  </div>

                </>
              ) : (
                <div className="space-y-5">
                  {/* Model Selection */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
                      <Bot className="w-4 h-4" />
                      مدل هوش مصنوعی
                    </label>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>مدل GapGPT</p>

                    <select
                      value={draftSettings?.model || "gapgpt-qwen-3.6"}
                      onChange={(e) => setDraftSettings((prev) => prev ? { ...prev, model: e.target.value } : prev)}
                      className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
                      style={{
                        backgroundColor: colors.backgroundSecondary,
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: colors.border,
                        color: colors.textPrimary,
                      }}
                    >
                      {availableModels.map((m) => (
                        <option key={m.id} value={m.id}>{m.id}</option>
                      ))}
                    </select>
                  </div>

                  {/* API Key */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
                      <Key className="w-4 h-4" />
                      کلید API
                    </label>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                      کلید provider خود را وارد کنید
                    </p>
                    <div className="flex items-center gap-2 rounded-lg px-3" style={{ backgroundColor: colors.backgroundSecondary, borderWidth: "1px", borderStyle: "solid", borderColor: colors.border }}>
                      <input
                        type={showApiKey ? "text" : "password"}
                        value={draftSettings?.apiKey || ""}
                        onChange={(e) => setDraftSettings((prev) => prev ? { ...prev, apiKey: e.target.value } : prev)}
                        placeholder="sk-..."
                        className="flex-1 bg-transparent py-3 text-sm outline-none"
                        style={{ color: colors.textPrimary, direction: "ltr" }}
                      />
                      <button onClick={() => setShowApiKey(!showApiKey)} className="shrink-0 hover:opacity-70">
                        {showApiKey ? <EyeOff className="w-4 h-4" style={{ color: colors.textSecondary }} /> : <Eye className="w-4 h-4" style={{ color: colors.textSecondary }} />}
                      </button>
                    </div>
                    {draftSettings?.apiKey ? (
                      <div className="flex items-center gap-2 text-xs" style={{ color: colors.success || "#22c55e" }}>
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        کلید تنظیم شد
                      </div>
                    ) : (
                      <p className="text-xs" style={{ color: colors.error }}>برای استفاده از هوش مصنوعی کلید الزامی است</p>
                    )}
                  </div>

                  {/* API URL */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
                      آدرس API
                    </label>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                      آدرس سرور GapGPT
                    </p>
                    <input
                      value={draftSettings?.apiUrl || ""}
                      onChange={(e) => setDraftSettings((prev) => prev ? { ...prev, apiUrl: e.target.value } : prev)}
                      placeholder="https://api.gapgpt.app/v1"
                      className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
                      dir="ltr"
                      style={{
                        backgroundColor: colors.backgroundSecondary,
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: colors.border,
                        color: colors.textPrimary,
                      }}
                    />
                  </div>

                  {/* Divider */}
                  <div style={{ borderBottom: `1px solid ${colors.border}30` }} />

                  {/* Usage Stats */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
                      آمار مصرف
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg p-3" style={{ backgroundColor: colors.backgroundSecondary }}>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>مجموع توکن</p>
                        <p className="text-lg font-semibold mt-1" style={{ color: colors.textPrimary }}>{usageStats.totalTokens.toLocaleString()}</p>
                      </div>
                      <div className="rounded-lg p-3" style={{ backgroundColor: colors.backgroundSecondary }}>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>هزینه تخمینی</p>
                        <p className="text-lg font-semibold mt-1" style={{ color: colors.textPrimary }}>${usageStats.totalCost.toFixed(4)}</p>
                      </div>
                    </div>
                    {usageStats.sessionTokens > 0 && (
                      <p className="text-xs" style={{ color: colors.textSecondary }}>آخرین درخواست: {usageStats.sessionTokens.toLocaleString()} توکن</p>
                    )}
                    <button
                      onClick={() => {
                        setUsageStats({ totalTokens: 0, totalCost: 0, sessionTokens: 0 });
                        localStorage.setItem("aiUsageStats", JSON.stringify({ totalTokens: 0, totalCost: 0, sessionTokens: 0 }));
                      }}
                      className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                      style={{ color: colors.error, backgroundColor: colors.error + "15" }}
                    >
                      بازنشانی آمار
                    </button>
                  </div>
                </div>
              )}
              {/* Save / Cancel */}
              <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: colors.border }}>
                <button
                  onClick={() => {
                    setSavingSettings(true);
                    aiSettings.updateSettings(draftSettings || {} as any).finally(() => {
                      setSavingSettings(false);
                      setShowSettings(false);
                    });
                  }}
                  disabled={savingSettings}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                  style={{ backgroundColor: colors.primary, color: "#fff" }}
                >
                  {savingSettings ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> در حال ذخیره...</>
                  ) : (
                    "ذخیره تغییرات"
                  )}
                </button>
                <button
                  onClick={() => {
                    setDraftSettings(settings ? { ...settings } : null);
                    setShowSettings(false);
                  }}
                  className="px-5 py-2.5 text-sm font-medium rounded-lg transition-colors"
                  style={{ color: colors.textSecondary, backgroundColor: colors.backgroundSecondary }}
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showProjectPanel && (
        <ProjectCreationPanel isOpen={showProjectPanel} onClose={() => setShowProjectPanel(false)} onCreateProject={(projectData: ProjectData) => { setShowProjectPanel(false); }} />
      )}
    </div>
  );
}