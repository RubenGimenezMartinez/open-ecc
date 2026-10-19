# ECC Flow Manager — Dashboard de Orquestación de Agentes

> Interfaz web para crear, ejecutar y monitorear flujos de creación de proyectos con ECC Simplificado.
> El usuario abre la web, dice "crea un plan de este tipo" y ve en tiempo real cómo trabajan los agentes y en qué estado va cada fase.

---

## 1. Visión del producto

**ECC Flow Manager** es una aplicación web que sirve como panel de control y monitoreo para flujos de ejecución de ECC (Agente de Código). Permite:

- Iniciar un flujo de creación de proyecto desde una descripción en lenguaje natural
- Ver en tiempo real qué agentes están ejecutando (planner, architect, code-reviewer, tdd-guide, security-reviewer, build-error-resolver, e2e-runner)
- Consultar el estado de cada fase (planificación, implementación, pruebas, revisión, despliegue)
- Acceder a los planes generados, código producido y resultados de pruebas

El objetivo es tener una **interfaz visual de gestión del flujo de agentes ECC**, usando exclusivamente modelos gratuitos de OpenCode (Nemotron 3.5 Super VL y otros).

---

## 2. Objetivos

| Objetivo | Métrica de éxito |
|----------|------------------|
| Panel web para iniciar flujos de ECC desde chat/interfaz | Usuario puede crear un plan desde la web |
| Monitoreo en tiempo real de ejecución de agentes | Se ven estados: pendiente, ejecutando, completado, error |
| Almacenar historial de planes y ejecuciones | Se pueden revisar planes anteriores |
| Usar únicamente modelos gratuitos de OpenCode | Cero costo en API keys |
| Código con TDD y 80%+ cobertura | Pruebas unitarias, integración y E2E |
| Desplegar en entorno gratuito | URL pública accesible |

---

## 3. Público objetivo

- Desarrolladores que usan ECC/OpenCode y quieren una interfaz visual para gestionar flujos
- Equipos que necesitan trazarabilidad de qué agente hizo qué y cuándo
- Usuarios que quieren supervisar la ejecución autónoma de agentes sin estar en la terminal todo el tiempo

---

## 4. Stack tecnológico (ajustado para dashboard de monitoreo)

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Frontend | React 18 + Vite + Tailwind CSS | Dashboard moderno, rápido, componentes reactivos |
| Gestión de estado | Zustand | Estado global ligero para estado de agentes y planes |
| Backend | Node.js + Express | API REST para crear planes, consultar estados, recibir eventos de agentes |
| Base de datos | MongoDB | Almacenar planes, ejecuciones, estados de agentes, resultados (documentos flexibles) |
| Tiempo real | WebSocket (Socket.io) | Ver en vivo qué agente está ejecutando y su progreso, sin polling |
| Integración ECC | Archivos de estado + API REST + WebSocket | Los agentes reportan progreso al dashboard mediante archivos JSON, llamadas HTTP y eventos WebSocket |
| Pruebas unitarias | Vitest | Rápido, compatible con Vite |
| Pruebas E2E | Playwright | Flujos críticos: crear plan, ver ejecución, consultar estado |
| Despliegue | Autoalojado con PM2 | Servidor propio, gestión de procesos con PM2, sin depender de plataformas gratuitas externas |
| Autenticación | Ninguna | Acceso directo sin login, para uso interno o entornos de confianza |
| Modelo IA | Nemotron 3.5 Super VL (OpenCode) | Gratuito, integrado en OpenCode |

---

## 5. Características funcionales

### ✅ MVP (Versión 1.0) — Dashboard de Monitoreo de Flujos ECC

#### Crear flujo
- [ ] Formulario o campo de texto para describir el proyecto a crear ("Crea un plan de este tipo: [descripción]")
- [ ] Botón "Iniciar flujo" que dispara el agente planner y genera un plan de implementación
- [ ] Seleccionar modelo gratuito (Nemotron 3.5 Super VL por defecto)

#### Monitoreo en tiempo real
- [ ] Lista de planes/ejecuciones recientes con estado (pendiente, ejecutando, completado, fallido)
- [ ] Vista de detalle de una ejecución: qué agentes han participado y en qué orden
- [ ] Estado por agente: pendiente → ejecutando → completado → error
- [ ] Logs o mensajes de cada agente (qué está haciendo ahora)
- [ ] Indicador visual de progreso (porcentaje de fases completadas)

