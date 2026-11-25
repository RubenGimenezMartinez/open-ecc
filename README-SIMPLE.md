# ECC Simplificado para OpenCode

Versión ligera del repositorio **ECC** de [Affaan Mustafa](https://github.com/affaan-m) (ganador del hackathon Anthropic x Forum Ventures / Cerebral Valley), adaptada para usar **exclusivamente modelos gratuitos** de OpenCode.

## ¿Qué es esto?

ECC es un sistema de optimización de harness de agentes de IA que incluye:
- Agentes especializados (planificación, arquitectura, revisión de código, seguridad, TDD, etc.)
- Comandos slash (`/plan`, `/tdd`, `/code-review`, `/security`, etc.)
- Skills de flujo de trabajo (TDD, estándares de código, patrones backend/frontend, diseño de API)
- Instrucciones core para desarrollo seguro y de calidad

Esta versión simplificada incluye solo los componentes esenciales para mantener la instalación ligera y rápida.

## Modelos Gratuitos Soportados

OpenCode proporciona los siguientes modelos **100% gratuitos** (sin API key):

| Modelo | Estado |
|--------|--------|
| **Nemotron 3.5 Super VL** | ✅ Seleccionado por defecto |
| Nemotron 3.5 Lightning | ✅ Gratis |
| DeepSeek V4.1 Flash | ✅ Gratis |
| Big Pickle | ✅ Gratis |
| Beam | ✅ Gratis |
| MiMo-V2.6-Flash | ✅ Gratis |
| Tidepool Alpha | ✅ Gratis |
| Hy4 flash | ✅ Gratis |
| Iceman | ✅ Gratis |
| Flint 40B | ✅ Gratis |

*Nota: Los modelos LongCat 2.5 Preview, Space Bunny, GLM-5.3-Flash y Nemotron 3 Ultra ya no aparecen como disponibles en el selector de modelos de OpenCode.*

Selecciona cualquiera desde **Configuración → Seleccionar modelo** en OpenCode.

## Asignación de Modelos por Parte del Flujo de Trabajo

Cada agente del flujo ECC tiene un propósito diferente. Aquí tienes qué modelo gratuito encaja mejor en cada etapa:

| Parte del flujo | Comando | Agente | Modelo recomendado | ¿Por qué? |
|---|---|---|---|---|
| **Planificación** | `/plan` | `planner` | Nemotron 3.5 Super VL | Razonamiento complejo, comprensión de arquitectura y visión general |
| **Arquitectura** | (interno) | `architect` | Nemotron 3.5 Super VL | Diseño de sistema, análisis de trade-offs, decisiones técnicas |
| **Desarrollo TDD** | `/tdd` | `tdd-guide` | Nemotron 3.5 Lightning | Iteraciones rápidas, escritura de tests y código paso a paso |
| **Revisión de código** | `/code-review` | `code-reviewer` | DeepSeek V4.1 Flash | Análisis detallado, detección de problemas de calidad |
| **Revisión de seguridad** | `/security` | `security-reviewer` | DeepSeek V4.1 Flash | Detección de vulnerabilidades, patrones de ataque OWASP |
| **Corrección de build** | `/build-fix` | `build-error-resolver` | Nemotron 3.5 Lightning | Fixes mínimos, correcciones rápidas de tipo y compilación |
| **Pruebas E2E** | `/e2e` | `e2e-runner` | MiMo-V2.6-Flash | Automatización de flujos, generación de pruebas de usuario |

### Configuración rápida

```bash
# Seleccionar modelo por defecto (planificación y arquitectura)
Nemotron 3.5 Super VL

# Para desarrollo rápido y fixes
Nemotron 3.5 Lightning

# Para revisiones de código y seguridad
DeepSeek V4.1 Flash

# Para pruebas E2E y automatización
MiMo-V2.6-Flash
```

En OpenCode, ve a **Configuración → Seleccionar modelo** y elige el modelo apropiado para cada tarea del flujo.

## Instalación Rápida

Opción A: Usar directamente este repositorio

```bash
git clone https://github.com/affaan-m/ECC.git
cd ECC
opencode
```

Opción B: Copiar solo la configuración simplificada a tu proyecto

```bash
# Copiar configuración OpenCode simplificada
cp -r .opencode /tu-proyecto/.opencode

# Copiar skills esenciales
cp -r skills/tdd-workflow skills/security-review skills/coding-standards skills/backend-patterns skills/frontend-patterns skills/api-design /tu-proyecto/skills/

# Copiar instrucciones
cp .opencode/instructions/INSTRUCTIONS-SIMPLE.md /tu-proyecto/.opencode/instructions/
```

Luego abre OpenCode en tu proyecto y selecciona **Nemotron 3.5 Super VL** (u otro modelo gratuito) en el selector de modelo.

## Componentes Incluidos

### Agentes (8)

| Agente | Propósito |
|--------|-----------|
| build | Agente principal de desarrollo |
| planner | Planificación de implementación |
| architect | Diseño de arquitectura y sistema |
| code-reviewer | Revisión de calidad y seguridad |
| security-reviewer | Detección de vulnerabilidades |
| tdd-guide | Desarrollo dirigido por pruebas |
| build-error-resolver | Corrección de errores de build |
| e2e-runner | Pruebas E2E con Playwright |

### Comandos (7)

| Comando | Descripción |
|---------|-------------|
| `/plan` | Plan de implementación detallado |
| `/tdd` | Flujo TDD con 80%+ cobertura |
| `/code-review` | Revisión de código |
| `/security` | Revisión de seguridad exhaustiva |
| `/build-fix` | Corregir errores de build |
| `/e2e` | Pruebas E2E con Playwright |
| `/refactor-clean` | Eliminar código muerto |

### Skills (6)

| Skill | Categoría |
|-------|-----------|
| tdd-workflow | Flujo de trabajo TDD |
| security-review | Checklist de seguridad |
| coding-standards | Estándares TypeScript/JavaScript |
| backend-patterns | Patrones de API y base de datos |
| frontend-patterns | Patrones React/Next.js |
| api-design | Diseño de API REST |

## Flujo de Trabajo Típico

1. **Planificar**: `/plan "Agregar autenticación con OAuth"`
2. **Desarrollar con TDD**: `/tdd "Implementar endpoint de login"`
3. **Revisar código**: `/code-review`
4. **Revisar seguridad**: `/security`
5. **Corregir build**: `/build-fix`
6. **Probar E2E**: `/e2e "Flujo crítico de registro"`

## Licencia

MIT - Ver [LICENSE](LICENSE)

## Créditos

Repositorio original: [affaan-m/ECC](https://github.com/affaan-m/ECC) por Affaan Mustafa
