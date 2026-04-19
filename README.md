# SpinLab

Plataforma de inteligencia competitiva para los equipos de Spin Crédito. Centraliza y automatiza el análisis de benchmarks para que cada equipo tenga la información de la competencia que necesita, cuando la necesita.

---

## Contexto estratégico

Spin Crédito es una unidad de negocio de Spin, fintech de OXXO. Su visión es convertirse en el ecosistema digital financiero del usuario de OXXO. SpinLab nace para apoyar esa visión con inteligencia competitiva estructurada, accesible y accionable.

---

## Estado actual del proyecto

| Fase | Descripción | Estado |
|------|-------------|--------|
| Paso 0 | Levantamiento de necesidades por equipo | ✅ Completado |
| Paso 1 | Diseño de prompts por equipo | ✅ Completado |
| Paso 2 | Motor de análisis (Claude API + Supabase) | 🔜 Siguiente |
| Paso 3 | Interfaz de reportes | 🔜 Pendiente |
| Paso 4 | Bot de Slack | 🔜 Pendiente |

---

## Arquitectura

### Stack tecnológico
- **Base de datos:** Supabase (PostgreSQL + Storage + Auth)
- **Automatización de ingesta:** n8n (por implementar)
- **Motor de análisis:** Claude API (Anthropic)
- **Frontend:** React + Vite
- **Deploy:** Vercel
- **Canal de entrega:** Slack Bot (por implementar)

### Fuentes de información soportadas
- Capturas de pantalla de apps y webs
- PDFs y documentos
- Exportaciones de Figma, FigJam y Miro
- Descripciones textuales de flujos

---

## Repositorio

### Estructura de archivos
```
spinlab-form/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── src/
    ├── main.jsx        # Enrutador: / → formulario, /dashboard → dashboard
    ├── App.jsx         # Formulario de levantamiento por equipo
    └── Dashboard.jsx   # Vista de respuestas con tarjetas y tabla
```

### URLs
- **Formulario:** spinlab-form.vercel.app
- **Dashboard de respuestas:** spinlab-form.vercel.app/dashboard

### Base de datos (Supabase)
Tabla `responses`:
```sql
create table responses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp default now(),
  team text,
  name text,
  answers jsonb
);
```

---

## Equipos piloto — Spin Crédito

| Equipo | Foco principal | Prompt |
|--------|---------------|--------|
| Customer Acquisition | Flujo de oferta hasta desembolso | `prompt_acquisition.md` |
| Customer Management | Administración de cuenta y pagos | `prompt_management.md` |
| Collections | Prevención y cobranza post vencimiento | `prompt_collections.md` |
| CX Externo | Experiencia del cliente final | `prompt_cx_externo.md` |
| CX Interno | Plataformas B2B de gestión | `prompt_cx_interno.md` |

---

## Competidores monitoreados

| Categoría | Players |
|-----------|---------|
| Fintech pura | Nu, Klar, Kueski |
| Super app / ecosistema | Mercado Pago, Rappi Pay, Clip |
| Retail financiero | Coppel, Liverpool, BNPLs |
| Banco digital | HeyBanco, AMEX, BBVA |
| Referencias internacionales | Nubank (BR), Grab Financial (SEA), WeChat Pay (China) |

---

## Levantamiento de necesidades

Se realizó entre el 14 y 16 de abril de 2026 vía formulario personalizado por equipo (spinlab-form.vercel.app). Se recibieron 13 respuestas de los 4 equipos de Spin Crédito.

### Hallazgos principales
- **Dolor compartido:** todos los equipos deben hacerse clientes reales de la competencia para acceder a sus flujos. SpinLab resuelve esto.
- **Competidores más mencionados:** Nu (6), Mercado Pago (4), Klar (3).
- **Frecuencia preferida:** mensual para la mayoría, semanal para Acquisition.
- **Formato:** flexible, con preferencia por resumen ejecutivo e insights accionables.

---

## Decisiones de diseño

**¿Por qué Supabase?**
Ya usado en la versión anterior (SpinLab v1 en Figma Maker). En esta versión se resolvió el problema de pérdida de datos usando el cliente de servicio correcto y RLS configurado adecuadamente.

**¿Por qué Vercel?**
Deploy instantáneo desde GitHub, sin configuración. El formulario no puede correr directo desde Claude.ai por restricciones de CORS con Supabase.

**¿Por qué prompts separados por equipo?**
Las necesidades de cada equipo son distintas en foco, competidores relevantes y tipo de output. Un prompt genérico produciría reportes menos accionables.

**¿Por qué incluir retail financiero en los benchmarks?**
Spin Crédito nació desde retail (OXXO) y su visión es ser el ecosistema digital financiero de sus usuarios. Ignorar cómo players como Mercado Pago o Coppel construyen ecosistema sería un punto ciego estratégico.

**¿Por qué dos prompts para CX?**
El equipo de CX tiene dos necesidades distintas: analizar la experiencia del cliente final de la competencia (CX Externo) y evaluar plataformas B2B de gestión interna (CX Interno). Un solo prompt no podía cubrir ambas sin perder foco.

---

## Próximos pasos

1. Piloto de prompts con material real de cada equipo
2. Ajuste de prompts según feedback del piloto
3. Construcción del motor de análisis (Claude API + Supabase)
4. Interfaz de reportes para consulta por equipo
5. Bot de Slack para solicitud y entrega de reportes
6. Extensión a todos los equipos de Spin
