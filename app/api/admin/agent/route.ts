import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth/session";
import { agentConfig } from "@/lib/agent/config";
import { buildSiteContext } from "@/lib/agent/context";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_HISTORY = 12;

/**
 * POST /api/admin/agent
 * Body: { messages: [{ role, content }, ...] }  (latest user message last)
 * Admin session required. Proxies to the Anthropic API so the key never
 * reaches the browser.
 */
export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!agentConfig.apiKey) {
    return NextResponse.json(
      { error: "El agente no está configurado todavía. Define AGENT_API_KEY en el servidor." },
      { status: 503 },
    );
  }

  let messages: ChatMessage[];
  try {
    const body = (await request.json()) as { messages?: ChatMessage[] };
    messages = (body.messages ?? [])
      .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .slice(-MAX_HISTORY);
    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const lastUserMessage = messages[messages.length - 1].content;
    const siteContext = await buildSiteContext(lastUserMessage);

    const res = await fetch(agentConfig.endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": agentConfig.apiKey,
        "anthropic-version": agentConfig.anthropicVersion,
      },
      body: JSON.stringify({
        model: agentConfig.model,
        max_tokens: agentConfig.maxTokens,
        system: `${agentConfig.systemPrompt}\n\n--- CONTEXTO DEL SITIO (en vivo) ---\n${siteContext}`,
        messages,
      }),
      // Don't hang the admin UI forever if the API is unreachable.
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[agent] Anthropic API ${res.status}: ${detail.slice(0, 300)}`);
      return NextResponse.json(
        { error: `El servicio del agente respondió ${res.status}. Inténtalo de nuevo.` },
        { status: 502 },
      );
    }

    const data = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
    const reply = (data.content ?? [])
      .filter((b) => b.type === "text" && b.text)
      .map((b) => b.text)
      .join("\n")
      .trim();

    return NextResponse.json({ reply: reply || "(respuesta vacía)" });
  } catch (error) {
    console.error("[agent] request failed:", error);
    return NextResponse.json(
      { error: "No se pudo contactar el servicio del agente. Revisa la conexión del servidor." },
      { status: 502 },
    );
  }
}
