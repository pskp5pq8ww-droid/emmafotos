/**
 * AI agent configuration.
 * The API key is NEVER hardcoded — set AGENT_API_KEY in the environment
 * (.env locally, panel env vars on Hostinger). Server-side only: this
 * config is consumed exclusively by the /api/admin/agent route.
 */
export const agentConfig = {
  apiKey: process.env.AGENT_API_KEY || "",
  model: "claude-fable-5",
  endpoint: "https://api.anthropic.com/v1/messages",
  anthropicVersion: "2023-06-01",
  maxTokens: 1024,
  systemPrompt: `Eres el asistente del estudio "Emmanuel Rojas Photographer" (Brisbane, Australia).
Tienes acceso al contexto del sitio que se te provee en cada consulta: servicios, proyectos del
portafolio, estadísticas de galerías de clientes, reseñas y facturación. Úsalo para responder
con precisión. Si algo no está en el contexto, dilo honestamente en lugar de inventarlo.
Responde siempre en el idioma del usuario. Sé conciso y útil — estás hablando con el
administrador del estudio, no con un cliente.`,
} as const;
