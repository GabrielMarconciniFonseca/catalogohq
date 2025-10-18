import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ItemForm from '../ItemForm.jsx';

describe('ItemForm', () => {
  it('envia dados preenchidos', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue({});
    render(<ItemForm categories={['todos', 'HQ']} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/nome/i), 'Novo item');
    await user.selectOptions(screen.getByLabelText(/categoria/i), 'HQ');
    await user.type(screen.getByLabelText(/preço/i), '12');
    await user.type(screen.getByLabelText(/estoque/i), '5');
    await user.type(screen.getByLabelText(/descrição/i), 'Descrição teste');

    await user.click(screen.getByRole('button', { name: /salvar item/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Novo item',
      category: 'HQ',
      price: 12,
      stock: 5,
      sku: null,
      description: 'Descrição teste',
    });
  });
});
