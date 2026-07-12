'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const BotIcon = ({ size = 24, className="" }) => (
  <img 
    src="/ezer_chatbot_icon.png" 
    alt="Ezer Bot" 
    className={className}
    style={{ width: size, height: size, objectFit: 'cover', borderRadius: '50%', display: 'block' }} 
  />
);

const ChatCloudIcon = ({ size = 24, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/Google/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </svg>
);

const XIcon = ({ size = 24, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/Google/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/>
    <path d="m6 6 12 12"/>
  </svg>
);

const SendIcon = ({ size = 24, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/Google/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z"/>
    <path d="M22 2 11 13"/>
  </svg>
);

export default function ChatBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMounted(true);

    const footerElement = document.querySelector('footer');
    if (footerElement) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsFooterVisible(entry.isIntersecting);
        },
        { root: null, threshold: 0.1 }
      );
      observer.observe(footerElement);
      return () => observer.disconnect();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'bot',
          content: "🤖 I'm coming soon to help you! This AI assistant is currently under development. Chat functionality is temporarily unavailable. Please check back soon.",
        },
      ]);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const offensiveRegex = /\b(fuck|fucking|fucker|motherfucker|shit|shitty|bullshit|horseshit|damn|goddamn|bitch|bitches|sonofabitch|ass|asshole|dumbass|jackass|badass|cunt|dick|dickhead|cock|prick|pussy|bastard|whore|slut|skank|hoe|twat|wanker|tosser|arse|arsehole|bollocks|bugger|crap|dipshit|shithead|fuckface|butthead|douche|douchebag|scumbag|rascal|idiot|stupid|dumb|moron|imbecile|retard|loser|jerk|nitwit|airhead|blockhead|bonehead|dimwit|numbskull|knucklehead|screwup|weirdo|lunatic|psycho|nutjob|freak|degenerate|trash|garbage|vermin)\b/i;
    const crisisRegex = /\b(suicid|suicide|suicidal|kill myself|kill my self|kill me|end my life|end it all|take my life|want to die|wish i was dead|wish i were dead|better off dead|die|dying|death wish|no reason to live|nothing to live for|can't go on|cannot go on|giving up|give up|done with life|hate my life|life is pointless|life is meaningless|worthless|hopeless|helpless|empty inside|depress|depressed|depression|anxi|anxiety|panic attack|panic attacks|mental breakdown|breakdown|self harm|self-harm|harm myself|harm my self|hurt myself|hurt my self|cut myself|cut my self|cut my wrists|overdose|od|poison myself|jump off|jumping off|hang myself|hang my self|strangle myself|self destruct|self-destruct|don't want to live|do not want to live|i want to disappear|i wish i could disappear|everyone would be better without me|nobody cares about me|i'm a burden|im a burden)\b/i;
    
    const isOffensive = offensiveRegex.test(input);
    const isCrisis = crisisRegex.test(input);
    const isSensitive = isOffensive || isCrisis;

    const userMessage = { id: Date.now().toString(), role: 'user', content: input, isSpam: isSensitive };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // If it's purely an offensive insult, do not even call the API. Just stop.
    if (isOffensive && !isCrisis) {
      return; 
    }

    setIsLoading(true);

    try {
      let backendUrl = '/backend';
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        backendUrl = 'http://localhost:8000';
      }
      
      const response = await fetch(`${backendUrl}/chat.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content, history: messages.filter(m => !m.isSpam) }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Retroactive AI Intelligence Blur:
        const isCrisisResponse = data.reply.includes("I'm so sorry you are feeling this way") || 
                                 data.reply.includes("cannot engage") || 
                                 data.reply.includes("self harm") || 
                                 data.reply.includes("mental health professional") ||
                                 data.reply.includes("Suicide Prevention");
        
        if (isCrisisResponse && !isSensitive) {
           setMessages((prev) => prev.map(m => m.id === userMessage.id ? { ...m, isSpam: true } : m));
        }

        // If the backend returns its own offensive marker, don't show a bot reply.
        if (data.reply.trim() !== "(Marked as spammed/offensive)") {
          setMessages((prev) => [
            ...prev,
            { id: (Date.now() + 1).toString(), role: 'bot', content: data.reply },
          ]);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: 'bot', content: 'Sorry, I am having trouble connecting right now.' },
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'bot', content: 'Sorry, an error occurred.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .ezer-bot-wrapper {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 99;
          font-family: system-ui, -apple-system, sans-serif;
          transition: opacity 0.3s ease, visibility 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        
        .ezer-bot-wrapper.hidden-footer {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }
        
        .ezer-bot-btn {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          background-color: transparent;
          border: none;
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 2;
          position: relative;
          padding: 0;
        }
        
        .ezer-bot-btn.is-open {
          transform: scale(0.85);
        }
        
        .ezer-bot-btn:hover {
          transform: scale(1.05);
        }
        
        .ezer-bot-btn.is-open:hover {
          transform: scale(0.9);
        }

        .ezer-bot-window {
          position: absolute;
          bottom: 85px;
          right: 0;
          width: 320px;
          height: 480px;
          max-height: calc(100vh - 120px);
          background: linear-gradient(180deg, #ffffff 0%, #fffafa 100%);
          border-radius: 24px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          
          /* Animation styling */
          transform-origin: bottom right;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
          transform: scale(0);
          opacity: 0;
          pointer-events: none;
        }

        .ezer-bot-window.is-open {
          transform: scale(1);
          opacity: 1;
          pointer-events: all;
        }

        .ezer-bot-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: linear-gradient(135deg, #ffffff 0%, #fff3f3 100%);
          border-bottom: 1px solid #f9ecec;
          color: #1a1a1a;
        }

        .ezer-bot-title-area {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .ezer-bot-avatar {
          background-color: transparent;
          border-radius: 50%;
          display: flex;
          box-shadow: 0 4px 12px rgba(153, 27, 27, 0.15);
        }

        .ezer-bot-title {
          font-weight: 700;
          font-size: 20px;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .ezer-bot-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background-color: transparent;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .msg-row {
          display: flex;
          gap: 10px;
          align-items: flex-end;
        }

        .msg-row.user {
          justify-content: flex-end;
        }

        .msg-row.bot {
          justify-content: flex-start;
        }

        .tiny-bot-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-bottom: 4px;
          box-shadow: 0 2px 6px rgba(153, 27, 27, 0.1);
        }

        .msg-bubble {
          max-width: 75%;
          padding: 14px 18px;
          font-size: 14.5px;
          line-height: 1.5;
          word-wrap: break-word;
          box-shadow: 0 2px 5px rgba(0,0,0,0.04);
        }

        .msg-user {
          background: linear-gradient(135deg, #991b1b 0%, #dc2626 100%);
          color: white;
          border-radius: 20px 20px 4px 20px;
        }

        .msg-bot {
          background-color: #ffffff;
          color: #334155;
          border: 1px solid #e2e8f0;
          border-radius: 20px 20px 20px 4px;
        }

        .msg-spam {
          background-color: #ffeaea;
          border-color: #ffcccc;
          position: relative;
          text-align: center;
        }

        .spam-content {
          position: relative;
          display: inline-block;
        }

        .spam-text {
          filter: blur(4px);
          user-select: none;
          color: transparent;
          text-shadow: 0 0 5px rgba(0,0,0,0.5);
        }

        .spam-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #991b1b;
          font-weight: bold;
          font-size: 12px;
          white-space: nowrap;
          z-index: 2;
          background-color: rgba(255, 234, 234, 0.9);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 4px 8px;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          background-color: #94a3b8;
          border-radius: 50%;
          animation: typingBounce 1.4s infinite ease-in-out both;
        }

        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typingBounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        .ezer-bot-input-area {
          padding: 12px 16px;
          background-color: #ffffff;
          border-top: 1px solid #f1f5f9;
        }

        .ezer-bot-form {
          display: flex;
          position: relative;
        }

        .ezer-bot-input {
          flex: 1;
          background-color: #f1f5f9;
          color: #334155;
          border: 1px solid transparent;
          border-radius: 30px;
          padding: 14px 50px 14px 20px;
          font-size: 15px;
          outline: none;
          transition: all 0.2s;
        }

        .ezer-bot-input:focus {
          border-color: #991b1b;
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(153, 27, 27, 0.1);
        }

        .ezer-bot-submit {
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translateY(-50%);
          background-color: #991b1b;
          border: none;
          color: white;
          cursor: pointer;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }

        .ezer-bot-submit:hover {
          background-color: #7f1d1d;
        }

        .ezer-bot-submit:disabled {
          background-color: #cbd5e1;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .ezer-bot-wrapper { bottom: 16px; right: 16px; }
          .ezer-bot-window { 
            width: calc(100vw - 32px); 
            height: calc(100vh - 130px); 
            max-height: 520px; 
            bottom: 72px; 
          }
          .ezer-bot-btn { width: 56px; height: 56px; }
        }
      `}</style>

      {mounted && typeof window !== 'undefined'
        ? createPortal(
            <div className={`ezer-bot-wrapper ${isFooterVisible ? 'hidden-footer' : ''}`}>
              
              {/* The Chat Window Drawer */}
              <div className={`ezer-bot-window ${isOpen ? 'is-open' : ''}`}>
                <div className="ezer-bot-header">
                  <div className="ezer-bot-title-area">
                    <div className="ezer-bot-avatar">
                      <BotIcon size={36} />
                    </div>
                    <h3 className="ezer-bot-title">Ezer Bot</h3>
                  </div>
                  <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', opacity: 0.8, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center' }} onMouseOver={(e)=>e.currentTarget.style.opacity=1} onMouseOut={(e)=>e.currentTarget.style.opacity=0.8}>
                    <XIcon size={26} />
                  </button>
                </div>

                <div className="ezer-bot-messages">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`msg-row ${msg.role === 'user' ? 'user' : 'bot'}`}>
                      {msg.role === 'bot' && (
                        <div className="tiny-bot-avatar">
                          <BotIcon size={28} />
                        </div>
                      )}
                      <div className={`msg-bubble ${msg.role === 'user' ? 'msg-user' : 'msg-bot'} ${msg.isSpam && msg.role === 'user' ? 'msg-spam' : ''}`}>
                        {msg.isSpam && msg.role === 'user' ? (
                          <div className="spam-content">
                            <span className="spam-text">This message has been hidden due to sensitive/offensive content.</span>
                            <div className="spam-overlay">Hidden (Sensitive/Offensive)</div>
                          </div>
                        ) : (
                          msg.content
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="msg-row bot">
                      <div className="tiny-bot-avatar">
                        <BotIcon size={28} />
                      </div>
                      <div className="msg-bubble msg-bot">
                        <div className="typing-indicator">
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="ezer-bot-input-area" style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(3px)',
                    zIndex: 10,
                    cursor: 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '0 0 24px 24px'
                  }}>
                    <span style={{
                      backgroundColor: '#991b1b',
                      color: '#fff',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>Under Development</span>
                  </div>
                  <form onSubmit={(e) => e.preventDefault()} className="ezer-bot-form">
                    <input
                      type="text"
                      value={input}
                      onChange={() => {}}
                      onPaste={(e) => e.preventDefault()}
                      onKeyDown={(e) => e.preventDefault()}
                      placeholder="Chat temporarily disabled..."
                      className="ezer-bot-input"
                      readOnly
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    />
                    <button type="submit" disabled className="ezer-bot-submit" style={{ pointerEvents: 'none' }}>
                      <SendIcon size={16} />
                    </button>
                  </form>
                </div>
              </div>

              {/* The Floating Action Button stays visible to toggle */}
              <button 
                title="Ezer Bot - COC, Union Church ChatBot"
                onClick={() => setIsOpen(!isOpen)} 
                className={`ezer-bot-btn ${isOpen ? 'is-open' : ''}`} 
                aria-label="Toggle Chat"
              >
                <BotIcon size="100%" />
              </button>

            </div>,
            document.body
          )
        : null}
    </>
  );
}
