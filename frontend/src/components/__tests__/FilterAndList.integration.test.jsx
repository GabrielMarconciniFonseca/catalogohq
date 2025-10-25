import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { useState } from 'react';
import CategoryFilter from '../CategoryFilter';
import ItemList from '../ItemList';

/**
 * Componente wrapper para simular a integração
 * entre CategoryFilter e ItemList conforme usado em App.jsx
 */
const FilterAndListIntegration = ({ initialItems = [] }) => {
  const [activeFilter, setActiveFilter] = useState('todos');
  const [filteredItems, setFilteredItems] = useState(initialItems);

  const mockCategories = [
    { id: 'todos', label: 'Todas', count: initialItems.length, icon: '/icon-todas.svg' },
    { id: 'OWNED', label: 'Coleção', count: initialItems.filter(i => i.status === 'OWNED').length, icon: '/icon-colecao.svg' },
    { id: 'WISHLIST', label: 'Wishlist', count: initialItems.filter(i => i.status === 'WISHLIST').length, icon: '/icon-wishlist.svg' },
    { id: 'READING', label: 'Lendo', count: initialItems.filter(i => i.status === 'READING').length, icon: '/icon-lendo.svg' },
    { id: 'COMPLETED', label: 'Completos', count: initialItems.filter(i => i.status === 'COMPLETED').length, icon: '/icon-completos.svg' },
  ];

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    
    if (filterId === 'todos') {
      setFilteredItems(initialItems);
    } else {
      setFilteredItems(initialItems.filter(item => item.status === filterId));
    }
  };

  return (
    <div>
      <CategoryFilter 
        activeFilter={activeFilter}
        categories={mockCategories}
        onFilterChange={handleFilterChange}
      />
      <ItemList 
        items={filteredItems}
        onSelectItem={vi.fn()}
      />
    </div>
  );
};

// Dados mock para testes
const MOCK_ITEMS = [
  {
    id: 1,
    title: 'X-Men',
    series: 'X-Men',
    issue: 1,
    publisher: 'Marvel',
    year: 2020,
    status: 'OWNED',
    imageUrl: 'https://example.com/xmen.jpg',
    rating: 4.5,
    tags: ['superhero', 'marvel'],
  },
  {
    id: 2,
    title: 'The Sandman',
    series: 'The Sandman',
    issue: 1,
    publisher: 'Vertigo',
    year: 1989,
    status: 'OWNED',
    imageUrl: 'https://example.com/sandman.jpg',
    rating: 4.8,
    tags: ['fantasy', 'supernatural'],
  },
  {
    id: 3,
    title: 'Watchmen',
    series: 'Watchmen',
    issue: 1,
    publisher: 'DC Comics',
    year: 1986,
    status: 'WISHLIST',
    imageUrl: 'https://example.com/watchmen.jpg',
    rating: 4.9,
    tags: ['superhero', 'drama'],
  },
  {
    id: 4,
    title: 'V for Vendetta',
    series: 'V for Vendetta',
    issue: 1,
    publisher: 'DC Comics',
    year: 1989,
    status: 'READING',
    imageUrl: 'https://example.com/vendetta.jpg',
    rating: 4.7,
    tags: ['dystopian', 'action'],
  },
  {
    id: 5,
    title: 'Maus',
    series: 'Maus',
    issue: 1,
    publisher: 'Pantheon Books',
    year: 1992,
    status: 'COMPLETED',
    imageUrl: 'https://example.com/maus.jpg',
    rating: 4.9,
    tags: ['biography', 'historical'],
  },
];

