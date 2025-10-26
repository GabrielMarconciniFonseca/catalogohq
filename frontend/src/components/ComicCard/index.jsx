import PropTypes from 'prop-types';
import { useState, memo, useMemo, useCallback } from 'react';
import CardBadge from './CardBadge';
import CardRating from './CardRating';
import CardTags from './CardTags';
import ItemStatusMenu from '../ItemStatusMenu';
import { buildAssetUrl } from '../../services/api.js';
import './ComicCard.css';

/**
 * Ícone placeholder para imagem sem src
 */
const ImagePlaceholderIcon = memo(() => (
  <svg 
    width="88" 
    height="88" 
    viewBox="0 0 88 88" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="comic-card__placeholder-icon"
  >
    <rect width="88" height="88" rx="8" fill="#E5E7EB" />
    <path 
      d="M44 32C47.866 32 51 35.134 51 39C51 42.866 47.866 46 44 46C40.134 46 37 42.866 37 39C37 35.134 40.134 32 44 32Z" 
      fill="#9CA3AF"
    />
    <path 
      d="M32 56L38.5 48L44 54.5L51.5 45L56 52V56H32Z" 
      fill="#9CA3AF"
    />
    <path 
      d="M28 24C28 21.7909 29.7909 20 32 20H56C58.2091 20 60 21.7909 60 24V64C60 66.2091 58.2091 68 56 68H32C29.7909 68 28 66.2091 28 64V24Z" 
      stroke="#9CA3AF" 
      strokeWidth="2"
    />
  </svg>
));

ImagePlaceholderIcon.displayName = 'ImagePlaceholderIcon';

/**
 * Ícone de calendário para o overlay de data
 */
const CalendarIcon = memo(() => (
  <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="2" y1="0.5" x2="2" y2="1.5" stroke="white" strokeWidth="0.5" strokeLinecap="round" />
    <line x1="4" y1="0.5" x2="4" y2="1.5" stroke="white" strokeWidth="0.5" strokeLinecap="round" />
    <rect x="0.75" y="1" width="4.5" height="4.5" rx="0.5" stroke="white" strokeWidth="0.5" />
    <line x="0.75" y="2.5" x2="5.25" y2="2.5" stroke="white" strokeWidth="0.5" />
  </svg>
));

CalendarIcon.displayName = 'CalendarIcon';

/**
 * Formata a data para exibição (memoizado fora do componente)
 */
const formatDate = (date) => {
  if (!date) return null;
  
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('pt-BR');
  } catch {
    return null;
  }
};

/**
 * Gera URL otimizada da imagem (memoizado fora do componente)
 */
const getOptimizedImageUrl = (url, size = 'medium') => {
  if (!url) return null;

  const absoluteUrl = buildAssetUrl(url);
  if (!absoluteUrl) {
    return null;
  }

  try {
    const parsed = new URL(absoluteUrl);
    parsed.searchParams.set('size', size);
    return parsed.toString();
  } catch {
    const separator = absoluteUrl.includes('?') ? '&' : '?';
    return `${absoluteUrl}${separator}size=${size}`;
  }
};

/**
 * ComicCard - Card de HQ com todas as informações
 * @param {object} item - Dados da HQ
 * @param {function} onSelect - Callback ao clicar no card
 */
