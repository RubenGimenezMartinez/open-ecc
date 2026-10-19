import { test, expect } from '@playwright/test';

test.describe('ECC Flow Manager - Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('debería cargar el dashboard y mostrar el navbar', async ({ page }) => {
    // Verificar que el enlace de la aplicación se renderiza
    await expect(page.getByRole('link', { name: /ECC Flow Manager/ })).toBeVisible();
  });

  test('debería navegar a la página de crear flujo', async ({ page }) => {
    await page.getByRole('link', { name: /Crear flujo/ }).click();
    await expect(page).toHaveURL('/create');
    await expect(page.getByRole('heading', { name: /Crear flujo/ })).toBeVisible();
  });

  test('debería navegar a la página de historial', async ({ page }) => {
    await page.getByRole('link', { name: /Historial/ }).click();
    await expect(page).toHaveURL('/history');
    await expect(page.getByRole('heading', { name: /Historial/ })).toBeVisible();
  });
});

test.describe('Crear flujo desde la web', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/create');
  });

  test('debería crear un nuevo flujo desde el formulario', async ({ page }) => {
    // Llenar el campo de descripción
    await page.getByLabel(/Descripción del proyecto/).fill(
      'Crea una aplicación de tareas con React y Node.js'
    );

    // Hacer clic en "Iniciar flujo"
    await page.getByRole('button', { name: /Iniciar flujo/ }).click();

    // Debería redirigir al detalle del flujo creado
    await expect(page).toHaveURL(/\/flow\//, { timeout: 10000 });

    // Verificar que se muestra el título del flujo (h1)
    await expect(page.locator('h1')).toContainText('Flujo:', { timeout: 10000 });
  });

  test('debería deshabilitar el botón si el campo de descripción está vacío', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Iniciar flujo/ })).toBeDisabled();
  });
});

test.describe('Historial de flujos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/history');
  });

  test('debería mostrar la página de historial', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Historial/ })).toBeVisible();
  });
});
