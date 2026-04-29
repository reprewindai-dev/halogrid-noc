"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Shield, Loader2 } from "lucide-react"

const API_URL = "https://api.veklom.com"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export default function SupportChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: "user", content: input.trim(), timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/v1/support/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          conversation_id: conversationId,
        }),
      })
      if (!res.ok) throw new Error("Support unavailable")
      const data = await res.json()
      setConversationId(data.conversation_id)
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.response,
        timestamp: data.timestamp,
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment or email support@veklom.com.",
        timestamp: new Date().toISOString(),
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          aria-label="Open support chat"
          title="Open support chat"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105"
          style={{ background: "var(--brass)", color: "var(--ink)" }}
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[560px] flex flex-col rounded-sm border shadow-2xl overflow-hidden"
          style={{ borderColor: "var(--rule)", background: "var(--ink)" }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--rule)", background: "var(--ink-2)" }}>
            <div className="flex items-center gap-2.5">
              <Shield className="h-4 w-4" style={{ color: "var(--brass)" }} />
              <div>
                <div className="font-serif text-sm" style={{ color: "var(--bone)" }}>Veklom Support</div>
                <div className="font-mono text-[9px] uppercase tracking-[0.12em] flex items-center gap-1.5" style={{ color: "var(--moss)" }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--moss)" }} />
                  AI-Powered · Always Online
                </div>
              </div>
            </div>
            <button
              aria-label="Close support chat"
              title="Close support chat"
              onClick={() => setOpen(false)}
              className="p-1 rounded-sm hover:bg-[color:rgba(255,255,255,0.05)]"
            >
              <X className="h-4 w-4" style={{ color: "var(--mute)" }} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Shield className="h-8 w-8 mx-auto mb-3 opacity-30" style={{ color: "var(--brass)" }} />
                <p className="text-sm mb-1" style={{ color: "var(--bone-2)" }}>Ask me anything about Veklom.</p>
                <p className="font-mono text-[10px]" style={{ color: "var(--mute)" }}>Pricing, setup, APIs, troubleshooting.</p>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {["How does pricing work?", "How do I get API keys?", "What is the kill switch?"].map(q => (
                    <button
                      key={q}
                      onClick={() => { setInput(q); }}
                      className="px-3 py-1.5 rounded-sm border text-[11px] transition-colors hover:border-[color:var(--brass)]"
                      style={{ borderColor: "var(--rule)", color: "var(--bone-2)", background: "var(--ink-2)" }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[85%] px-3.5 py-2.5 rounded-sm text-sm leading-relaxed"
                  style={{
                    background: msg.role === "user" ? "var(--brass)" : "var(--ink-2)",
                    color: msg.role === "user" ? "var(--ink)" : "var(--bone)",
                    borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                  }}
                >
                  {msg.content.split("\n").map((line, j) => (
                    <span key={j}>{line}{j < msg.content.split("\n").length - 1 && <br />}</span>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3.5 py-2.5 rounded-sm" style={{ background: "var(--ink-2)", borderRadius: "12px 12px 12px 2px" }}>
                  <Loader2 className="h-4 w-4 animate-spin" style={{ color: "var(--brass)" }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-3 flex gap-2" style={{ borderColor: "var(--rule)", background: "var(--ink-2)" }}>
            <input
              aria-label="Support chat message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask anything..."
              className="flex-1 px-3 py-2 text-sm rounded-sm border focus:outline-none focus:border-[color:var(--brass)] transition-colors"
              style={{ background: "var(--ink)", borderColor: "var(--rule)", color: "var(--bone)" }}
            />
            <button
              aria-label="Send support chat message"
              title="Send message"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="px-3 py-2 rounded-sm transition-colors disabled:opacity-30"
              style={{ background: "var(--brass)", color: "var(--ink)" }}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
