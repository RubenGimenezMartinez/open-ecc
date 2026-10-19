import { test, expect } from '@playwright/test';

test.describe('ECC Flow Manager — Ejecutar flujo desde la web', () => {
  test('debería crear un flujo, navegar al detalle y ejecutarlo viendo los estados de los agentes', async ({ page }) => {
    // 1. Ir a la página de crear flujo
    await page.goto('/create');

    // 2. Llenar la descripción y enviar
    await page.getByLabel(/Descripción del proyecto/).fill('Flujo de prueba E2E');
    await page.getByRole('button', { name: /Iniciar flujo/ }).click();

    // 3. Debería navegar a la página de detalle del flujo
    await expect(page).toHaveURL(/\/flow\//, { timeout: 10000 });

    // 4. Verificar que estamos en la página de detalle
    await expect(page.locator('h1')).toContainText('Flujo:', { timeout: 10000 });

    // 5. Hacer clic en "Ejecutar flujo"
    await page.getByRole('button', { name: /Ejecutar flujo/ }).click();

    // 6. El estado del flujo debería cambiar a "Ejecutando"
    await expect(page.getByText('Ejecutando')).toBeVisible({ timeout: 10000 });

    // 7. Los agentes deberían mostrar estados de ejecución
    // El planner debería ser el primero en ejecutarse (primer span con el nombre del agente)
    await expect(page.getByText('planner').first()).toBeVisible();

    // Esperar a que al menos un agente pase a "Ejecutando"
    await expect(page.getByText('Ejecutando').first()).toBeVisible({ timeout: 15000 });

    // 8. Verificar que los logs se muestren (al menos un log de "Iniciando ejecución")
    await expect(page.getByText(/Iniciando ejecución/)).toBeVisible({ timeout: 10000 });
  });
});
