# ECC Simplificado - Script de instalación (PowerShell)
# Copia la configuración simplificada al proyecto actual

$source = Join-Path $PSScriptRoot ".opencode"
$dest = Join-Path (Get-Location) ".opencode"

if (-not (Test-Path $dest)) {
    New-Item -ItemType Directory -Path $dest -Force | Out-Null
}

Copy-Item -Path "$source/*" -Destination $dest -Recurse -Force
Write-Host "✅ Configuración OpenCode simplificada instalada en .opencode/" -ForegroundColor Green

# Copiar skills esenciales
$skills = @("tdd-workflow", "security-review", "coding-standards", "backend-patterns", "frontend-patterns", "api-design")
$skillsDest = Join-Path (Get-Location) "skills"

if (-not (Test-Path $skillsDest)) {
    New-Item -ItemType Directory -Path $skillsDest -Force | Out-Null
}

foreach ($skill in $skills) {
    $srcSkill = Join-Path $PSScriptRoot "skills" $skill
    $dstSkill = Join-Path $skillsDest $skill
    if (Test-Path $srcSkill) {
        Copy-Item -Path $srcSkill -Destination $dstSkill -Recurse -Force
        Write-Host "✅ Skill copiada: $skill" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Abre OpenCode en este proyecto" -ForegroundColor Cyan
Write-Host "2. Ve a Configuración → Seleccionar modelo" -ForegroundColor Cyan
Write-Host "3. Elige Nemotron 3.5 Super VL (Gratis)" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 ¡ECC Simplificado listo para usar!" -ForegroundColor Green