const ComicCard = memo(function ComicCard({ item, onSelect, onStatusChanged }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [itemStatus, setItemStatus] = useState(item.status);

  // Memoiza as URLs das imagens
  const imageUrls = useMemo(() => ({
    small: getOptimizedImageUrl(item.imageUrl, 'small'),
    large: getOptimizedImageUrl(item.imageUrl, 'large'),
  }), [item.imageUrl]);

  // Memoiza a data formatada
  const formattedDate = useMemo(
    () => formatDate(item.purchaseDate || item.addedDate),
    [item.purchaseDate, item.addedDate]
  );

  // Memoiza os estados de imagem
  const hasError = imageError;
  const hasImage = item.imageUrl && !hasError;

  // Callbacks otimizados
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);
  const handleImageError = useCallback(() => setImageError(true), []);
  
  const handleClick = useCallback(() => {
    onSelect(item.id);
  }, [onSelect, item.id]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(item.id);
    }
  }, [onSelect, item.id]);

  const handleBadgeClick = useCallback((e) => {
    e.stopPropagation();
    setShowStatusMenu(!showStatusMenu);
  }, [showStatusMenu]);

  const handleBadgeKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      setShowStatusMenu(!showStatusMenu);
    } else if (e.key === 'Escape' && showStatusMenu) {
      setShowStatusMenu(false);
    }
  }, [showStatusMenu]);

  const handleStatusChanged = useCallback((itemId, newStatus) => {
    setItemStatus(newStatus);
    setShowStatusMenu(false);
    if (onStatusChanged) {
      onStatusChanged(itemId, newStatus);
    }
  }, [onStatusChanged]);

  const handleCloseStatusMenu = useCallback(() => {
    setShowStatusMenu(false);
  }, []);

  // Memoiza o subtítulo
  const subtitle = useMemo(() => {
    if (item.series) {
      return `${item.series} • #${item.issue || '1'}`;
    }
    return `#${item.issue || '1'}`;
  }, [item.series, item.issue]);

  return (
    <article 
      className="comic-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhes de ${item.title}`}
    >
      {/* Container da imagem */}
      <div className="comic-card__image-container">
        <div className="comic-card__image">
          {!hasImage ? (
            <div className="comic-card__image-fallback">
              <ImagePlaceholderIcon />
              <span className="comic-card__image-fallback-text">
                {!item.imageUrl ? 'Sem imagem disponível' : 'Erro ao carregar imagem'}
              </span>
            </div>
          ) : (
            <>
              {!imageLoaded && (
                <div className="comic-card__image-skeleton" />
              )}
              <img
                data-src={imageUrls.large}
                src={imageUrls.small}
                alt={`Capa de ${item.title}`}
                loading="lazy"
                className={`comic-card__image-element ${imageLoaded ? 'loaded' : 'loading'}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </>
          )}
        </div>

        {/* Badge de status - clicável */}
        <div 
          className="comic-card__badge-wrapper"
          onClick={handleBadgeClick}
          onKeyDown={handleBadgeKeyDown}
          role="button"
          tabIndex={0}
          aria-label={`Mudar status de ${item.title}`}
          aria-expanded={showStatusMenu}
          aria-haspopup="menu"
        >
          <CardBadge status={itemStatus} />
          
          {/* Menu de mudança de status */}
          {showStatusMenu && (
            <div 
              className="comic-card__status-menu-container"
              role="menu"
              aria-label="Opções de status"
            >
              <ItemStatusMenu
                itemId={item.id}
                currentStatus={itemStatus}
                onStatusChanged={handleStatusChanged}
                onClose={handleCloseStatusMenu}
              />
            </div>
          )}
        </div>

        {/* Overlay com data (visível no hover) */}
        {formattedDate && (
          <div className="comic-card__overlay">
            <div className="comic-card__date">
              <CalendarIcon />
              <span>{formattedDate}</span>
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo do card */}
      <div className="comic-card__content">
        {/* Título e subtítulo */}
        <div className="comic-card__header">
          <h3 className="comic-card__title">{item.title}</h3>
          <p className="comic-card__subtitle">{subtitle}</p>
        </div>

        {/* Info: Publisher, Year, Rating */}
        <div className="comic-card__info">
          <div className="comic-card__publisher-year">
            <span>{item.publisher || 'Editora desconhecida'}</span>
            <span>{item.year || new Date().getFullYear()}</span>
          </div>

          <CardRating rating={item.rating || 0} />

          <CardTags tags={item.tags} maxTags={3} />
        </div>
      </div>
    </article>
  );
});

ComicCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    series: PropTypes.string,
    issue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    publisher: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    imageUrl: PropTypes.string,
    rating: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
    purchaseDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    addedDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  onStatusChanged: PropTypes.func,
};

export default ComicCard;
