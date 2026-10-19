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
| Beam | ✅ Gratis |
| LongCat 2.5 Preview | ✅ Gratis |
| Space Bunny | ✅ Gratis |
| MiMo-V2.6-Flash | ✅ Gratis |
| DeepSeek V4.1 Flash | ✅ Gratis |
| GLM-5.3-Flash | ✅ Gratis |
| Nemotron 3.5 Lightning | ✅ Gratis |
| Nemotron 3 Ultra | ✅ Gratis |
| Big Pickle | ✅ Gratis |

Selecciona cualquiera desde **Configuración → Seleccionar modelo** en OpenCode.

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