#### Consulta de resultados
- [ ] Ver el plan generado (archivo .plan.md o similar)
- [ ] Ver código producido por cada agente
- [ ] Ver resultados de pruebas (TDD, cobertura)
- [ ] Ver reportes de seguridad y revisión de código

#### Historial
- [ ] Listar todos los planes creados anteriormente
- [ ] Revisar ejecuciones pasadas y sus resultados
- [ ] Eliminar planes antiguos

### 🔜 Post-MVP (Versión 2.0+)

- Autenticación de usuarios
- Asignar flujos a proyectos específicos
- Notificaciones (email, webhook) cuando un flujo termine o falle
- Reintentar flujo fallido desde un agente específico
- Comparar ejecuciones (diffs entre versiones)
- Exportar reporte de ejecución (PDF/JSON)
- Temas oscuro/claro
- Arrastre para reordenar prioridad de planes
- **Archify**: Integrar Archify para generar diagramas interactivos de flujos de ejecución, permitiendo visualizar y añadir funcionalidades a los flujos desde la UI

---

## 6. Requisitos no funcionales

| Categoría | Requisito |
|-----------|-----------|
| Tiempo real | El usuario debe ver cambios de estado de agentes en < 3 segundos |
| Rendimiento | Carga inicial del dashboard < 2 segundos |
| Seguridad | Sin secretos hardcodeados, validación de entrada, XSS/CSRF protegido |
| Almacenamiento | Los estados de ejecución persisten en MongoDB |
| Responsive | Funciona en móvil y escritorio |
| Mantenibilidad | Código con 80%+ cobertura de pruebas |
| Costo | Cero dólares en infraestructura y modelos IA |

---

## 7. Diseño y UX

### Principios de diseño
- **Panel de control**: Vista de mando central con lista de flujos y estados
- **Tiempo real**: Indicadores visuales que cambian sin recargar (WebSocket)
- **Trazabilidad**: Qué agente ejecutó qué, cuánto tardó, qué produjo
- **Minimalista**: Solo información esencial para no abrumar

### Pantallas principales
1. **Inicio / Dashboard** — Lista de flujos recientes con estados y progreso
2. **Crear flujo** — Formulario para describir el proyecto e iniciar ejecución
3. **Detalle de ejecución** — Cronograma de agentes, estados, logs, resultados
4. **Historial** — Lista de todos los flujos pasados
5. **Configuración** — Selección de modelo, preferencias de notificación

### Estados visuales de un agente
- ⬜ Pendiente
- 🔄 Ejecutando (con spinner o barra de progreso)
- ✅ Completado
- ❌ Error / Fallido
- ⏸️ Pausado

---

## 8. Arquitectura de alto nivel

```
frontend/ (React + Vite)
├── components/
│   ├── FlowList.jsx        # Lista de flujos recientes
│   ├── FlowCard.jsx        # Tarjeta individual con estado
│   ├── AgentTimeline.jsx   # Cronograma de agentes por ejecución
│   ├── AgentStatus.jsx     # Indicador visual de estado de agente
│   ├── FlowDetail.jsx      # Vista detalle con logs y resultados
│   └── CreateFlowForm.jsx  # Formulario para iniciar flujo
├── pages/
│   ├── Dashboard.jsx
│   ├── CreateFlow.jsx
│   ├── FlowDetail.jsx
│   └── History.jsx
├── hooks/
│   ├── useFlows.js         # Hook para obtener flujos
│   ├── useAgentStatus.js   # Hook para WebSocket tiempo real
│   └── useCreateFlow.js    # Hook para iniciar flujo
├── services/
│   └── api.js              # Llamadas a backend
└── store/                  # Zustand store

backend/ (Node.js + Express)
├── routes/
│   ├── flows.js            # CRUD de flujos/planes
│   ├── agents.js           # Estados de agentes
│   └── events.js           # WebSocket para tiempo real
├── controllers/
├── models/                 # Esquemas: Flow, AgentExecution, Log
├── middleware/
└── db/                     # Configuración MongoDB (Mongoose)

database/
├── models/
│   ├── Flow.js
│   ├── AgentExecution.js
│   └── ExecutionLog.js
└── connection.js
```

### Esquema de base de datos (MongoDB)

