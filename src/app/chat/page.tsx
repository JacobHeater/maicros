'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

enum ClientMessageType {
  ChatMessage = 'chat_message',
  Cancel = 'cancel',
  Clear = 'clear',
}

interface Message { id: number; role: 'user' | 'assistant'; text: string; }

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'assistant', text: "Hello! I'm Newton, your AI nutritionist. Tell me what you ate today and I'll help you optimize your macros." }
  ]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const [connected, setConnected] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // open websocket once on mount
    // Prefer explicit API base if provided via NEXT_PUBLIC_API_BASE_URL, otherwise use same-origin
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    let wsUrl: string;
    if (apiBase) {
      try {
        const u = new URL(apiBase);
        const proto = u.protocol === 'https:' ? 'wss' : 'ws';
        wsUrl = `${proto}://${u.host}/chat`;
      } catch (e) {
        // fallback to same-origin
        const proto = location.protocol === 'https:' ? 'wss' : 'ws';
        wsUrl = `${proto}://${location.host}/chat`;
      }
    } else {
      const proto = location.protocol === 'https:' ? 'wss' : 'ws';
      wsUrl = `${proto}://${location.host}/chat`;
    }
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.addEventListener('open', () => setConnected(true));

    ws.addEventListener('message', (ev) => {
      try {
        const data = JSON.parse(ev.data);
        if (data.type === 'session') {
          sessionIdRef.current = data.sessionId;
          return;
        }
        // handle token streaming and finalization
        if (data.type === 'token') {
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && last.role === 'assistant') {
              const updated = [...prev.slice(0, -1), { ...last, text: last.text + data.payload }];
              return updated;
            }
            return [...prev, { id: Date.now(), role: 'assistant', text: data.payload }];
          });
        } else if (data.type === 'done') {
          setIsSending(false);
        } else if (data.type === 'error') {
          setIsSending(false);
          setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', text: 'Error: ' + (data.payload || 'Unknown') }]);
        } else if (data.type === 'canceled') {
          setIsSending(false);
          setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', text: '[Canceled]' }]);
        }
      } catch (e) {
        console.error('ws message parse', e);
      }
    });

    ws.addEventListener('close', () => setConnected(false));
    ws.addEventListener('error', () => setConnected(false));

    return () => {
      ws.close();
      socketRef.current = null;
    };
  }, []);

  const send = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    const userMessage: Message = { id: Date.now(), role: 'user', text: userText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    // We rely on the `isSending` indicator for typing UI. Tokens will
    // create or append an assistant message when they arrive, so avoid
    // inserting an empty assistant placeholder here which caused a
    // duplicated typing/empty bubble UI.

    const ws = socketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      // fallback: local echo
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: Date.now() + 2, role: 'assistant', text: "Couldn't connect to server. Try again later." }]);
        setIsSending(false);
      }, 400);
      return;
    }

    // Send a simple chat payload expected by server gateway. Server infers session from connection.
    ws.send(JSON.stringify({ type: ClientMessageType.ChatMessage, payload: userText }));
  };

  const handleCancel = () => {
    const ws = socketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: 'cancel' }));
    setIsSending(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    send();
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-black">
      <header className="sticky top-0 z-10 border-b border-transparent bg-transparent backdrop-blur-lg">
        <div className="mx-auto flex h-20 max-w-3xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 text-lg font-extrabold text-white shadow-xl">
                N
              </div>
              <div className="flex flex-col">
                <h1 className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Newton</h1>
                <p className="text-xs text-zinc-500">AI Nutritionist</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-2 text-xs font-medium text-zinc-700 shadow-sm transition hover:scale-105 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-200"
            >
              Back
            </a>
            <div className="ml-2 flex items-center gap-2">
              <span
                aria-hidden
                className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-rose-400'} shadow-sm`}
              />
              <span className="text-xs text-zinc-500">{connected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4">
        <div className="flex-1 overflow-y-auto py-8">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={msg.id}
                className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' ? (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 text-sm font-bold text-white shadow-lg">
                    N
                  </div>
                ) : (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-sm font-bold text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">
                    U
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm transition-colors ${
                    msg.role === 'assistant'
                      ? 'bg-white text-zinc-900 dark:bg-zinc-900/80 dark:text-zinc-100'
                      : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  }`}
                >
                  <div className="markdown-body text-sm leading-relaxed prose prose-sm dark:prose-invert whitespace-pre-wrap">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 text-sm font-bold text-white shadow-lg">N</div>
                <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-zinc-900/80">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-zinc-400" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-zinc-400 delay-150" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-zinc-400 delay-300" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="sticky bottom-0 z-10 bg-transparent py-4">
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl px-2">
            <div className="relative flex items-center gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your meal... e.g. '2 eggs, avocado toast, and a banana'"
                disabled={isSending}
                aria-label="Message input"
                className="h-12 w-full rounded-2xl border border-transparent bg-white/90 px-4 pr-36 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-900/80 dark:text-zinc-100"
              />
              <div className="absolute right-2 flex gap-2">
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSending || !input.trim()}
                    className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? 'Thinking...' : 'Send'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={!isSending}
                    aria-label="Cancel in-flight request"
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 shadow disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
