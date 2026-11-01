"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { Bot, Send } from "lucide-react";
import { site, waLink } from "@/lib/site";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = ["Parcel buah mulai dari berapa?", "Hari ini bisa antar sampai jam berapa?", "Bagaimana cara langganan jus?", "Garansinya bagaimana kalau buah kurang bagus?"];
const MAX_CHARS = 500;

/** healthila.id/... in an answer becomes a link. */
function Linked({ text }: { text: string }) {
  return text.split(/((?:https?:\/\/)?healthila\.id\/[\w\-./?=&%]*[\w/])/g).map((part, i) =>
    /healthila\.id\//.test(part) ? (
      <Link key={i} href={part.replace(/^(https?:\/\/)?healthila\.id/, "")} className="font-semibold underline">
        {part.replace(/^https?:\/\//, "")}
      </Link>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export function CsChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight });
  }, [messages]);

  async function send(question: string) {
    const q = question.trim().slice(0, MAX_CHARS);
    if (!q || busy) return;
    const history: Msg[] = [...messages, { role: "user", content: q }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    const put = (content: string) => setMessages([...history, { role: "assistant", content }]);
    try {
      const res = await fetch("/api/cs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history }) });
      if (!res.body) throw new Error("no body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        put(answer);
      }
      if (!answer) throw new Error("empty");
    } catch {
      put(`Maaf, koneksi terputus. Coba lagi, atau chat admin di WhatsApp ${site.whatsappDisplay} ya, Kak.`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 flex h-[65vh] min-h-[420px] flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-leaf-100">
      <div ref={list} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
        <div className="flex gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf-700 text-white">
            <Bot className="h-4 w-4" />
          </span>
          <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-leaf-50 px-4 py-2.5 text-ink">Halo Kak, ada yang bisa dibantu soal Healthila?</p>
        </div>
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 pl-10">
            {STARTERS.map((s) => (
              <button key={s} type="button" onClick={() => void send(s)} className="rounded-full px-3 py-1.5 text-left text-sm font-medium text-leaf-700 ring-1 ring-leaf-200 hover:bg-leaf-50">
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) =>
          m.role === "user" ? (
            <p key={i} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-sm bg-leaf-700 px-4 py-2.5 whitespace-pre-wrap text-white">
              {m.content}
            </p>
          ) : (
            <div key={i} className="flex gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf-700 text-white">
                <Bot className="h-4 w-4" />
              </span>
              <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-leaf-50 px-4 py-2.5 whitespace-pre-wrap text-ink">
                {m.content ? <Linked text={m.content} /> : <span className="text-muted">Sedang mengetik…</span>}
              </p>
            </div>
          ),
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="border-t border-leaf-100 p-3"
      >
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={MAX_CHARS}
            placeholder="Tulis pertanyaan Kakak…"
            aria-label="Pertanyaan"
            className="h-12 min-w-0 flex-1 rounded-full border border-leaf-100 px-4 outline-none focus:border-leaf-500"
          />
          <button type="submit" disabled={busy || !input.trim()} aria-label="Kirim" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-leaf-700 text-white disabled:opacity-40">
            <Send className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-muted">
          CS otomatis, hanya menjawab seputar Healthila dan bisa keliru. Butuh admin?{" "}
          <a href={waLink("Halo Healthila, saya mau bertanya")} target="_blank" rel="noopener noreferrer" className="font-semibold text-leaf-700 underline">
            Chat WhatsApp
          </a>
        </p>
      </form>
    </div>
  );
}
