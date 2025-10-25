import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CategoryFilter from '../CategoryFilter';

describe('CategoryFilter', () => {
  const mockCategories = [
    { id: 'todos', label: 'Todas', count: 10, icon: '/icon-todas.svg' },
    { id: 'OWNED', label: 'Coleção', count: 5, icon: '/icon-colecao.svg' },
    { id: 'WISHLIST', label: 'Wishlist', count: 3, icon: '/icon-wishlist.svg' },
    { id: 'READING', label: 'Lendo', count: 2, icon: '/icon-lendo.svg' },
  ];

  it('renderiza com categorias padrão quando nenhuma categoria é fornecida', () => {
    render(<CategoryFilter />);
    
    // Verifica se as categorias padrão são renderizadas
    expect(screen.getByText(/Todas \(0\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Coleção \(0\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Wishlist \(0\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Lendo \(0\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Completos \(0\)/i)).toBeInTheDocument();
  });

  it('renderiza com categorias fornecidas via props', () => {
    render(<CategoryFilter categories={mockCategories} />);
    
    // Verifica se as categorias fornecidas são renderizadas
    expect(screen.getByText(/Todas \(10\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Coleção \(5\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Wishlist \(3\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Lendo \(2\)/i)).toBeInTheDocument();
  });

  it('renderiza todos os botões de filtro', () => {
    render(<CategoryFilter categories={mockCategories} />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(mockCategories.length);
  });

  it('aplica classe "active" ao filtro ativo', () => {
    render(<CategoryFilter activeFilter="OWNED" categories={mockCategories} />);
    
    const buttons = screen.getAllByRole('button');
    const colecaoButton = buttons[1]; // Segundo botão (Coleção)
    
    expect(colecaoButton).toHaveClass('active');
  });

  it('chama onFilterChange quando um botão é clicado', () => {
    const handleFilterChange = vi.fn();
    render(
      <CategoryFilter 
        categories={mockCategories} 
        onFilterChange={handleFilterChange}
      />
    );
    
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]); // Clica no botão Wishlist
    
    expect(handleFilterChange).toHaveBeenCalledWith('WISHLIST');
    expect(handleFilterChange).toHaveBeenCalledTimes(1);
  });

  it('renderiza ícones das categorias', () => {
    render(<CategoryFilter categories={mockCategories} />);
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(mockCategories.length);
    
    // Verifica se cada imagem tem o alt text correto
    expect(images[0]).toHaveAttribute('alt', 'Todas');
    expect(images[1]).toHaveAttribute('alt', 'Coleção');
    expect(images[2]).toHaveAttribute('alt', 'Wishlist');
    expect(images[3]).toHaveAttribute('alt', 'Lendo');
  });

  it('renderiza contadores corretos para cada categoria', () => {
    render(<CategoryFilter categories={mockCategories} />);
    
    expect(screen.getByText(/\(10\)/)).toBeInTheDocument();
    expect(screen.getByText(/\(5\)/)).toBeInTheDocument();
    expect(screen.getByText(/\(3\)/)).toBeInTheDocument();
    expect(screen.getByText(/\(2\)/)).toBeInTheDocument();
  });

  it('não quebra quando onFilterChange não é fornecido', () => {
    render(<CategoryFilter categories={mockCategories} />);
    
    const buttons = screen.getAllByRole('button');
    
    // Não deve lançar erro ao clicar sem callback
    expect(() => {
      fireEvent.click(buttons[0]);
    }).not.toThrow();
  });

  it('mantém estrutura HTML consistente', () => {
    const { container } = render(<CategoryFilter categories={mockCategories} />);
    
    // Verifica se o container principal existe
    const filterContainer = container.querySelector('.category-filter');
    expect(filterContainer).toBeInTheDocument();
    
    // Verifica se os botões têm as classes corretas
    const buttons = container.querySelectorAll('.filter-button');
    expect(buttons).toHaveLength(mockCategories.length);
  });
});
