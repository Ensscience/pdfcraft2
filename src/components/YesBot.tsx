"use client";
import { useState, useRef, useEffect } from "react";

export default function YesBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [hidden, setHidden] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setShowPulse(false);
      if (!initialized) {
        setInitialized(true);
        setMessages([
          {
            role: "assistant",
            content: "Hi! I'm **YesConvert Assistant** 👋\nI can help you convert files, explain formats, or answer any question about YesConvert.\n\nWhat do you need help with?",
          },
        ]);
      }
    }
  }, [open, initialized]);

  const SUGGESTIONS = [
    "How do I convert PDF to Word?",
    "Is my file private?",
    "What formats are supported?",
  ];

  const send = async (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg || loading) return;
    setInput("");

    const updated = [...messages, { role: "user", content: msg }];
    setMessages(updated);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Unknown error");
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderText = (text: string) =>
    text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .yb-wrap * { box-sizing: border-box; font-family: 'Inter', sans-serif; }

        .yb-btn {
          position: fixed; bottom: 24px; right: 24px; z-index: 9999;
          width: 56px; height: 56px; border-radius: 50%;
          background: linear-gradient(135deg, #F97316, #EF4444);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 20px rgba(239,68,68,.4);
          transition: transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .2s;
        }
        .yb-btn:hover { transform: scale(1.1); box-shadow: 0 8px 28px rgba(239,68,68,.5); }
        .yb-btn:active { transform: scale(.95); }

        .yb-dot {
          position: absolute; top: 0; right: 0;
          width: 14px; height: 14px; background: #22c55e;
          border-radius: 50%; border: 2px solid white;
        }

        .yb-pulse {
          position: fixed; bottom: 24px; right: 24px; z-index: 9998;
          width: 56px; height: 56px; border-radius: 50%;
          border: 2.5px solid rgba(239,68,68,.4);
          animation: yb-ring 2s ease-out infinite;
          pointer-events: none;
        }
        @keyframes yb-ring {
          0%  { transform: scale(1); opacity: .7; }
          100%{ transform: scale(1.8); opacity: 0; }
        }

        .yb-panel {
          position: fixed; bottom: 90px; right: 24px; z-index: 9999;
          width: 360px; max-height: 520px; border-radius: 20px;
          background: #fff;
          box-shadow: 0 20px 60px rgba(0,0,0,.14), 0 2px 8px rgba(239,68,68,.08);
          border: 1px solid rgba(239,68,68,.1);
          display: flex; flex-direction: column; overflow: hidden;
          animation: yb-up .28s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes yb-up {
          from { opacity: 0; transform: translateY(20px) scale(.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .yb-head {
          background: linear-gradient(135deg, #F97316, #EF4444);
          padding: 14px 16px; display: flex; align-items: center; gap: 10px;
        }
        .yb-logo {
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .yb-head-name { font-weight: 700; font-size: 14.5px; color: #fff; letter-spacing: -.2px; }
        .yb-head-sub {
          font-size: 11px; color: rgba(255,255,255,.8);
          display: flex; align-items: center; gap: 4px; margin-top: 1px;
        }
        .yb-online { width: 6px; height: 6px; background: #86efac; border-radius: 50%; display: inline-block; }
        .yb-x {
          margin-left: auto; background: rgba(255,255,255,.15); border: none;
          color: #fff; width: 28px; height: 28px; border-radius: 8px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 15px; transition: background .15s;
        }
        .yb-x:hover { background: rgba(255,255,255,.28); }

        .yb-msgs {
          flex: 1; overflow-y: auto; padding: 14px;
          display: flex; flex-direction: column; gap: 10px;
          background: #F9FAFB;
        }
        .yb-msgs::-webkit-scrollbar { width: 4px; }
        .yb-msgs::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 4px; }

        .yb-row { display: flex; gap: 7px; align-items: flex-end; }
        .yb-row.u { flex-direction: row-reverse; align-self: flex-end; max-width: 88%; }
        .yb-row.a { align-self: flex-start; max-width: 88%; }

        .yb-ic {
          width: 26px; height: 26px; border-radius: 50%;
          background: linear-gradient(135deg, #F97316, #EF4444);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; flex-shrink: 0;
        }
        .yb-bub { padding: 9px 13px; border-radius: 16px; font-size: 13px; line-height: 1.55; }
        .u .yb-bub {
          background: linear-gradient(135deg, #F97316, #EF4444);
          color: #fff; border-bottom-right-radius: 4px;
        }
        .a .yb-bub {
          background: #fff; color: #1E293B;
          border-bottom-left-radius: 4px;
          box-shadow: 0 1px 4px rgba(0,0,0,.07);
          border: 1px solid #F3F4F6;
        }

        .yb-dots { display:flex; gap:4px; padding: 10px 13px; }
        .yb-dots span {
          width:7px; height:7px; background:#D1D5DB; border-radius:50%;
          animation: yb-dot 1.2s ease-in-out infinite;
        }
        .yb-dots span:nth-child(2){animation-delay:.2s}
        .yb-dots span:nth-child(3){animation-delay:.4s}
        @keyframes yb-dot {
          0%,80%,100%{transform:scale(.7);opacity:.4}
          40%{transform:scale(1);opacity:1}
        }

        .yb-chips {
          display: flex; flex-wrap: wrap; gap: 5px;
          padding: 8px 14px 4px; background: #F9FAFB;
        }
        .yb-chip {
          background: #fff; border: 1px solid #FED7AA; border-radius: 20px;
          padding: 4px 11px; font-size: 11.5px; color: #EA580C; cursor: pointer;
          font-family: 'Inter', sans-serif; font-weight: 500; transition: all .15s;
        }
        .yb-chip:hover { background: #FFF7ED; border-color: #F97316; transform: translateY(-1px); }

        .yb-footer {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 13px; border-top: 1px solid #F3F4F6; background: #fff;
        }
        .yb-inp {
          flex: 1; border: 1.5px solid #E5E7EB; border-radius: 11px;
          padding: 8px 12px; font-size: 13px; font-family: 'Inter', sans-serif;
          color: #1E293B; background: #F9FAFB; outline: none; resize: none;
          transition: border-color .2s;
        }
        .yb-inp:focus { border-color: #F97316; background: #fff; }
        .yb-inp::placeholder { color: #9CA3AF; }
        .yb-send {
          width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
          background: linear-gradient(135deg, #F97316, #EF4444);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all .2s;
        }
        .yb-send:hover { transform: scale(1.08); box-shadow: 0 4px 12px rgba(239,68,68,.4); }
        .yb-send:active { transform: scale(.94); }
        .yb-send:disabled { opacity: .4; cursor: not-allowed; transform: none; box-shadow: none; }

        .yb-note {
          text-align: center; font-size: 10px; color: #9CA3AF;
          padding: 0 14px 8px; background: #fff;
        }
        .yb-note span { color: #EF4444; font-weight: 600; }

        .yb-dismiss {
          position: fixed; bottom: 54px; right: 18px; z-index: 10000;
          width: 18px; height: 18px; border-radius: 50%;
          background: #6B7280; border: 2px solid white;
          color: white; font-size: 10px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 1px 4px rgba(0,0,0,.2); transition: background .15s;
        }
        .yb-dismiss:hover { background: #EF4444; }

        @media(max-width:400px){
          .yb-panel{ width: calc(100vw - 32px); right: 16px; bottom: 80px; }
          .yb-btn { right: 16px; bottom: 16px; }
          .yb-pulse { right: 16px; bottom: 16px; }
          .yb-dismiss { right: 10px; bottom: 46px; }
        }
      `}</style>

      <div className="yb-wrap">
        {!hidden && (
          <>
            {showPulse && !open && <div className="yb-pulse" />}
            {!open && (
              <button className="yb-dismiss" onClick={() => setHidden(true)} aria-label="Dismiss">✕</button>
            )}
            <button className="yb-btn" onClick={() => setOpen((v) => !v)} aria-label="Open YesBot">
          <div className="yb-dot" />
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <circle cx="9" cy="10" r="1" fill="white" /><circle cx="12" cy="10" r="1" fill="white" /><circle cx="15" cy="10" r="1" fill="white" />
            </svg>
          )}
        </button>

            {open && (
          <div className="yb-panel">
            <div className="yb-head">
              <div className="yb-logo">✓</div>
              <div>
                <div className="yb-head-name">YesConvert</div>
                <div className="yb-head-sub"><span className="yb-online" /> Online · Your File Assistant</div>
              </div>
              <button className="yb-x" onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="yb-msgs">
              {messages.map((m, i) => (
                <div key={i} className={`yb-row ${m.role === "user" ? "u" : "a"}`}>
                  {m.role === "assistant" && <div className="yb-ic">✓</div>}
                  <div className="yb-bub" dangerouslySetInnerHTML={{ __html: renderText(m.content) }} />
                </div>
              ))}
              {loading && (
                <div className="yb-row a">
                  <div className="yb-ic">✓</div>
                  <div className="yb-bub" style={{ background: "#fff", border: "1px solid #F3F4F6", boxShadow: "0 1px 4px rgba(0,0,0,.07)" }}>
                    <div className="yb-dots"><span /><span /><span /></div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {messages.length <= 1 && (
              <div className="yb-chips">
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} className="yb-chip" onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            )}

            <div className="yb-footer">
              <textarea
                ref={inputRef}
                className="yb-inp"
                rows={1}
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              />
              <button className="yb-send" onClick={() => send()} disabled={loading || !input.trim()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <div className="yb-note">Powered by <span>YesConvert ✓</span> · 100% Private</div>
          </div>
        )}
          </>
        )}
      </div>
    </>
  );
}

