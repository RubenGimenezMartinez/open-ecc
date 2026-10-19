#!/usr/bin/env bash
# ECC Simplificado - Script de instalación (Bash)
# Copia la configuración simplificada al proyecto actual

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST_OPENSEARCH=".opencode"

echo "📦 Instalando ECC Simplificado..."

# Copiar configuración OpenCode
if [ ! -d "$DEST_OPENSEARCH" ]; then
    mkdir -p "$DEST_OPENSEARCH"
fi

cp -r "$SCRIPT_DIR/.opencode/"* "$DEST_OPENSEARCH/"
echo "✅ Configuración OpenCode instalada en .opencode/"

# Copiar skills esenciales
SKILLS=("tdd-workflow" "security-review" "coding-standards" "backend-patterns" "frontend-patterns" "api-design")
SKILLS_DEST="skills"

if [ ! -d "$SKILLS_DEST" ]; then
    mkdir -p "$SKILLS_DEST"
fi

for skill in "${SKILLS[@]}"; do
    if [ -d "$SCRIPT_DIR/skills/$skill" ]; then
        cp -r "$SCRIPT_DIR/skills/$skill" "$SKILLS_DEST/"
        echo "✅ Skill copiada: $skill"
    fi
done

echo ""
echo "📋 Próximos pasos:"
echo "1. Abre OpenCode en este proyecto"
echo "2. Ve a Configuración → Seleccionar modelo"
echo "3. Elige Nemotron 3.5 Super VL (Gratis)"
echo ""
echo "🎉 ¡ECC Simplificado listo para usar!"
