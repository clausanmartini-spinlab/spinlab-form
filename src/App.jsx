import { useState } from "react";

const SUPABASE_URL = "https://dafszykbqtwhuoshjtlv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZnN6eWticXR3aHVvc2hqdGx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMjYwMTUsImV4cCI6MjA5MTYwMjAxNX0.ksGA4jHA-CCKOYcF9Qy6LNv3_UXSldmf7XMGEmO790M";

async function saveResponse(team, name, answers) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Prefer": "return=minimal",
    },
    body: JSON.stringify({ team, name, answers }),
  });
  if (!res.ok) throw new Error("Error al guardar");
}

const teams = [
  { id: "acquisition", label: "Customer Acquisition", color: "#534AB7", light: "#EEEDFE", desc: "Flujo de oferta de préstamo hasta el desembolso" },
  { id: "management", label: "Customer Management", color: "#0F6E56", light: "#E1F5EE", desc: "Administración de cuenta y pago" },
  { id: "collections", label: "Collections", color: "#993C1D", light: "#FAECE7", desc: "Cobranza post vencimiento" },
  { id: "cx", label: "CX", color: "#185FA5", light: "#E6F1FB", desc: "Gestión de experiencia de clientes" },
];

const questions = [
  { id: "q1", text: "¿Cuál es tu mayor dolor hoy cuando necesitas información sobre la competencia?", type: "textarea", placeholder: "Ej. No sé qué tan rápido aprueban otros, tengo que buscar manualmente en varias fuentes..." },
  { id: "q2", text: "¿Qué tipo de análisis benchmark necesitas con más frecuencia?", type: "multi", options: ["Comparación de flujos y procesos", "Benchmarks de tasas / productos financieros", "UX / experiencia del usuario", "Comunicación y mensajes de la competencia", "Políticas de cobranza o gestión", "Canales de atención al cliente", "Tendencias del sector / regulación", "Otro"] },
  { id: "q3", text: "¿Cuáles competidores o referentes te importan más?", type: "textarea", placeholder: "Ej. Konfío, Kueski, Nu, Rappi Pay, BNPL internacionales..." },
  { id: "q4", text: "¿Con qué frecuencia necesitas estos reportes?", type: "single", options: ["Diario", "Semanal", "Quincenal", "Mensual", "Solo cuando hay un proyecto puntual"] },
  { id: "q5", text: "¿En qué formato te sería más útil recibir el reporte?", type: "single", options: ["Resumen ejecutivo (1 página)", "Reporte detallado con evidencia", "Comparativa visual (tabla/matriz)", "Insights + recomendaciones accionables", "Cualquiera, lo importante es la información"] },
  { id: "q6", text: "¿Qué pregunta específica quisieras que SpinLab pudiera responder automáticamente para tu equipo?", type: "textarea", placeholder: "Ej. ¿Cuántos pasos tiene el onboarding de Konfío vs el nuestro?" },
  { id: "q7", text: "¿Dónde guardas hoy los análisis o benchmarks que ya existen?", type: "multi", options: ["Figma", "PowerPoint / Slides", "Miro", "Notion", "Confluence", "Carpetas de Drive / OneDrive", "No están centralizados", "Otro"] },
  { id: "q8", text: "¿Algo más que quieras agregar sobre cómo SpinLab podría ayudarte?", type: "textarea", placeholder: "Sugerencias, casos de uso específicos, integraciones que usas..." },
];

