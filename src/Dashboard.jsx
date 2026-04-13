import { useState, useEffect } from "react";

const SUPABASE_URL = "https://dafszykbqtwhuoshjtlv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZnN6eWticXR3aHVvc2hqdGx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMjYwMTUsImV4cCI6MjA5MTYwMjAxNX0.ksGA4jHA-CCKOYcF9Qy6LNv3_UXSldmf7XMGEmO790M";

const teams = {
  acquisition: { label: "Customer Acquisition", color: "#534AB7", light: "#EEEDFE" },
  management:  { label: "Customer Management",  color: "#0F6E56", light: "#E1F5EE" },
  collections: { label: "Collections",          color: "#993C1D", light: "#FAECE7" },
  cx:          { label: "CX",                   color: "#185FA5", light: "#E6F1FB" },
};

const qLabels = {
  q1: "Mayor dolor al buscar info de competencia",
  q2: "Tipo de benchmark más frecuente",
  q3: "Competidores relevantes",
  q4: "Frecuencia de reportes",
  q5: "Formato preferido",
  q6: "Pregunta clave para SpinLab",
  q7: "Dónde guardan benchmarks hoy",
  q8: "Comentarios adicionales",
};

async function fetchResponses() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/responses?select=*&order=created_at.desc`, {
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` },
  });
  return res.json();
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function Dashboard() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [view, setView]           = useState("cards"); // "cards" | "table"
  const [filterTeam, setFilterTeam] = useState("all");

  useEffect(() => {
    fetchResponses().then(data => { setResponses(data); setLoading(false); });
  }, []);

  const filtered = filterTeam === "all" ? responses : responses.filter(r => r.team === filterTeam);

  const byTeam = Object.keys(teams).reduce((acc, t) => {
    acc[t] = responses.filter(r => r.team === t);
    return acc;
  }, {});

  if (loading) return (
    <div style={{ padding: "3rem", textAlign: "center", color: "#888", fontSize: 14 }}>Cargando respuestas...</div>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>SpinLab</p>
          <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Dashboard de respuestas — Spin Crédito</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setView("cards")}
            style={{ padding: "7px 16px", borderRadius: 8, fontSize: 13, border: `0.5px solid ${view === "cards" ? "#534AB7" : "#ddd"}`, background: view === "cards" ? "#EEEDFE" : "#fff", color: view === "cards" ? "#534AB7" : "#555", cursor: "pointer" }}>
            Tarjetas
          </button>
          <button onClick={() => setView("table")}
            style={{ padding: "7px 16px", borderRadius: 8, fontSize: 13, border: `0.5px solid ${view === "table" ? "#534AB7" : "#ddd"}`, background: view === "table" ? "#EEEDFE" : "#fff", color: view === "table" ? "#534AB7" : "#555", cursor: "pointer" }}>
            Tabla
          </button>
        </div>
      </div>

      {/* Stats por equipo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
        {Object.entries(teams).map(([id, t]) => (
          <div key={id} onClick={() => setFilterTeam(filterTeam === id ? "all" : id)}
            style={{ background: filterTeam === id ? t.light : "#f9f9f9", border: `0.5px solid ${filterTeam === id ? t.color : "#eee"}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", transition: "all 0.15s" }}>
            <p style={{ fontSize: 11, color: filterTeam === id ? t.color : "#888", margin: "0 0 4px", fontWeight: 500 }}>{t.label}</p>
            <p style={{ fontSize: 24, fontWeight: 500, margin: 0, color: filterTeam === id ? t.color : "#222" }}>{byTeam[id].length}</p>
            <p style={{ fontSize: 11, color: "#aaa", margin: 0 }}>respuesta{byTeam[id].length !== 1 ? "s" : ""}</p>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
        {filtered.length} respuesta{filtered.length !== 1 ? "s" : ""} {filterTeam !== "all" ? `· ${teams[filterTeam]?.label}` : "· todos los equipos"}
        {filterTeam !== "all" && <button onClick={() => setFilterTeam("all")} style={{ marginLeft: 8, fontSize: 12, color: "#888", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>ver todos</button>}
      </p>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: 14 }}>No hay respuestas aún para este equipo.</div>
      )}

      {/* Vista tarjetas */}
      {view === "cards" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map(r => {
            const t = teams[r.team] || {};
            return (
              <div key={r.id} style={{ border: "0.5px solid #e5e5e5", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ background: t.light, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color }} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: t.color }}>{r.name}</span>
                    <span style={{ fontSize: 12, color: t.color, opacity: 0.7 }}>· {t.label}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#aaa" }}>{formatDate(r.created_at)}</span>
                </div>
                <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {Object.entries(r.answers || {}).map(([key, val]) => {
                    if (!val || (Array.isArray(val) && val.length === 0)) return null;
                    return (
                      <div key={key}>
                        <p style={{ fontSize: 11, color: "#aaa", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{qLabels[key] || key}</p>
                        <p style={{ fontSize: 13, color: "#333", margin: 0 }}>{Array.isArray(val) ? val.join(" · ") : val}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Vista tabla */}
      {view === "table" && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "0.5px solid #e5e5e5" }}>
                <th style={{ textAlign: "left", padding: "8px 12px", color: "#888", fontWeight: 500 }}>Equipo</th>
                <th style={{ textAlign: "left", padding: "8px 12px", color: "#888", fontWeight: 500 }}>Nombre</th>
                <th style={{ textAlign: "left", padding: "8px 12px", color: "#888", fontWeight: 500 }}>Frecuencia</th>
                <th style={{ textAlign: "left", padding: "8px 12px", color: "#888", fontWeight: 500 }}>Formato</th>
                <th style={{ textAlign: "left", padding: "8px 12px", color: "#888", fontWeight: 500 }}>Competidores</th>
                <th style={{ textAlign: "left", padding: "8px 12px", color: "#888", fontWeight: 500 }}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const t = teams[r.team] || {};
                return (
                  <tr key={r.id} style={{ borderBottom: "0.5px solid #f0f0f0", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ background: t.light, color: t.color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{t.label}</span>
                    </td>
                    <td style={{ padding: "10px 12px", color: "#333" }}>{r.name}</td>
                    <td style={{ padding: "10px 12px", color: "#555" }}>{r.answers?.q4 || "—"}</td>
                    <td style={{ padding: "10px 12px", color: "#555" }}>{r.answers?.q5 || "—"}</td>
                    <td style={{ padding: "10px 12px", color: "#555" }}>{r.answers?.q3 || "—"}</td>
                    <td style={{ padding: "10px 12px", color: "#aaa", fontSize: 12 }}>{formatDate(r.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
