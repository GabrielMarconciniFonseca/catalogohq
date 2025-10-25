import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ComicCard from '../ComicCard';
import { COMIC_STATUS } from '../../constants/comicStatus';

describe('ComicCard', () => {
  const mockOnSelect = vi.fn();

  // Item base para testes
  const baseItem = {
    id: 1,
    title: 'Homem-Aranha',
    series: 'Amazing Spider-Man',
    issue: 1,
    publisher: 'Marvel',
    year: 2023,
    status: COMIC_STATUS.OWNED,
    imageUrl: '/uploads/spiderman.jpg',
    rating: 4.5,
    tags: ['Ação', 'Super-Herói', 'Marvel'],
    purchaseDate: '2023-01-15',
    addedDate: '2023-01-10',
  };

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  describe('Snapshot Tests', () => {
    it('renderiza snapshot com status OWNED', () => {
      const { container } = render(
        <ComicCard item={{ ...baseItem, status: COMIC_STATUS.OWNED }} onSelect={mockOnSelect} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renderiza snapshot com status READING', () => {
      const { container } = render(
        <ComicCard item={{ ...baseItem, status: COMIC_STATUS.READING }} onSelect={mockOnSelect} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renderiza snapshot com status WISHLIST', () => {
      const { container } = render(
        <ComicCard item={{ ...baseItem, status: COMIC_STATUS.WISHLIST }} onSelect={mockOnSelect} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renderiza snapshot com status COMPLETED', () => {
      const { container } = render(
        <ComicCard item={{ ...baseItem, status: COMIC_STATUS.COMPLETED }} onSelect={mockOnSelect} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renderiza snapshot sem imagem', () => {
      const { container } = render(
        <ComicCard 
          item={{ ...baseItem, imageUrl: null }} 
          onSelect={mockOnSelect} 
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renderiza snapshot sem tags', () => {
      const { container } = render(
        <ComicCard 
          item={{ ...baseItem, tags: [] }} 
          onSelect={mockOnSelect} 
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renderiza snapshot sem rating', () => {
      const { container } = render(
        <ComicCard 
          item={{ ...baseItem, rating: 0 }} 
          onSelect={mockOnSelect} 
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renderiza snapshot com dados mínimos', () => {
      const minimalItem = {
        id: 1,
        title: 'HQ Teste',
        status: COMIC_STATUS.OWNED,
      };
      const { container } = render(
        <ComicCard item={minimalItem} onSelect={mockOnSelect} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Renderização com diferentes status', () => {
    it('renderiza corretamente com status OWNED', () => {
      render(
        <ComicCard 
          item={{ ...baseItem, status: COMIC_STATUS.OWNED }} 
          onSelect={mockOnSelect} 
        />
      );
      
      expect(screen.getByText('Homem-Aranha')).toBeInTheDocument();
      expect(screen.getByText('Amazing Spider-Man • #1')).toBeInTheDocument();
      const badge = document.querySelector('.card-badge--owned');
      expect(badge).toBeInTheDocument();
    });

    it('renderiza corretamente com status READING', () => {
      render(
        <ComicCard 
          item={{ ...baseItem, status: COMIC_STATUS.READING }} 
          onSelect={mockOnSelect} 
        />
      );
      
      const badge = document.querySelector('.card-badge--reading');
      expect(badge).toBeInTheDocument();
    });

    it('renderiza corretamente com status WISHLIST', () => {
      render(
        <ComicCard 
          item={{ ...baseItem, status: COMIC_STATUS.WISHLIST }} 
          onSelect={mockOnSelect} 
        />
      );
      
      const badge = document.querySelector('.card-badge--wishlist');
      expect(badge).toBeInTheDocument();
    });

    it('renderiza corretamente com status COMPLETED', () => {
      render(
        <ComicCard 
          item={{ ...baseItem, status: COMIC_STATUS.COMPLETED }} 
          onSelect={mockOnSelect} 
        />
      );
      
      const badge = document.querySelector('.card-badge--completed');
      expect(badge).toBeInTheDocument();
    });

    it('renderiza sem status (undefined)', () => {
      render(
        <ComicCard 
          item={{ ...baseItem, status: undefined }} 
          onSelect={mockOnSelect} 
        />
      );
      
      expect(screen.getByText('Homem-Aranha')).toBeInTheDocument();
    });
  });

  describe('Renderização de conteúdo', () => {
    it('renderiza título corretamente', () => {
      render(<ComicCard item={baseItem} onSelect={mockOnSelect} />);
      expect(screen.getByText('Homem-Aranha')).toBeInTheDocument();
    });

    it('renderiza subtítulo com série e issue', () => {
      render(<ComicCard item={baseItem} onSelect={mockOnSelect} />);
      expect(screen.getByText('Amazing Spider-Man • #1')).toBeInTheDocument();
    });

    it('renderiza subtítulo apenas com issue quando não tem série', () => {
      const itemWithoutSeries = { ...baseItem, series: null };
      render(<ComicCard item={itemWithoutSeries} onSelect={mockOnSelect} />);
      expect(screen.getByText('#1')).toBeInTheDocument();
    });

    it('renderiza publisher corretamente', () => {
      render(<ComicCard item={baseItem} onSelect={mockOnSelect} />);
      expect(screen.getByText('Marvel')).toBeInTheDocument();
    });

    it('renderiza "Editora desconhecida" quando publisher não existe', () => {
      const itemWithoutPublisher = { ...baseItem, publisher: null };
      render(<ComicCard item={itemWithoutPublisher} onSelect={mockOnSelect} />);
      expect(screen.getByText('Editora desconhecida')).toBeInTheDocument();
    });

    it('renderiza ano corretamente', () => {
      render(<ComicCard item={baseItem} onSelect={mockOnSelect} />);
      expect(screen.getByText('2023')).toBeInTheDocument();
    });

    it('renderiza rating corretamente', () => {
      render(<ComicCard item={baseItem} onSelect={mockOnSelect} />);
      // Rating de 4.5 deve estar presente
      const rating = document.querySelector('.card-rating');
      expect(rating).toBeInTheDocument();
    });

    it('renderiza tags corretamente', () => {
      render(<ComicCard item={baseItem} onSelect={mockOnSelect} />);
      expect(screen.getByText('#Ação')).toBeInTheDocument();
      expect(screen.getByText('#Super-Herói')).toBeInTheDocument();
      expect(screen.getByText('#Marvel')).toBeInTheDocument();
    });
  });

  describe('Renderização de imagens', () => {
    it('renderiza imagem quando imageUrl existe', () => {
      render(<ComicCard item={baseItem} onSelect={mockOnSelect} />);
      const img = screen.getByAltText('Capa de Homem-Aranha');
      expect(img).toBeInTheDocument();
    });

    it('renderiza placeholder quando imageUrl não existe', () => {
      const itemWithoutImage = { ...baseItem, imageUrl: null };
      render(<ComicCard item={itemWithoutImage} onSelect={mockOnSelect} />);
      expect(screen.getByText('Sem imagem disponível')).toBeInTheDocument();
    });

    it('renderiza skeleton antes da imagem carregar', () => {
      render(<ComicCard item={baseItem} onSelect={mockOnSelect} />);
      const skeleton = document.querySelector('.comic-card__image-skeleton');
      expect(skeleton).toBeInTheDocument();
    });

    it('remove skeleton após imagem carregar', async () => {
      render(<ComicCard item={baseItem} onSelect={mockOnSelect} />);
      
      const img = screen.getByAltText('Capa de Homem-Aranha');
      fireEvent.load(img);
      
      await waitFor(() => {
        expect(img).toHaveClass('loaded');
      });
    });

    it('renderiza mensagem de erro quando imagem falha ao carregar', async () => {
      render(<ComicCard item={baseItem} onSelect={mockOnSelect} />);
      
      const img = screen.getByAltText('Capa de Homem-Aranha');
      fireEvent.error(img);
      
      await waitFor(() => {
        expect(screen.getByText('Erro ao carregar imagem')).toBeInTheDocument();
      });
    });
  });

  describe('Overlay de data', () => {
    it('renderiza overlay com data de compra', () => {
      render(<ComicCard item={baseItem} onSelect={mockOnSelect} />);
      // Data formatada para pt-BR
      const dateElement = screen.getByText(/\d{2}\/\d{2}\/2023/);
      expect(dateElement).toBeInTheDocument();
    });

    it('renderiza overlay com data de adição quando purchaseDate não existe', () => {
      const itemWithoutPurchaseDate = { 
        ...baseItem, 
        purchaseDate: null,
        addedDate: '2023-01-10'
      };
      render(<ComicCard item={itemWithoutPurchaseDate} onSelect={mockOnSelect} />);
      // Verifica que existe uma data formatada em pt-BR
      const dateElement = screen.getByText(/\d{2}\/\d{2}\/2023/);
      expect(dateElement).toBeInTheDocument();
    });

    it('não renderiza overlay quando não há datas', () => {
      const itemWithoutDates = { 
        ...baseItem, 
        purchaseDate: null,
        addedDate: null
      };
      render(<ComicCard item={itemWithoutDates} onSelect={mockOnSelect} />);
      const overlay = document.querySelector('.comic-card__overlay');
      expect(overlay).not.toBeInTheDocument();
    });
  });

  describe('Interações', () => {
    it('chama onSelect ao clicar no card', () => {
      render(<ComicCard item={baseItem} onSelect={mockOnSelect} />);
      
      const card = screen.getByRole('button', { name: /Ver detalhes de Homem-Aranha/ });
      fireEvent.click(card);
      
      expect(mockOnSelect).toHaveBeenCalledWith(1);
      expect(mockOnSelect).toHaveBeenCalledTimes(1);
    });

    it('chama onSelect ao pressionar Enter', () => {
      render(<ComicCard item={baseItem} onSelect={mockOnSelect} />);
      
      const card = screen.getByRole('button', { name: /Ver detalhes de Homem-Aranha/ });
      fireEvent.keyPress(card, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      expect(mockOnSelect).toHaveBeenCalledWith(1);
    });

    it('não chama onSelect ao pressionar outras teclas', () => {
      render(<ComicCard item={baseItem} onSelect={mockOnSelect} />);
      
      const card = screen.getByRole('button', { name: /Ver detalhes de Homem-Aranha/ });
      fireEvent.keyPress(card, { key: 'Space', code: 'Space', charCode: 32 });
      
      expect(mockOnSelect).not.toHaveBeenCalled();
    });

    it('card é acessível via teclado (tabIndex=0)', () => {
      render(<ComicCard item={baseItem} onSelect={mockOnSelect} />);
      
      const card = screen.getByRole('button', { name: /Ver detalhes de Homem-Aranha/ });
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('card tem role="button" para acessibilidade', () => {
      render(<ComicCard item={baseItem} onSelect={mockOnSelect} />);
      
      const card = screen.getByRole('button', { name: /Ver detalhes de Homem-Aranha/ });
      expect(card).toBeInTheDocument();
    });

    it('card tem aria-label descritivo', () => {
      render(<ComicCard item={baseItem} onSelect={mockOnSelect} />);
      
      const card = screen.getByRole('button', { name: /Ver detalhes de Homem-Aranha/ });
      expect(card).toHaveAttribute('aria-label', 'Ver detalhes de Homem-Aranha');
    });
  });

  describe('Edge cases', () => {
    it('renderiza corretamente com issue como string', () => {
      const itemWithStringIssue = { ...baseItem, issue: 'Special' };
      render(<ComicCard item={itemWithStringIssue} onSelect={mockOnSelect} />);
      expect(screen.getByText('Amazing Spider-Man • #Special')).toBeInTheDocument();
    });

    it('renderiza corretamente com year como string', () => {
      const itemWithStringYear = { ...baseItem, year: '2023' };
      render(<ComicCard item={itemWithStringYear} onSelect={mockOnSelect} />);
      expect(screen.getByText('2023')).toBeInTheDocument();
    });

    it('renderiza corretamente com id como string', () => {
      const itemWithStringId = { ...baseItem, id: 'comic-123' };
      render(<ComicCard item={itemWithStringId} onSelect={mockOnSelect} />);
      
      const card = screen.getByRole('button', { name: /Ver detalhes de Homem-Aranha/ });
      fireEvent.click(card);
      
      expect(mockOnSelect).toHaveBeenCalledWith('comic-123');
    });

    it('renderiza corretamente com rating como 0', () => {
      const itemWithZeroRating = { ...baseItem, rating: 0 };
      render(<ComicCard item={itemWithZeroRating} onSelect={mockOnSelect} />);
      
      const rating = document.querySelector('.card-rating');
      expect(rating).toBeInTheDocument();
    });

    it('renderiza corretamente com array de tags vazio', () => {
      const itemWithEmptyTags = { ...baseItem, tags: [] };
      render(<ComicCard item={itemWithEmptyTags} onSelect={mockOnSelect} />);
      
      expect(screen.getByText('Homem-Aranha')).toBeInTheDocument();
    });

    it('renderiza corretamente com tags undefined', () => {
      const itemWithUndefinedTags = { ...baseItem, tags: undefined };
      render(<ComicCard item={itemWithUndefinedTags} onSelect={mockOnSelect} />);
      
      expect(screen.getByText('Homem-Aranha')).toBeInTheDocument();
    });

    it('usa ano atual quando year não existe', () => {
      const itemWithoutYear = { ...baseItem, year: null };
      const currentYear = new Date().getFullYear();
      
      render(<ComicCard item={itemWithoutYear} onSelect={mockOnSelect} />);
      expect(screen.getByText(currentYear.toString())).toBeInTheDocument();
    });

    it('renderiza com série sem issue', () => {
      const itemWithoutIssue = { ...baseItem, issue: null };
      render(<ComicCard item={itemWithoutIssue} onSelect={mockOnSelect} />);
      expect(screen.getByText('Amazing Spider-Man • #1')).toBeInTheDocument();
    });
  });

  describe('Estrutura CSS e classes', () => {
    it('aplica classe principal comic-card', () => {
      const { container } = render(<ComicCard item={baseItem} onSelect={mockOnSelect} />);
      expect(container.querySelector('.comic-card')).toBeInTheDocument();
    });

    it('aplica classes de container de imagem', () => {
      const { container } = render(<ComicCard item={baseItem} onSelect={mockOnSelect} />);
      expect(container.querySelector('.comic-card__image-container')).toBeInTheDocument();
      expect(container.querySelector('.comic-card__image')).toBeInTheDocument();
    });

    it('aplica classes de conteúdo', () => {
      const { container } = render(<ComicCard item={baseItem} onSelect={mockOnSelect} />);
      expect(container.querySelector('.comic-card__content')).toBeInTheDocument();
      expect(container.querySelector('.comic-card__header')).toBeInTheDocument();
      expect(container.querySelector('.comic-card__info')).toBeInTheDocument();
    });

    it('aplica classe loaded na imagem após carregamento', async () => {
      render(<ComicCard item={baseItem} onSelect={mockOnSelect} />);
      
      const img = screen.getByAltText('Capa de Homem-Aranha');
      fireEvent.load(img);
      
      await waitFor(() => {
        expect(img).toHaveClass('comic-card__image-element');
        expect(img).toHaveClass('loaded');
      });
    });
  });

  describe('Variações de layout para todos os status', () => {
    const statuses = [
      { status: COMIC_STATUS.OWNED, label: 'OWNED' },
      { status: COMIC_STATUS.READING, label: 'READING' },
      { status: COMIC_STATUS.WISHLIST, label: 'WISHLIST' },
      { status: COMIC_STATUS.COMPLETED, label: 'COMPLETED' },
    ];

    statuses.forEach(({ status, label }) => {
      it(`mantém estrutura consistente com status ${label}`, () => {
        const { container } = render(
          <ComicCard item={{ ...baseItem, status }} onSelect={mockOnSelect} />
        );

        // Verifica elementos principais
        expect(container.querySelector('.comic-card')).toBeInTheDocument();
        expect(container.querySelector('.comic-card__image-container')).toBeInTheDocument();
        expect(container.querySelector('.comic-card__content')).toBeInTheDocument();
        
        // Verifica conteúdo
        expect(screen.getByText('Homem-Aranha')).toBeInTheDocument();
        expect(screen.getByText('Amazing Spider-Man • #1')).toBeInTheDocument();
        expect(screen.getByText('Marvel')).toBeInTheDocument();
        expect(screen.getByText('2023')).toBeInTheDocument();
      });

      it(`renderiza badge correto para status ${label}`, () => {
        const { container } = render(
          <ComicCard item={{ ...baseItem, status }} onSelect={mockOnSelect} />
        );

        const badge = container.querySelector(`.card-badge--${status.toLowerCase()}`);
        expect(badge).toBeInTheDocument();
      });
    });
  });
});
