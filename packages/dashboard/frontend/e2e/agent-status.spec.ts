import { test, expect } from '@playwright/test';

test.describe('Estado de agentes en tiempo real', () => {
  test.beforeEach(async ({ page }) => {
    // Crear un flujo primero para tener algo que monitorear
    await page.goto('/create');
    await page.getByLabel(/Descripción del proyecto/).fill('Test de agentes E2E');
    await page.getByRole('button', { name: /Iniciar flujo/ }).click();
    await expect(page).toHaveURL(/\/flow\//, { timeout: 10000 });
  });

  test('debería mostrar estados de agentes pendientes', async ({ page }) => {
    // Debería estar en la página de detalle del flujo (h1 con el título)
    await expect(page.locator('h1')).toContainText('Flujo:', { timeout: 10000 });

    // Verificar que se muestran los agentes
    await expect(page.getByText('planner').first()).toBeVisible();
    await expect(page.getByText('Pendiente').first()).toBeVisible();
  });

  test('debería mostrar indicadores visuales de estado por agente', async ({ page }) => {
    // Verificar los iconos de estado (pendiente = ⬜)
    await expect(page.getByText('⬜').first()).toBeVisible();
  });
});