```javascript
// models/Flow.js
const FlowSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, default: 'pending', enum: ['pending', 'running', 'completed', 'failed'] },
  modelUsed: { type: String, default: 'nemotron-3.5-super-vl' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  completedAt: Date
});

// models/AgentExecution.js
const AgentExecutionSchema = new mongoose.Schema({
  flowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flow', required: true },
  agentName: { type: String, required: true }, // planner, architect, code-reviewer, etc.
  status: { type: String, default: 'pending', enum: ['pending', 'running', 'completed', 'failed'] },
  startedAt: Date,
  completedAt: Date,
  outputSummary: String,
  errorMessage: String
});

// models/ExecutionLog.js
const ExecutionLogSchema = new mongoose.Schema({
  flowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flow', required: true },
  agentName: String,
  message: String,
  level: { type: String, default: 'info', enum: ['info', 'warn', 'error'] },
  createdAt: { type: Date, default: Date.now }
});
```

### Endpoints REST (MVP)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/flows` | Listar flujos con estados |
| POST | `/api/flows` | Crear nuevo flujo (disparar planner) |
| GET | `/api/flows/:id` | Detalle de un flujo |
| GET | `/api/flows/:id/agents` | Estados de agentes de un flujo |
| GET | `/api/flows/:id/logs` | Logs de ejecución en tiempo real |
| GET | `/api/flows/:id/plan` | Obtener plan generado |
| GET | `/api/events` | WebSocket endpoint para tiempo real de estados |

---

## 9. Criterios de aceptación (MVP)

1. Puedo abrir la web y ver la lista de flujos recientes
2. Puedo escribir una descripción y crear un nuevo flujo ("crea un plan de este tipo: ...")
3. Puedo ver en tiempo real qué agente está ejecutando y su estado
4. Puedo ver el plan generado y los resultados de cada agente
5. Los estados se actualizan sin recargar la página (WebSocket)
6. Puedo revisar flujos antiguos en el historial
7. La aplicación carga en menos de 2 segundos
8. Todas las pruebas pasan (80%+ cobertura)
9. No hay secretos hardcodeados
10. Desplegado y accesible por URL pública

---

## 10. Roadmap por fases

| Fase | Duración estimada | Entregable |
|------|------------------|------------|
| **Fase 1: Definición** | 1 sesión | `PROJECT-DEFINITION.md` actualizado |
| **Fase 2: Setup del proyecto** | 1 sesión | Repositorio, Vite + React, Tailwind, Express, MongoDB |
| **Fase 3: API y base de datos** | 2 sesiones | Endpoints CRUD de flujos, modelo de datos |
| **Fase 4: Frontend Dashboard** | 2-3 sesiones | Lista de flujos, crear flujo, vista detalle |
| **Fase 5: Tiempo real** | 1-2 sesiones | WebSocket para estados de agentes en vivo |
| **Fase 6: Integración ECC** | 2-3 sesiones | Conectar con agentes de OpenCode/ECC para reportar progreso |
| **Fase 7: Pruebas y TDD** | 2 sesiones | 80%+ cobertura, pruebas E2E del dashboard |
| **Fase 8: Despliegue** | 1 sesión | Despliegue autoalojado con PM2, URL pública |

---

## 11. Cómo usar esto con ECC / OpenCode

Este documento es el input para los agentes de ECC Simplificado.

### Paso 1: Generar el plan de implementación

En OpenCode, ejecuta:

```
/plan "Implementar ECC Flow Manager basado en PROJECT-DEFINITION.md"
```

Esto invocará al agente **planner** que leerá este documento y generará un plan estructurado.

### Paso 2: Implementar con TDD

```
/tdd "Crear API REST para flujos con Express y MongoDB"
/tdd "Crear dashboard React con lista de flujos y estados"
/tdd "Implementar tiempo real con WebSocket para estados de agentes"
```

### Paso 3: Revisar código y seguridad

```
/code-review
/security
```

### Paso 4: Probar E2E

```
/e2e "Flujo completo: crear flujo desde web, ver ejecución de agentes, consultar estado"
```

---

## 12. Archivos relacionados

```
PROJECT-DEFINITION.md      # Este archivo (definición del producto)
.opencode/opencode.simple.json   # Configuración ECC Simplificado
.opencode/instructions/INSTRUCTIONS-SIMPLE.md
skills/                    # Skills de ECC (TDD, seguridad, estándares, API, backend, frontend)
```

---

¿Está bien esta definición ajustada? Si estás de acuerdo, el siguiente paso en OpenCode es:

**Ejecutar `/plan "Implementar ECC Flow Manager basado en PROJECT-DEFINITION.md"`**

¿Quieres ajustar algo más antes de continuar, o procedemos con el plan?