const teamQuestionOverrides = {
  acquisition: {
    q2: { text: "¿Qué tipo de análisis benchmark necesita tu equipo con más frecuencia?", options: ["Flujos de onboarding de la competencia", "Tiempos de aprobación y desembolso", "Requisitos de elegibilidad", "Comunicación durante el proceso de solicitud", "Tasas, montos y plazos ofertados", "Canales de adquisición (ads, referidos, etc.)", "Experiencia de la app durante el flujo", "Otro"] },
    q6: { placeholder: "Ej. ¿Cuántos pasos tiene el onboarding de Konfío? ¿Qué documentos pide Nu para aprobar un crédito?" },
  },
  management: {
    q2: { text: "¿Qué tipo de análisis benchmark necesita tu equipo con más frecuencia?", options: ["Flujos de pago y recarga de cuenta", "Opciones de reestructura o diferimiento", "Comunicación de estados de cuenta", "Programas de lealtad o beneficios", "Notificaciones y recordatorios de pago", "Funcionalidades de autogestión en app", "Políticas de refinanciamiento", "Otro"] },
    q6: { placeholder: "Ej. ¿Cómo comunican Nu o Kueski los estados de cuenta? ¿Qué opciones de pago adelantado ofrecen?" },
  },
  collections: {
    q2: { text: "¿Qué tipo de análisis benchmark necesita tu equipo con más frecuencia?", options: ["Estrategias de cobranza temprana vs tardía", "Canales de contacto usados (WhatsApp, SMS, llamada)", "Tono y mensajes de comunicación de cobranza", "Incentivos para regularización (quitas, planes)", "Flujos de negociación automatizada", "Políticas de mora y penalizaciones", "Regulación y cumplimiento en cobranza", "Otro"] },
    q6: { placeholder: "Ej. ¿Cómo gestiona Rappi Pay la cobranza a 30 días de mora? ¿Qué tono usa Nu en sus mensajes de cobranza?" },
  },
  cx: {
    q2: { text: "¿Qué tipo de análisis benchmark necesita tu equipo con más frecuencia?", options: ["Canales de atención (chat, teléfono, email)", "Tiempos de respuesta de la competencia", "Flujos de resolución de quejas", "Tono y comunicación de la marca", "NPS y satisfacción publicada", "Self-service y automatización de CX", "Reseñas y sentimiento en app stores", "Otro"] },
    q6: { placeholder: "Ej. ¿Cómo resuelve Nu quejas en menos de 5 minutos? ¿Qué canales de atención ofrece Konfío?" },
  },
};

