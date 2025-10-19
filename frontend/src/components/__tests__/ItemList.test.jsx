import { render, screen, fireEvent } from '@testing-library/react';
import ItemList from '../ItemList';

const ITEMS = [
  { id: 1, name: 'Item A', description: 'Primeiro item', category: 'HQ' },
  { id: 2, name: 'Item B', description: 'Segundo item', category: 'Livro' },
];

describe('ItemList', () => {
  it('exibe itens e permite seleção', () => {
    const handleSelect = vi.fn();
    render(<ItemList items={ITEMS} onSelectItem={handleSelect} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);

    fireEvent.click(buttons[0]);
    expect(handleSelect).toHaveBeenCalledWith(1);
  });

  it('exibe placeholder quando vazio', () => {
    render(<ItemList items={[]} onSelectItem={vi.fn()} />);

    expect(screen.getByText(/nenhum item encontrado/i)).toBeInTheDocument();
  });
});
