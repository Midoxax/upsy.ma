import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ScrollReveal from "@/components/ScrollReveal";
import {
  Heart, Send, Bot, User, Loader2, Sparkles, Shield,
  Wind, BookOpen, Brain,
} from "lucide-react";
import { Link } from "react-router-dom";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`;

const QUICK_PROMPTS = [
  { icon: Wind, label: "Breathing exercise", message: "Guide me through a calming breathing exercise." },
  { icon: BookOpen, label: "Journal prompt", message: "Give me a reflective journaling prompt for today." },
  { icon: Heart, label: "Feeling anxious", message: "I'm feeling anxious right now. Can you help?" },
  { icon: Brain, label: "Stress management", message: "What are some quick stress management techniques I can try?" },
];

const AIAssistant = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const allMessages = [...messages, userMsg];

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (resp.status === 429) {
        toast({ title: "Rate limited", description: "Please wait a moment and try again.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      if (resp.status === 402) {
        toast({ title: "Service unavailable", description: "AI service temporarily unavailable.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      if (!resp.ok || !resp.body) throw new Error("Failed to start stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Failed to get response. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-12 text-center max-w-md">
          <Bot className="w-12 h-12 text-u-turquoise mx-auto mb-4" />
          <h2 className="text-h2 mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">Sign in to chat with your AI Mental Health Assistant.</p>
          <Button variant="primary" asChild><Link to="/auth">Sign In</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="py-6 liquid-bg" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container-custom">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(46,184,168,0.15)", border: "1px solid rgba(46,184,168,0.3)" }}>
              <Bot className="w-5 h-5 text-u-turquoise" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">AI Mental Health Assistant</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Shield className="w-3 h-3" /> Confidential · Not a replacement for professional care
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto py-6">
        <div className="container-custom max-w-3xl space-y-4">
          {messages.length === 0 && (
            <ScrollReveal>
              <div className="text-center space-y-6 py-12">
                <Sparkles className="w-12 h-12 text-u-turquoise mx-auto" />
                <h2 className="text-h2">How can I help you today?</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  I'm here to provide emotional support, coping techniques, and mental health guidance. How are you feeling?
                </p>
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => send(p.message)}
                      className="glass-card !p-4 text-left hover:shadow-glass-hover transition-all group"
                    >
                      <p.icon className="w-5 h-5 text-u-turquoise mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-medium text-foreground">{p.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1" style={{ background: "rgba(46,184,168,0.15)" }}>
                  <Bot className="w-4 h-4 text-u-turquoise" />
                </div>
              )}
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md whitespace-pre-wrap"
                  : "rounded-bl-md prose prose-sm prose-invert max-w-none"
              }`} style={msg.role === "assistant" ? { background: "var(--glass-bg)", border: "var(--glass-border)" } : {}}>
                {msg.role === "assistant" ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 bg-primary/20">
                  <User className="w-4 h-4 text-primary" />
                </div>
              )}
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(46,184,168,0.15)" }}>
                <Bot className="w-4 h-4 text-u-turquoise" />
              </div>
              <div className="p-4 rounded-2xl rounded-bl-md" style={{ background: "var(--glass-bg)", border: "var(--glass-border)" }}>
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 py-4" style={{ background: "rgba(26,26,26,0.95)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container-custom max-w-3xl">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              className="resize-none min-h-[44px] max-h-32"
            />
            <Button variant="primary" size="icon" onClick={() => send(input)} disabled={!input.trim() || isLoading} className="shrink-0 h-[44px] w-[44px]">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            This AI assistant provides support and information, not clinical diagnosis. For emergencies, contact local services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
