# Instalación Rápida - ECC Simplificado

## Opción 1: Usar este repositorio directamente

```bash
# Clonar el repositorio
git clone https://github.com/affaan-m/ECC.git
cd ECC

# Abrir OpenCode (usa opencode.simple.json como referencia)
opencode

# En OpenCode, selecciona Nemotron 3.5 Super VL (gratuito)
# Configuración → Seleccionar modelo → Nemotron 3.5 Super VL [Gratis]
```

## Opción 2: Copiar solo la configuración simplificada a tu proyecto

```bash
# Desde este repositorio, copiar a tu proyecto
cp -r .opencode /tu-proyecto/.opencode
cp -r skills/tdd-workflow skills/security-review skills/coding-standards skills/backend-patterns skills/frontend-patterns skills/api-design /tu-proyecto/skills/

# En tu proyecto, abrir OpenCode
cd /tu-proyecto
opencode

# Seleccionar modelo gratuito Nemotron 3.5 Super VL
```

## Opción 3: Usar como plugin en otro proyecto OpenCode

Agregar a tu `opencode.json`:

```json
{
  "plugin": ["./plugins"],
  "instructions": [
    "instructions/INSTRUCTIONS-SIMPLE.md",
    "skills/tdd-workflow/SKILL.md",
    "skills/security-review/SKILL.md",
    "skills/coding-standards/SKILL.md"
  ],
  "skills": {
    "paths": ["../skills"]
  },
  "agent": {
    "build": { "mode": "primary", "tools": { "write": true, "edit": true, "bash": true, "read": true } },
    "planner": { "mode": "subagent", "prompt": "{file:prompts/agents/simple/planner.txt}" },
    "code-reviewer": { "mode": "subagent", "prompt": "{file:prompts/agents/simple/code-reviewer.txt}" },
    "tdd-guide": { "mode": "subagent", "prompt": "{file:prompts/agents/simple/tdd-guide.txt}" }
  },
  "command": {
    "plan": { "template": "{file:commands/plan.md}\n\n$ARGUMENTS", "agent": "planner" },
    "tdd": { "template": "{file:commands/tdd.md}\n\n$ARGUMENTS", "agent": "tdd-guide" },
    "code-review": { "template": "{file:commands/code-review.md}\n\n$ARGUMENTS", "agent": "code-reviewer" }
  }
}
```

## Verificar instalación

```bash
# Verificar que OpenCode detecta los comandos
opencode --help

# Verificar agentes disponibles
opencode agents list
```

## Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `/plan` | Plan de implementación |
| `/tdd` | Desarrollo dirigido por pruebas |
| `/code-review` | Revisión de código |
| `/security` | Revisión de seguridad |
| `/build-fix` | Corregir errores de build |
| `/e2e` | Pruebas E2E |
| `/refactor-clean` | Eliminar código muerto |
| `/modelo-gratuito` | Info sobre modelos gratuitos |

## Modelo recomendado

**Nemotron 3.5 Super VL** - Gratis, ideal para desarrollo general

Selecciona desde: Configuración → Seleccionar modelo