export default function App() {
  const [step, setStep] = useState("team");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const team = teams.find(t => t.id === selectedTeam);
  const overrides = selectedTeam ? teamQuestionOverrides[selectedTeam] || {} : {};
  const getQuestion = (q) => ({ ...q, ...(overrides[q.id] || {}) });
  const handleMulti = (qid, opt) => {
    const prev = answers[qid] || [];
    setAnswers(a => ({ ...a, [qid]: prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt] }));
  };
  const handleSingle = (qid, opt) => setAnswers(a => ({ ...a, [qid]: opt }));
  const handleText = (qid, val) => setAnswers(a => ({ ...a, [qid]: val }));
  const progress = Math.round((Object.keys(answers).length / questions.length) * 100);

  if (submitted) {
    return (
      <div style={{ padding: "2rem", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
        <p style={{ fontSize: 20, fontWeight: 500, marginBottom: 8 }}>¡Gracias, {name}!</p>
        <p style={{ fontSize: 14, color: "#666", marginBottom: 24 }}>Tus respuestas ayudarán a configurar SpinLab para el equipo de {team?.label}.</p>
        <div style={{ background: "#f5f5f5", borderRadius: 12, padding: "1.25rem", textAlign: "left", marginBottom: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#666", marginBottom: 12 }}>Resumen de respuestas</p>
          {questions.map(q => {
            const qq = getQuestion(q);
            const ans = answers[q.id];
            if (!ans || (Array.isArray(ans) && ans.length === 0)) return null;
            return (
              <div key={q.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "0.5px solid #ddd" }}>
                <p style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>{qq.text}</p>
                <p style={{ fontSize: 13 }}>{Array.isArray(ans) ? ans.join(", ") : ans}</p>
              </div>
            );
          })}
        </div>
        <button onClick={() => { setSubmitted(false); setStep("team"); setSelectedTeam(null); setName(""); setAnswers({}); }}
          style={{ fontSize: 13, padding: "8px 20px", borderRadius: 8, border: "0.5px solid #ccc", background: "transparent", cursor: "pointer" }}>
          Llenar otro formulario
        </button>
      </div>
    );
  }

  if (step === "team") {
    return (
      <div style={{ padding: "1.5rem", maxWidth: 600, margin: "0 auto" }}>
        <p style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>SpinLab</p>
        <p style={{ fontSize: 14, color: "#666", marginBottom: 24 }}>Levantamiento de necesidades por equipo — Spin Crédito</p>
        <p style={{ fontSize: 14, marginBottom: 16 }}>¿A qué equipo perteneces?</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {teams.map(t => (
            <button key={t.id} onClick={() => setSelectedTeam(t.id)}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 10, border: `0.5px solid ${selectedTeam === t.id ? t.color : "#ddd"}`, background: selectedTeam === t.id ? t.light : "#fff", cursor: "pointer", textAlign: "left" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{t.label}</p>
                <p style={{ fontSize: 12, color: "#888", margin: 0 }}>{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
        {selectedTeam && (
          <div style={{ marginTop: 20 }}>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>Tu nombre</p>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Ana García"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "0.5px solid #ccc", fontSize: 14, marginBottom: 16, boxSizing: "border-box" }} />
            <button onClick={() => { if (name.trim()) setStep("form"); }} disabled={!name.trim()}
              style={{ width: "100%", padding: "10px 0", borderRadius: 8, fontSize: 14, fontWeight: 500, background: team?.color, color: "#fff", border: "none", cursor: name.trim() ? "pointer" : "not-allowed", opacity: name.trim() ? 1 : 0.5 }}>
              Comenzar →
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem", maxWidth: 600, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: team?.color }} />
        <p style={{ fontSize: 13, color: "#666", margin: 0 }}>{team?.label} · {name}</p>
        <div style={{ flex: 1 }} />
        <p style={{ fontSize: 12, color: "#999", margin: 0 }}>{progress}% completado</p>
      </div>
      <div style={{ height: 3, background: "#eee", borderRadius: 2, marginBottom: 28 }}>
        <div style={{ height: 3, width: `${progress}%`, background: team?.color, borderRadius: 2, transition: "width 0.3s" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {questions.map(q => {
          const qq = getQuestion(q);
          return (
            <div key={q.id}>
              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>{qq.text}</p>
              {qq.type === "textarea" && (
                <textarea value={answers[q.id] || ""} onChange={e => handleText(q.id, e.target.value)}
                  placeholder={qq.placeholder} rows={3}
                  style={{ width: "100%", fontSize: 13, padding: "10px 12px", borderRadius: 8, border: "0.5px solid #ccc", resize: "vertical", boxSizing: "border-box" }} />
              )}
              {qq.type === "multi" && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {qq.options.map(opt => {
                    const sel = (answers[q.id] || []).includes(opt);
                    return (
                      <button key={opt} onClick={() => handleMulti(q.id, opt)}
                        style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12, border: `0.5px solid ${sel ? team?.color : "#ccc"}`, background: sel ? team?.light : "#fff", color: sel ? team?.color : "#555", cursor: "pointer" }}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
              {qq.type === "single" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {qq.options.map(opt => {
                    const sel = answers[q.id] === opt;
                    return (
                      <button key={opt} onClick={() => handleSingle(q.id, opt)}
                        style={{ padding: "10px 14px", borderRadius: 8, fontSize: 13, textAlign: "left", border: `0.5px solid ${sel ? team?.color : "#ccc"}`, background: sel ? team?.light : "#fff", color: sel ? team?.color : "#333", cursor: "pointer" }}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {error && <p style={{ fontSize: 13, color: "red", marginTop: 16 }}>{error}</p>}
      <button onClick={async () => {
          setSaving(true); setError(null);
          try { await saveResponse(selectedTeam, name, answers); setSubmitted(true); }
          catch { setError("No se pudieron guardar las respuestas. Intenta de nuevo."); }
          finally { setSaving(false); }
        }}
        style={{ marginTop: 32, width: "100%", padding: "12px 0", borderRadius: 8, fontSize: 14, fontWeight: 500, background: team?.color, color: "#fff", border: "none", cursor: "pointer" }}>
        {saving ? "Guardando..." : "Enviar respuestas"}
      </button>
    </div>
  );
}
