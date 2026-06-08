const handler = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const body = req.body;

  // Slack challenge verification
  if (body.type === "url_verification") {
    return res.status(200).json({ challenge: body.challenge });
  }

  // Handle app_mention events
  if (body.event && body.event.type === "app_mention") {
    const userQuestion = body.event.text.replace(/<@[^>]+>/g, "").trim();
    const channel = body.event.channel;

    // Call Claude API
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: "Eres SpinLab, agente de inteligencia competitiva de Spin Crédito (fintech de OXXO, México). Analiza competidores como Nu, Klar, Kueski, Mercado Pago, Rappi Pay, Coppel, HeyBanco. Responde en español con: *Resumen ejecutivo*, *Hallazgos clave* y *Recomendación accionable*.",
        messages: [{ role: "user", content: userQuestion }]
      })
    });

    const claudeData = await claudeRes.json();
    const answer = claudeData.content?.[0]?.text || "No se pudo obtener respuesta.";

    // Send to Slack
    await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SLACK_TOKEN}`
      },
      body: JSON.stringify({ channel, text: `*SpinLab:*\n${answer}` })
    });
  }

  return res.status(200).json({ ok: true });
};

module.exports = handler;