describe('FilterAndList Integration Tests', () => {
  describe('Renderização inicial', () => {
    it('deve renderizar CategoryFilter e ItemList juntos', () => {
      render(<FilterAndListIntegration initialItems={MOCK_ITEMS} />);

      // Verifica se o filtro está presente
      expect(screen.getByText(/Todas \(5\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Coleção \(2\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Wishlist \(1\)/i)).toBeInTheDocument();

      // Verifica se a lista está presente
      expect(screen.getByText('X-Men')).toBeInTheDocument();
    });

    it('deve exibir contadores corretos de cada categoria', () => {
      render(<FilterAndListIntegration initialItems={MOCK_ITEMS} />);

      // 5 itens no total
      expect(screen.getByText(/Todas \(5\)/i)).toBeInTheDocument();
      // 2 na coleção (OWNED)
      expect(screen.getByText(/Coleção \(2\)/i)).toBeInTheDocument();
      // 1 na wishlist
      expect(screen.getByText(/Wishlist \(1\)/i)).toBeInTheDocument();
      // 1 lendo
      expect(screen.getByText(/Lendo \(1\)/i)).toBeInTheDocument();
      // 1 completo
      expect(screen.getByText(/Completos \(1\)/i)).toBeInTheDocument();
    });

    it('deve renderizar todos os itens por padrão', () => {
      render(<FilterAndListIntegration initialItems={MOCK_ITEMS} />);

      expect(screen.getByText('X-Men')).toBeInTheDocument();
      expect(screen.getByText('The Sandman')).toBeInTheDocument();
      expect(screen.getByText('Watchmen')).toBeInTheDocument();
      expect(screen.getByText('V for Vendetta')).toBeInTheDocument();
      expect(screen.getByText('Maus')).toBeInTheDocument();
    });
  });

  describe('Filtragem por categoria', () => {
    it('deve filtrar para Coleção e exibir apenas items OWNED', async () => {
      render(<FilterAndListIntegration initialItems={MOCK_ITEMS} />);

      const colecaoButton = screen.getByText(/Coleção \(2\)/i).closest('button');
      fireEvent.click(colecaoButton);

      // Espera a atualização da lista
      await waitFor(() => {
        expect(screen.getByText('X-Men')).toBeInTheDocument();
        expect(screen.getByText('The Sandman')).toBeInTheDocument();
      });

      // Verifica que outros itens não estão visíveis
      expect(screen.queryByText('Watchmen')).not.toBeInTheDocument();
      expect(screen.queryByText('V for Vendetta')).not.toBeInTheDocument();
      expect(screen.queryByText('Maus')).not.toBeInTheDocument();
    });

    it('deve filtrar para Wishlist e exibir apenas items WISHLIST', async () => {
      render(<FilterAndListIntegration initialItems={MOCK_ITEMS} />);

      const wishlistButton = screen.getByText(/Wishlist \(1\)/i).closest('button');
      fireEvent.click(wishlistButton);

      await waitFor(() => {
        expect(screen.getByText('Watchmen')).toBeInTheDocument();
      });

      expect(screen.queryByText('X-Men')).not.toBeInTheDocument();
      expect(screen.queryByText('The Sandman')).not.toBeInTheDocument();
      expect(screen.queryByText('V for Vendetta')).not.toBeInTheDocument();
      expect(screen.queryByText('Maus')).not.toBeInTheDocument();
    });

    it('deve filtrar para Lendo e exibir apenas items READING', async () => {
      render(<FilterAndListIntegration initialItems={MOCK_ITEMS} />);

      const lendoButton = screen.getByText(/Lendo \(1\)/i).closest('button');
      fireEvent.click(lendoButton);

      await waitFor(() => {
        expect(screen.getByText('V for Vendetta')).toBeInTheDocument();
      });

      expect(screen.queryByText('X-Men')).not.toBeInTheDocument();
      expect(screen.queryByText('Watchmen')).not.toBeInTheDocument();
    });

    it('deve filtrar para Completos e exibir apenas items COMPLETED', async () => {
      render(<FilterAndListIntegration initialItems={MOCK_ITEMS} />);

      const completosButton = screen.getByText(/Completos \(1\)/i).closest('button');
      fireEvent.click(completosButton);

      await waitFor(() => {
        expect(screen.getByText('Maus')).toBeInTheDocument();
      });

      expect(screen.queryByText('X-Men')).not.toBeInTheDocument();
      expect(screen.queryByText('The Sandman')).not.toBeInTheDocument();
    });

    it('deve voltar para Todas quando clicado no filtro Todas', async () => {
      render(<FilterAndListIntegration initialItems={MOCK_ITEMS} />);

      // Primeiro clica em Coleção
      const colecaoButton = screen.getByText(/Coleção \(2\)/i).closest('button');
      fireEvent.click(colecaoButton);

      await waitFor(() => {
        expect(screen.queryByText('Watchmen')).not.toBeInTheDocument();
      });

      // Depois clica em Todas
      const todasButton = screen.getByText(/Todas \(5\)/i).closest('button');
      fireEvent.click(todasButton);

      await waitFor(() => {
        expect(screen.getByText('X-Men')).toBeInTheDocument();
        expect(screen.getByText('Watchmen')).toBeInTheDocument();
        expect(screen.getByText('Maus')).toBeInTheDocument();
      });
    });
  });

  describe('Atualização dinâmica de contadores', () => {
    it('deve manter contadores corretos após filtros múltiplos', async () => {
      const { rerender } = render(<FilterAndListIntegration initialItems={MOCK_ITEMS} />);

      // Verificar contadores iniciais
      expect(screen.getByText(/Coleção \(2\)/i)).toBeInTheDocument();

      // Aplicar filtro
      const colecaoButton = screen.getByText(/Coleção \(2\)/i).closest('button');
      fireEvent.click(colecaoButton);

      await waitFor(() => {
        expect(screen.getByText('X-Men')).toBeInTheDocument();
      });

      // Voltar para Todas
      const todasButton = screen.getByText(/Todas \(5\)/i).closest('button');
      fireEvent.click(todasButton);

      await waitFor(() => {
        expect(screen.getByText(/Todas \(5\)/i)).toBeInTheDocument();
      });
    });
  });

  describe('Estado ativo do filtro', () => {
    it('deve aplicar classe active ao filtro selecionado', async () => {
      render(<FilterAndListIntegration initialItems={MOCK_ITEMS} />);

      const colecaoButton = screen.getByText(/Coleção \(2\)/i).closest('button');

      // Inicialmente Todas está ativa (não Coleção)
      expect(colecaoButton).not.toHaveClass('active');

      fireEvent.click(colecaoButton);

      await waitFor(() => {
        expect(colecaoButton).toHaveClass('active');
      });
    });

    it('deve remover classe active do filtro anterior', async () => {
      render(<FilterAndListIntegration initialItems={MOCK_ITEMS} />);

      const todasButton = screen.getByText(/Todas \(5\)/i).closest('button');
      const colecaoButton = screen.getByText(/Coleção \(2\)/i).closest('button');

      // Inicialmente Todas é active
      expect(todasButton).toHaveClass('active');
      expect(colecaoButton).not.toHaveClass('active');

      // Clica em Coleção
      fireEvent.click(colecaoButton);

      await waitFor(() => {
        expect(todasButton).not.toHaveClass('active');
        expect(colecaoButton).toHaveClass('active');
      });
    });
  });

  describe('Lista vazia e estados', () => {
    it('deve exibir mensagem quando nenhum item corresponde ao filtro', () => {
      const itemsWithoutWishlist = MOCK_ITEMS.filter(i => i.status !== 'WISHLIST');
      render(<FilterAndListIntegration initialItems={itemsWithoutWishlist} />);

      const wishlistButton = screen.getByText(/Wishlist \(0\)/i).closest('button');
      fireEvent.click(wishlistButton);

      expect(screen.getByText(/Nenhum item encontrado/i)).toBeInTheDocument();
    });

    it('deve exibir mensagem quando lista inicial está vazia', () => {
      render(<FilterAndListIntegration initialItems={[]} />);

      expect(screen.getByText(/Nenhum item encontrado/i)).toBeInTheDocument();
    });

    it('deve exibir contadores zerados quando não há itens', () => {
      render(<FilterAndListIntegration initialItems={[]} />);

      expect(screen.getByText(/Todas \(0\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Coleção \(0\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Wishlist \(0\)/i)).toBeInTheDocument();
    });
  });

  describe('Fluxo completo do usuário', () => {
    it('deve permitir filtrar para Coleção, depois para Lendo, depois voltar para Todas', async () => {
      render(<FilterAndListIntegration initialItems={MOCK_ITEMS} />);

      // Inicial - Todas
      expect(screen.getByText('X-Men')).toBeInTheDocument();
      expect(screen.getByText('Maus')).toBeInTheDocument();

      // 1. Ir para Coleção
      const colecaoButton = screen.getByText(/Coleção \(2\)/i).closest('button');
      fireEvent.click(colecaoButton);

      await waitFor(() => {
        expect(screen.getByText('X-Men')).toBeInTheDocument();
        expect(screen.getByText('The Sandman')).toBeInTheDocument();
        expect(screen.queryByText('Maus')).not.toBeInTheDocument();
      });

      // 2. Ir para Lendo
      const lendoButton = screen.getByText(/Lendo \(1\)/i).closest('button');
      fireEvent.click(lendoButton);

      await waitFor(() => {
        expect(screen.getByText('V for Vendetta')).toBeInTheDocument();
        expect(screen.queryByText('X-Men')).not.toBeInTheDocument();
      });

      // 3. Voltar para Todas
      const todasButton = screen.getByText(/Todas \(5\)/i).closest('button');
      fireEvent.click(todasButton);

      await waitFor(() => {
        expect(screen.getByText('X-Men')).toBeInTheDocument();
        expect(screen.getByText('Watchmen')).toBeInTheDocument();
        expect(screen.getByText('V for Vendetta')).toBeInTheDocument();
        expect(screen.getByText('The Sandman')).toBeInTheDocument();
        expect(screen.getByText('Maus')).toBeInTheDocument();
      });
    });

    it('deve manter a lista sincronizada após múltiplos cliques rápidos', async () => {
      render(<FilterAndListIntegration initialItems={MOCK_ITEMS} />);

      // Cliques rápidos
      fireEvent.click(screen.getByText(/Coleção \(2\)/i).closest('button'));
      await waitFor(() => {
        expect(screen.getByText('X-Men')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText(/Wishlist \(1\)/i).closest('button'));
      await waitFor(() => {
        expect(screen.getByText('Watchmen')).toBeInTheDocument();
        expect(screen.queryByText('X-Men')).not.toBeInTheDocument();
      });

      fireEvent.click(screen.getByText(/Todas \(5\)/i).closest('button'));
      await waitFor(() => {
        expect(screen.getByText('X-Men')).toBeInTheDocument();
        expect(screen.getByText('Watchmen')).toBeInTheDocument();
      });
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter botões com role correto para os filtros', () => {
      render(<FilterAndListIntegration initialItems={MOCK_ITEMS} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('deve ter nomes descritivos nos botões de filtro', () => {
      render(<FilterAndListIntegration initialItems={MOCK_ITEMS} />);

      expect(screen.getByText(/Todas \(5\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Coleção \(2\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Wishlist \(1\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Lendo \(1\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Completos \(1\)/i)).toBeInTheDocument();
    });
  });
});
