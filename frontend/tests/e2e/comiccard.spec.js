import { test, expect } from '@playwright/test';

// Exemplo de teste visual básico para ComicCard

test('ComicCard - visualização básica', async ({ page }) => {
  await page.goto('http://localhost:5173'); // ajuste a URL se necessário
  // Espera pelo menos um card na tela
  await expect(page.locator('.comic-card')).toBeVisible();
});
