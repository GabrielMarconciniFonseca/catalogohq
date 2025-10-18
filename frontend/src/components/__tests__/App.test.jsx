import { render, screen, waitFor } from '@testing-library/react';
import App from '../../App.jsx';

vi.mock('../../services/api.js', () => ({
  fetchItems: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: 'Item exemplo',
      description: 'Descrição do item',
      category: 'HQ',
    },
  ]),
  fetchItemById: vi.fn().mockResolvedValue({
    id: 1,
    name: 'Item exemplo',
    description: 'Descrição do item',
    category: 'HQ',
  }),
  createItem: vi.fn().mockImplementation(async (payload) => ({
    id: Date.now(),
    ...payload,
  })),
}));

describe('App', () => {
  it('carrega e exibe itens', async () => {
    render(<App />);

    expect(screen.getByText(/carregando itens/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /item exemplo/i })).toBeInTheDocument();
    });
  });
});
