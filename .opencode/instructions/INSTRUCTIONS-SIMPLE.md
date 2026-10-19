# ECC Simplificado - Instrucciones Core (Modelos Gratuitos)

Este documento consolida las reglas esenciales de ECC para OpenCode, configurado para usar **solo modelos gratuitos** proporcionados por OpenCode.

## Modelo Recomendado (Gratuito)

**Nemotron 3.5 Super VL** (seleccionado por defecto en tu OpenCode)

Otros modelos gratuitos disponibles en tu instancia:
- Beam
- LongCat 2.5 Preview
- Space Bunny
- MiMo-V2.6-Flash
- DeepSeek V4.1 Flash
- GLM-5.3-Flash
- Nemotron 3.5 Lightning
- Nemotron 3 Ultra
- Big Pickle

Selecciona cualquiera de estos desde el menú "Seleccionar modelo" de OpenCode. No se requiere API key ni tarjeta de crédito.

## Reglas de Seguridad (CRÍTICAS)

Antes de **cualquier commit**:

- [ ] No hay secretos hardcodeados (API keys, contraseñas, tokens)
- [ ] Toda entrada de usuario validada
- [ ] Prevención de inyección SQL (consultas parametrizadas)
- [ ] Prevención de XSS (HTML sanetizado)
- [ ] CSRF habilitado
- [ ] Autenticación/autorización verificadas
- [ ] Rate limiting en todos los endpoints
- [ ] Los mensajes de error no filtran datos sensibles

### Gestión de Secretos

```typescript
// NUNCA: Secretos hardcodeados
const apiKey = "sk-proj-xxxxx"

// SIEMPRE: Variables de entorno
const apiKey = process.env.NEMOTRON_API_KEY ?? process.env.OPENCODE_API_KEY

if (!apiKey) {
  throw new Error('API key no configurada')
}
```

Si encuentras un problema de seguridad:
1. DETÉNTE inmediatamente
2. Usa el agente **security-reviewer**
3. Corrige problemas CRÍTICOS antes de continuar
4. Rota cualquier secreto expuesto
5. Revisa todo el código por problemas similares

## Estilo de Código

### Inmutabilidad (CRÍTICA)

SIEMPRE crear nuevos objetos, NUNCA mutar:

```javascript
// MAL: Mutación
function updateUser(user, name) {
  user.name = name  // ¡MUTACIÓN!
  return user
}

// BIEN: Inmutabilidad
function updateUser(user, name) {
  return {
    ...user,
    name
  }
}
```

### Organización de Archivos

MUCHOS ARCHIVOS PEQUEÑOS > POCOS ARCHIVOS GRANDES:
- Alta cohesión, bajo acoplamiento
- 200-400 líneas típico, 800 máximo
- Extraer utilidades de componentes grandes
- Organizar por característica/dominio, no por tipo

### Manejo de Errores

SIEMPRE manejar errores de forma exhaustiva:

```typescript
try {
  const result = await operacionRiesgosa()
  return result
} catch (error) {
  console.error('Operación falló:', error)
  throw new Error('Mensaje detallado y amigable para el usuario')
}
```

### Validación de Entrada

SIEMPRE validar la entrada del usuario:

```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  edad: z.number().int().min(0).max(150)
})

const validado = schema.parse(entrada)
```

### Lista de Calidad de Código

Antes de marcar trabajo como completo:
- [ ] Código legible y bien nombrado
- [ ] Funciones pequeñas (<50 líneas)
- [ ] Archivos enfocados (<800 líneas)
- [ ] Sin anidación profunda (>4 niveles)
- [ ] Manejo de errores adecuado
- [ ] Sin sentencias console.log
- [ ] Sin valores hardcodeados
- [ ] Sin mutación (usar patrones inmutables)

## Requisitos de Pruebas

### Cobertura Mínima: 80%

Tipos de pruebas (TODOS requeridos):
1. **Pruebas Unitarias** - Funciones, utilidades, componentes individuales
2. **Pruebas de Integración** - Endpoints de API, operaciones de base de datos
3. **Pruebas E2E** - Flujos críticos de usuario (Playwright)

### Desarrollo Dirigido por Pruebas (TDD)

Flujo OBLIGATORIO:
1. Escribir prueba primero (ROJO) - la prueba debe FALLAR
2. Ejecutar prueba - debe fallar
3. Escribir implementación mínima (VERDE) - la prueba debe PASAR
4. Ejecutar prueba - debe pasar
5. Refactorizar (MEJORAR)
6. Verificar cobertura (80%+)

## Flujo de Git

### Formato de Commit

```
<tipo>: <descripción>

<cuerpo opcional>
```

Tipos: feat, fix, refactor, docs, test, chore, perf, ci

### Flujo de Pull Request

Al crear PRs:
1. Analizar el historial completo de commits
2. Usar `git diff [rama-base]...HEAD` para ver todos los cambios
3. Redactar un resumen completo del PR
4. Incluir plan de pruebas
5. Push con `-u` si es rama nueva

## Flujo de Implementación de Características

1. **Plan Primero**
   - Usar agente **planner** para crear plan de implementación
   - Identificar dependencias y riesgos
   - Desglosar en fases

2. **Enfoque TDD**
   - Usar agente **tdd-guide**
   - Escribir pruebas primero (ROJO)
   - Implementar para pasar pruebas (VERDE)
   - Refactorizar (MEJORAR)
   - Verificar cobertura 80%+

3. **Revisión de Código**
   - Usar agente **code-reviewer** inmediatamente después de escribir código
   - Abordar problemas CRÍTICOS y ALTOS
   - Corregir MEDIANOS cuando sea posible

4. **Commit y Push**
   - Mensajes de commit detallados
   - Seguir formato de commits convencionales

## Orquestación de Agentes

Usar agentes proactivamente sin que el usuario lo pida:

- Solicitudes de características complejas → **planner**
- Código recién escrito/modificado → **code-reviewer**
- Corrección de bugs o nueva característica → **tdd-guide**
- Decisión arquitectónica → **architect**
- Código sensible a seguridad → **security-reviewer**
- Errores de build → **build-error-resolver**
- Pruebas E2E críticas → **e2e-runner**

## Comandos Disponibles

Usar estos comandos en OpenCode:

| Comando | Descripción |
|---------|-------------|
| `/plan` | Crear plan de implementación |
| `/tdd` | Aplicar flujo TDD |
| `/code-review` | Revisar cambios de código |
| `/security` | Ejecutar revisión de seguridad |
| `/build-fix` | Corregir errores de build |
| `/e2e` | Generar pruebas E2E |
| `/refactor-clean` | Eliminar código muerto |

## Métricas de Éxito

Tienes éxito cuando:
- Todas las pruebas pasan (80%+ cobertura)
- No hay vulnerabilidades de seguridad
- El código es legible y mantenible
- El rendimiento es aceptable
- Se cumplen los requisitos del usuario

## Configuración de Modelos Gratuitos

No se requiere configuración adicional. OpenCode proporciona los modelos gratuitos automáticamente. Simplemente selecciona **Nemotron 3.5 Super VL** (o cualquier otro modelo gratuito) desde el selector de modelo en la interfaz de OpenCode.
