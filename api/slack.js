const handler = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { team, question, answer } = req.body;
    const text = `*SpinLab — ${team}*\n*Pregunta:* ${question}\n\n${answer}`;

    const r = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
      },
      body: JSON.stringify({ channel: "#todo-spinlab-pilot", text }),
    });

    const data = await r.json();
    return res.status(200).json({ ok: data.ok, error: data.error });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
};

module.exports = handler;
