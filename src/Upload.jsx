import { useState } from "react";

const SUPABASE_URL = "https://dafszykbqtwhuoshjtlv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZnN6eWticXR3aHVvc2hqdGx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMjYwMTUsImV4cCI6MjA5MTYwMjAxNX0.ksGA4jHA-CCKOYcF9Qy6LNv3_UXSldmf7XMGEmO790M";

const teams = [
  { id: "acquisition", label: "Customer Acquisition", color: "#534AB7", light: "#EEEDFE" },
  { id: "management",  label: "Customer Management",  color: "#0F6E56", light: "#E1F5EE" },
  { id: "collections", label: "Collections",          color: "#993C1D", light: "#FAECE7" },
  { id: "cx_externo",  label: "CX Externo",           color: "#185FA5", light: "#E6F1FB" },
  { id: "cx_interno",  label: "CX Interno / Plataformas", color: "#185FA5", light: "#E6F1FB" },
];

const prompts = {
  acquisition: `Eres SpinLab, analista de inteligencia competitiva de Spin Crédito especializado en adquisición de crédito. Analiza el material de benchmark adjunto y genera un reporte estructurado con: 1) Ficha del competidor (nombre, producto, categoría, fecha, fuente), 2) Resumen ejecutivo (máx 5 líneas), 3) Framework de análisis (Pricing, Value Proposition, UX, Features), 4) Flujo de onboarding paso a paso (pasos totales, canal entrada, requisitos, fricción, tiempo estimado), 5) Comunicación durante el proceso (tono, mensajes clave, canales), 6) Tasas, montos y plazos si están disponibles, 7) Comparativa con Spin Crédito en tabla, 8) 3-5 oportunidades de mejora accionables (Oportunidad / Impacto / Acción), 9) Señales de alerta. Contexto: Spin Crédito es parte del ecosistema digital de OXXO. Competidores: fintechs puras (Nu, Klar, Kueski), super apps (Mercado Pago, Rappi Pay), retail financiero (Coppel, Liverpool), bancos digitales (HeyBanco, AMEX). Nunca inventes información — si no está en el material escribe "No disponible". Responde en español latino neutro.`,
  management: `Eres SpinLab, analista de inteligencia competitiva de Spin Crédito especializado en gestión de cuenta. Analiza el material de benchmark adjunto y genera un reporte estructurado con: 1) Ficha del competidor, 2) Resumen ejecutivo (máx 5 líneas), 3) Framework de análisis (Pricing, Value Proposition, UX, Features), 4) Flujos de pago y autogestión (canales, pasos, claridad, funcionalidades), 5) Comunicación y notificaciones (canales, frecuencia, tono, mensajes clave), 6) Opciones de reestructura y diferimiento si están disponibles, 7) Comparativa con Spin Crédito en tabla, 8) 3-5 oportunidades de mejora accionables, 9) Señales de alerta. Contexto: Spin Crédito es parte del ecosistema digital de OXXO. Nunca inventes información. Responde en español latino neutro.`,
  collections: `Eres SpinLab, analista de inteligencia competitiva de Spin Crédito especializado en cobranza y prevención de mora. Analiza el material adjunto con foco prioritario en prevención temprana. Genera reporte con: 1) Ficha del competidor, 2) Resumen ejecutivo (máx 5 líneas), 3) Framework (Pricing, Value Proposition, UX, Features), 4) Prevención temprana de mora (señales de riesgo, comunicaciones preventivas, segmentación, educación financiera, nudges), 5) Estrategia por tramo (1-30, 31-90, 90+ días), 6) Canales y tono por tramo, 7) Comparativa con Spin en tabla, 8) 3-5 oportunidades accionables, 9) Señales de alerta. Nunca inventes información. Responde en español latino neutro.`,
  cx_externo: `Eres SpinLab, analista de inteligencia competitiva de Spin Crédito especializado en experiencia de cliente. Analiza el material adjunto y genera reporte con: 1) Ficha del competidor, 2) Resumen ejecutivo (máx 5 líneas), 3) Framework (Pricing, Value Proposition, UX, Features), 4) Canales de atención (disponibles, horarios, tiempos de respuesta), 5) Flujos de resolución de quejas, 6) Tono y comunicación de marca, 7) Self-service y automatización, 8) Sentimiento de usuarios si hay reseñas, 9) Comparativa con Spin en tabla, 10) 3-5 oportunidades accionables, 11) Señales de alerta. Nunca inventes información. Responde en español latino neutro.`,
  cx_interno: `Eres SpinLab, analista de inteligencia competitiva de Spin Crédito especializado en plataformas B2B de CX. Analiza el material adjunto y genera reporte con: 1) Ficha de la plataforma o caso, 2) Resumen ejecutivo (máx 5 líneas), 3) Capacidades principales, 4) Casos de uso en fintech o retail financiero, 5) Modelo de implementación, 6) Pricing y modelo comercial si está disponible, 7) Fortalezas y limitaciones, 8) Relevancia para Spin Crédito, 9) Recomendación clara. Nunca inventes información. Responde en español latino neutro.`,
};

async function saveReport(team, title, competitors, source, content) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Prefer": "return=minimal",
    },
    body: JSON.stringify({ team, title, competitors, source, content }),
  });
  if (!res.ok) throw new Error("Error al guardar");
}

