"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { Bot, Send, ShoppingBag } from "lucide-react";
import { cartCount, useCart } from "@/lib/cart";
import { site, waLink } from "@/lib/site";
import { CsCards, type CsRef } from "./CsCards";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = ["Parcel buah mulai dari berapa?", "Hari ini bisa antar sampai jam berapa?", "Bagaimana cara langganan jus?", "Garansinya bagaimana kalau buah kurang bagus?"];
const MAX_CHARS = 500;
const STORE_KEY = "hl_cs_chat";

/** Answers end with [[produk:slug]] / [[bundling:slug]] markers; a half-streamed one stays hidden. */
function parseAnswer(raw: string): { text: string; refs: CsRef[] } {
  const refs: CsRef[] = [];
  const text = raw
    .replace(/\[\[(produk|bundling):([a-z0-9-]+)\]\]/g, (_, kind: CsRef["kind"], slug: string) => {
      if (!refs.some((r) => r.slug === slug)) refs.push({ kind, slug });
      return "";
    })
    .replace(/\[\[[^\]]*\]?$/, "")
    .trim();
  return { text, refs: refs.slice(0, 6) };
}

const save = (m: Msg[]) => {
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(m));
  } catch {
    // storage blocked: the chat just lasts until the page closes
  }
};

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

export function CsChat({ embedded = false }: { embedded?: boolean }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const inCart = cartCount(useCart());
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const list = useRef<HTMLDivElement>(null);

  // Same conversation on the /cs page and in the floating chat, across pages.
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE_KEY) ?? "[]") as Msg[];
      while (saved.length && (saved[saved.length - 1]!.role === "user" || !saved[saved.length - 1]!.content)) saved.pop();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only restore
      if (saved.length) setMessages(saved);
    } catch {
      // nothing to restore
    }
  }, []);

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
    const put = (content: string) => {
      const next: Msg[] = [...history, { role: "assistant", content }];
      setMessages(next);
      save(next);
    };
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
    <div className={embedded ? "flex min-h-0 flex-1 flex-col" : "mt-6 flex h-[65vh] min-h-[420px] flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-leaf-100"}>
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
        {messages.map((m, i) => {
          const answer = m.role === "assistant" ? parseAnswer(m.content) : null;
          const streaming = busy && i === messages.length - 1;
          return m.role === "user" ? (
            <p key={i} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-sm bg-leaf-700 px-4 py-2.5 whitespace-pre-wrap text-white">
              {m.content}
            </p>
          ) : (
            <div key={i}>
              <div className="flex gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf-700 text-white">
                  <Bot className="h-4 w-4" />
                </span>
                <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-leaf-50 px-4 py-2.5 whitespace-pre-wrap text-ink">
                  {answer?.text ? <Linked text={answer.text} /> : <span className="text-muted">Sedang mengetik…</span>}
                </p>
              </div>
              {!streaming && answer && answer.refs.length > 0 && <CsCards refs={answer.refs} />}
            </div>
          );
        })}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="border-t border-leaf-100 p-3"
      >
        {inCart > 0 && (
          <Link href="/keranjang" className="mb-2 flex items-center justify-center gap-1.5 text-sm font-semibold text-leaf-700 hover:underline">
            <ShoppingBag className="h-4 w-4" /> Lihat keranjang ({inCart})
          </Link>
        )}
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
