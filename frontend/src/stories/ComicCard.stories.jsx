import ComicCard from '../components/ComicCard';
import { COMIC_STATUS } from '../constants/comicStatus';

export default {
  title: 'Componentes/ComicCard',
  component: ComicCard,
  tags: ['autodocs'],
  argTypes: {
    onSelect: { action: 'selecionado' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Card de HQ com informações completas: imagem, título, série, editora, ano, rating e tags. Suporta múltiplos estados de status (Owned, Reading, Wishlist, Completed).',
      },
    },
  },
};

const baseItem = {
  id: 1,
  title: 'Homem-Aranha',
  series: 'Amazing Spider-Man',
  issue: 1,
  publisher: 'Marvel',
  year: 2023,
  imageUrl: '/uploads/spiderman.jpg',
  rating: 4.5,
  tags: ['Ação', 'Super-Herói', 'Marvel'],
  purchaseDate: '2023-01-15',
  addedDate: '2023-01-10',
};

/**
 * Estado padrão: HQ na coleção (OWNED)
 */
export const Owned = {
  args: {
    item: { ...baseItem, status: COMIC_STATUS.OWNED },
    onSelect: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Card com status "Na Coleção" (OWNED). Badge azul indicando que a HQ está na coleção do usuário.',
      },
    },
  },
};

/**
 * Estado: HQ que está sendo lida (READING)
 */
export const Reading = {
  args: {
    item: { ...baseItem, status: COMIC_STATUS.READING },
    onSelect: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Card com status "Lendo" (READING). Badge amarelo indicando que a HQ está sendo lida atualmente.',
      },
    },
  },
};

/**
 * Estado: HQ em lista de desejos (WISHLIST)
 */
export const Wishlist = {
  args: {
    item: { ...baseItem, status: COMIC_STATUS.WISHLIST },
    onSelect: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Card com status "Wishlist" (WISHLIST). Badge vermelho indicando que a HQ está na lista de desejos.',
      },
    },
  },
};

/**
 * Estado: HQ completa/finalizada (COMPLETED)
 */
export const Completed = {
  args: {
    item: { ...baseItem, status: COMIC_STATUS.COMPLETED },
    onSelect: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Card com status "Completo" (COMPLETED). Badge verde indicando que a HQ foi lida completamente.',
      },
    },
  },
};

/**
 * Variação: Sem imagem disponível
 */
export const SemImagem = {
  args: {
    item: { ...baseItem, imageUrl: null, status: COMIC_STATUS.OWNED },
    onSelect: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Card com placeholder quando a imagem não está disponível. Exibe ícone de imagem e mensagem "Sem imagem disponível".',
      },
    },
  },
};

/**
 * Variação: Sem tags
 */
export const SemTags = {
  args: {
    item: { ...baseItem, tags: [], status: COMIC_STATUS.OWNED },
    onSelect: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Card sem tags. A seção de tags não é renderizada quando não há tags.',
      },
    },
  },
};

/**
 * Variação: Sem rating
 */
export const SemRating = {
  args: {
    item: { ...baseItem, rating: 0, status: COMIC_STATUS.OWNED },
    onSelect: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Card com rating zerado. As estrelas não são preenchidas quando não há avaliação.',
      },
    },
  },
};

/**
 * Variação: Dados mínimos
 */
export const DadosMinimos = {
  args: {
    item: { id: 2, title: 'HQ Teste', status: COMIC_STATUS.OWNED },
    onSelect: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Card com dados mínimos. Apenas título e ID obrigatórios. Outros campos recebem valores padrão.',
      },
    },
  },
};

/**
 * Variação: Com muitas tags
 */
export const ComMuitasTags = {
  args: {
    item: {
      ...baseItem,
      tags: ['Ação', 'Super-Herói', 'Marvel', 'Clássico', 'Adaptação', 'Origem'],
      status: COMIC_STATUS.OWNED,
    },
    onSelect: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Card com várias tags. O componente limita a exibição a 3 tags, mostrando um indicador se há mais.',
      },
    },
  },
};

/**
 * Variação: Rating máximo
 */
export const RatingMaximo = {
  args: {
    item: { ...baseItem, rating: 5, status: COMIC_STATUS.COMPLETED },
    onSelect: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Card com rating máximo (5 estrelas). Todas as estrelas são preenchidas em amarelo.',
      },
    },
  },
};

/**
 * Variação: Sem série (apenas issue)
 */
export const SemSerie = {
  args: {
    item: { ...baseItem, series: null, issue: 42, status: COMIC_STATUS.READING },
    onSelect: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Card sem série, apenas com número da edição. Útil para HQs avulsas ou one-shots.',
      },
    },
  },
};

/**
 * Variação: Sem data de compra
 */
export const SemDataCompra = {
  args: {
    item: { ...baseItem, purchaseDate: null, status: COMIC_STATUS.WISHLIST },
    onSelect: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Card sem data de compra. O overlay de data não é exibido quando não há data de compra ou adição.',
      },
    },
  },
};

/**
 * Variação: Editora desconhecida
 */
export const EditoraDesconhecida = {
  args: {
    item: { ...baseItem, publisher: null, status: COMIC_STATUS.OWNED },
    onSelect: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Card com editora desconhecida. Exibe "Editora desconhecida" quando a editora não é fornecida.',
      },
    },
  },
};

