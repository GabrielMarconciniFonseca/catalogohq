import { test, expect } from '@playwright/test';

const FIXTURE_ITEMS = [
  {
    id: 1,
    name: 'Edição Especial',
    description: 'HQ rara com capa alternativa.',
    category: 'HQ',
    price: 59.9,
    stock: 4,
    sku: 'HQ-ESP-001',
  },
];

test.beforeEach(async ({ page }) => {
  const items = [...FIXTURE_ITEMS];

  await page.route('**/api/items', async (route) => {
    const { method } = route.request();
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(items),
      });
      return;
    }

    if (method === 'POST') {
      const payload = JSON.parse(route.request().postData() ?? '{}');
      const newItem = { id: Date.now(), ...payload };
      items.unshift(newItem);
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(newItem),
      });
      return;
    }

    await route.fallback();
  });

  await page.route('**/api/items/*', async (route) => {
    const id = Number(route.request().url().split('/').pop());
    const item = items.find((entry) => entry.id === id);
    if (item) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(item) });
      return;
    }

    await route.fulfill({ status: 404, body: JSON.stringify({ message: 'Not found' }) });
  });

  await page.goto('/');
});

test('lista itens, exibe detalhes e cadastra novo item', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/catálogo hq/i);
  await expect(page.getByRole('button', { name: /edição especial/i })).toBeVisible();

  await page.getByRole('button', { name: /edição especial/i }).click();
  await expect(page.getByRole('heading', { level: 2 })).toHaveText(/edição especial/i);

  await page.getByLabel('Nome*').fill('Novo lançamento');
  await page.getByLabel('Categoria').selectOption('HQ');
  await page.getByLabel('Descrição').fill('Conteúdo exclusivo.');
  await page.getByRole('button', { name: /salvar item/i }).click();

  await expect(page.getByText(/item cadastrado com sucesso/i)).toBeVisible();
});
