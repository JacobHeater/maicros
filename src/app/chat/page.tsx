'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
}

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      text: "Hello! I'm **Newton**, your AI nutritionist. Tell me what you ate today and I'll help you optimize your macros.",
    },
  ]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || location.origin;
    const socket = io(`${apiBase}/chat`);
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('message', (data: { type: string; payload?: string }) => {
      if (data.type === 'token') {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.role === 'assistant') {
            return [...prev.slice(0, -1), { ...last, text: last.text + (data.payload ?? '') }];
          }
          return [...prev, { id: Date.now(), role: 'assistant', text: data.payload ?? '' }];
        });
      } else if (data.type === 'done' || data.type === 'error' || data.type === 'canceled') {
        setIsSending(false);
        if (data.type === 'error') {
          setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', text: `⚠️ ${data.payload}` }]);
        }
      }
    });

    return () => { socket.disconnect(); };
  }, []);

  const send = () => {
    if (!input.trim() || isSending) return;
    const userText = input.trim();
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text: userText }]);
    setInput('');
    setIsSending(true);
    socketRef.current?.emit('chat_message', { type: 'chat_message', payload: userText });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[var(--background)]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-2)] shadow-[0_0_20px_rgba(0,245,160,0.15)]">
              <span className="avatar-emoji">🍏</span>
            </div>
            <div className="flex flex-col">
              <h1 className="font-display text-lg font-bold text-[var(--foreground)]">Newton</h1>
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-[var(--accent-1)] animate-pulse' : 'bg-rose-500'}`} />
                <span className="text-[10px] uppercase tracking-tighter text-[var(--muted-foreground)]">
                  {connected ? 'Neural Link Active' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          <a href="/" className="rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            Back
          </a>
        </div>
      </header>

      {/* CHAT AREA */}
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 sm:px-6">
        <div className="flex-1 overflow-y-auto py-8 space-y-8 pb-32">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div key={msg.id} className={`message-item flex gap-4 animate-slide-in ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-[var(--surface)] shadow-xl">
                    <span className="avatar-emoji">🤖</span>
                  </div>
                )}

                <div className={`message-content relative p-4 ${isUser ? 'user-bubble' : 'assistant-bubble shadow-2xl'}`}>
                  {!isUser && <div className="sparkle" />}
                  <div className="markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                  </div>
                </div>

                {isUser && (
                  <div className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-[var(--surface)]">
                    <span className="avatar-emoji">👤</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* THINKING STATE */}
          {isSending && (
            <div className="flex items-center gap-4 animate-slide-in">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface)] border border-white/5">
                <span className="avatar-emoji animate-bounce">🤔</span>
              </div>
              <div className="animate-pulse-dots flex gap-1 rounded-2xl bg-white/5 px-5 py-4 border border-white/5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-1)]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-2)]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-3)]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* INPUT AREA */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-[var(--background)] via-[var(--background)] to-transparent pb-8 pt-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="relative flex items-center gap-3 rounded-2xl bg-[var(--surface)] p-2 border border-white/10 shadow-2xl focus-within:border-[var(--accent-1)]/40 transition-all"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Log your fuel... e.g. '8oz steak and 2 eggs'"
              disabled={isSending}
              className="flex-1 bg-transparent px-4 py-2 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none disabled:opacity-50"
            />
            
            {isSending ? (
              <button
                type="button"
                onClick={() => { socketRef.current?.emit('cancel'); setIsSending(false); }}
                className="flex items-center justify-center rounded-xl bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/20 transition-colors"
              >
                STOP
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-1)] text-[var(--accent-contrast)] shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
              >
                <span className="text-xl">➔</span>
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}