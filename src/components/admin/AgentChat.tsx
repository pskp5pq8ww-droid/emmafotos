"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Admin.module.css";

type ChatMessage = { role: "user" | "assistant"; content: string };
type AgentStatus = "idle" | "thinking" | "error";

const STORAGE_KEY = "ers_agent_history";
const MAX_STORED = 40;

function loadHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as ChatMessage[]) : [];
    return Array.isArray(parsed) ? parsed.slice(-MAX_STORED) : [];
  } catch {
    return [];
  }
}

export function AgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<AgentStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Hydrate history from localStorage (client only).
  useEffect(() => {
    setMessages(loadHistory());
  }, []);

  // Persist + autoscroll on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_STORED)));
    } catch {
      // Storage full/blocked — chat still works, history just won't persist.
    }
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || status === "thinking") return;

    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setStatus("thinking");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/agent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-12) }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };

      if (!res.ok || !data.reply) {
        setStatus("error");
        setErrorMsg(data.error || `Error ${res.status}. Inténtalo de nuevo.`);
        return;
      }

      setMessages((cur) => [...cur, { role: "assistant", content: data.reply! }]);
      setStatus("idle");
    } catch {
      setStatus("error");
      setErrorMsg("Sin conexión con el servidor. Revisa tu red e inténtalo de nuevo.");
    }
  }

  function clearHistory() {
    setMessages([]);
    setErrorMsg("");
    setStatus("idle");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className={styles.panel} style={{ display: "flex", flexDirection: "column", height: "min(72vh, 720px)" }}>
      {/* ── Message list ── */}
      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 14 }}
      >
        {messages.length === 0 && (
          <p className={styles.muted} style={{ margin: "auto", textAlign: "center", maxWidth: 420 }}>
            Pregúntame por galerías, clientes, reseñas pendientes, facturación o el contenido del sitio.
            <br />
            <span style={{ fontSize: 12 }}>Ej: “¿cuántas reseñas tengo pendientes de aprobar?”</span>
          </p>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "78%",
              padding: "12px 16px",
              borderRadius: 14,
              fontSize: 14,
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              background: m.role === "user" ? "rgba(200, 169, 110, 0.16)" : "rgba(247, 242, 234, 0.05)",
              border: `1px solid ${m.role === "user" ? "rgba(200, 169, 110, 0.3)" : "rgba(255, 255, 255, 0.08)"}`,
              color: "#F5F5F5",
            }}
          >
            {m.content}
          </div>
        ))}

        {/* ── Status indicator ── */}
        {status === "thinking" && (
          <p className={styles.muted} style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Pensando…
          </p>
        )}
        {status === "error" && (
          <p className={styles.error} style={{ alignSelf: "stretch" }} role="alert">
            {errorMsg}
          </p>
        )}
      </div>

      {/* ── Composer ── */}
      <div style={{ display: "flex", gap: 10, padding: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Escribe tu pregunta…"
          aria-label="Mensaje para el asistente"
          style={{
            flex: 1,
            minHeight: 44,
            padding: "0 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "#111113",
            color: "#F5F5F5",
            fontSize: 14,
          }}
        />
        <button
          type="button"
          className={styles.primaryButton}
          onClick={send}
          disabled={status === "thinking" || !input.trim()}
          style={{ opacity: status === "thinking" || !input.trim() ? 0.5 : 1 }}
        >
          {status === "thinking" ? "Enviando…" : "Enviar"}
        </button>
        {messages.length > 0 && (
          <button type="button" className={styles.ghostButton} onClick={clearHistory} title="Borrar conversación">
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