export default function Upload() {
  const [team, setTeam] = useState("");
  const [title, setTitle] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [source, setSource] = useState("");
  const [material, setMaterial] = useState("");
  const [report, setReport] = useState("");
  const [step, setStep] = useState("form");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const selectedTeam = teams.find(t => t.id === team);

  const fullPrompt = team && material
    ? `${prompts[team]}\n\n---\n\nMATERIAL A ANALIZAR:\n\n${material}`
    : "";

  const handleSave = async () => {
    setSaving(true); setError(null);
    try {
      await saveReport(
        team, title,
        competitors.split(",").map(c => c.trim()).filter(Boolean),
        source, report
      );
      setStep("saved");
    } catch { setError("No se pudo guardar. Intenta de nuevo."); }
    finally { setSaving(false); }
  };

  const reset = () => {
    setTeam(""); setTitle(""); setCompetitors(""); setSource("");
    setMaterial(""); setReport(""); setStep("form"); setError(null);
  };

  if (step === "saved") return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "2rem", textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
      <p style={{ fontSize: 20, fontWeight: 500, marginBottom: 8 }}>Reporte guardado</p>
      <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>
        El benchmark de <strong>{title}</strong> ya está disponible en SpinLab para el equipo de {selectedTeam?.label}.
      </p>
      <button onClick={reset} style={{ padding: "10px 24px", borderRadius: 8, fontSize: 14, background: selectedTeam?.color, color: "#fff", border: "none", cursor: "pointer" }}>
        Cargar otro benchmark
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "1.5rem" }}>
      <p style={{ fontSize: 22, fontWeight: 500, margin: "0 0 4px" }}>SpinLab</p>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 28 }}>Carga de benchmark · Solo para administradores</p>

      {step === "form" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 8 }}>Equipo</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {teams.map(t => (
                <button key={t.id} onClick={() => setTeam(t.id)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, border: `0.5px solid ${team === t.id ? t.color : "#ddd"}`, background: team === t.id ? t.light : "#fff", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: team === t.id ? t.color : "#333" }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>Título del benchmark</p>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej. Onboarding Nu México — Mayo 2026"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "0.5px solid #ccc", fontSize: 13, boxSizing: "border-box" }} />
          </div>

          <div>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>Competidores analizados <span style={{ color: "#aaa" }}>(separados por coma)</span></p>
            <input value={competitors} onChange={e => setCompetitors(e.target.value)} placeholder="Ej. Nu, Klar, Mercado Pago"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "0.5px solid #ccc", fontSize: 13, boxSizing: "border-box" }} />
          </div>

          <div>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>Fuente del material</p>
            <input value={source} onChange={e => setSource(e.target.value)} placeholder="Ej. Figma, PDF interno, capturas propias"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "0.5px solid #ccc", fontSize: 13, boxSizing: "border-box" }} />
          </div>

          <div>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>Material del benchmark <span style={{ color: "#aaa" }}>(pega el texto o descripciones)</span></p>
            <textarea value={material} onChange={e => setMaterial(e.target.value)} rows={8}
              placeholder="Pega aquí el contenido del benchmark: descripciones de flujos, capturas transcritas, notas del análisis..."
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "0.5px solid #ccc", fontSize: 13, resize: "vertical", boxSizing: "border-box" }} />
          </div>

          <button onClick={() => setStep("prompt")} disabled={!team || !title || !material}
            style={{ padding: "12px 0", borderRadius: 8, fontSize: 14, fontWeight: 500, background: selectedTeam?.color || "#ccc", color: "#fff", border: "none", cursor: team && title && material ? "pointer" : "not-allowed", opacity: team && title && material ? 1 : 0.5 }}>
            Generar prompt para Claude →
          </button>
        </div>
      )}

      {step === "prompt" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: selectedTeam?.light, border: `0.5px solid ${selectedTeam?.color}`, borderRadius: 10, padding: "12px 16px" }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: selectedTeam?.color, margin: "0 0 4px" }}>Paso 2 de 3</p>
            <p style={{ fontSize: 13, color: "#555", margin: 0 }}>Copia el prompt, pégalo en Claude.ai y copia el reporte generado abajo.</p>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <p style={{ fontSize: 13, color: "#555", margin: 0 }}>Prompt listo para Claude.ai</p>
              <button onClick={() => navigator.clipboard.writeText(fullPrompt)}
                style={{ fontSize: 12, padding: "4px 12px", borderRadius: 6, border: "0.5px solid #ccc", background: "#fff", cursor: "pointer", color: "#555" }}>
                Copiar
              </button>
            </div>
            <textarea value={fullPrompt} readOnly rows={10}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "0.5px solid #ddd", fontSize: 12, background: "#f9f9f9", resize: "vertical", boxSizing: "border-box", color: "#555", fontFamily: "monospace" }} />
          </div>

          <div>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>Reporte generado por Claude <span style={{ color: "#aaa" }}>(pégalo aquí)</span></p>
            <textarea value={report} onChange={e => setReport(e.target.value)} rows={12}
              placeholder="Pega aquí el reporte que generó Claude.ai..."
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "0.5px solid #ccc", fontSize: 13, resize: "vertical", boxSizing: "border-box" }} />
          </div>

          {error && <p style={{ fontSize: 13, color: "red" }}>{error}</p>}

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep("form")}
              style={{ flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 13, border: "0.5px solid #ccc", background: "#fff", cursor: "pointer", color: "#555" }}>
              ← Volver
            </button>
            <button onClick={handleSave} disabled={!report || saving}
              style={{ flex: 2, padding: "10px 0", borderRadius: 8, fontSize: 14, fontWeight: 500, background: selectedTeam?.color, color: "#fff", border: "none", cursor: report ? "pointer" : "not-allowed", opacity: report ? 1 : 0.5 }}>
              {saving ? "Guardando..." : "Guardar en SpinLab →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
