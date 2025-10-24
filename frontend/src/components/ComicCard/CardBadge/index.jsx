import PropTypes from 'prop-types';
import { getStatusConfig, COMIC_STATUS } from '../../../constants/comicStatus';
import './CardBadge.css';

/**
 * Ícone de coleção para o badge (status OWNED)
 */
const CollectionIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 1L6.66667 1C7.33333 1 8 1 8 1"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <path
      d="M2 1L8 1C9.10457 1 10 1.89543 10 3V11H2V1Z"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Ícone de leitura para o badge (status READING)
 */
const ReadingIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 3.5V11"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <path
      d="M1 1.5C1 1.5 1 1.5 1 1.5L6 1.5C7.65685 1.5 9 2.34315 10 3.5V11H2V1.5H1Z"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Ícone de wishlist para o badge (status WISHLIST)
 */
const WishlistIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 10.5L2 6.5C1 5.5 1 4 2 3C3 2 4.5 2 5.5 3L6 3.5L6.5 3C7.5 2 9 2 10 3C11 4 11 5.5 10 6.5L6 10.5Z"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Ícone de completo para o badge (status COMPLETED)
 */
const CompletedIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
    <path
      d="M4 6L5.5 7.5L8 5"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Retorna o ícone correto baseado no status
 */
const getStatusIcon = (status) => {
  switch (status) {
    case COMIC_STATUS.OWNED:
      return <CollectionIcon />;
    case COMIC_STATUS.READING:
      return <ReadingIcon />;
    case COMIC_STATUS.WISHLIST:
      return <WishlistIcon />;
    case COMIC_STATUS.COMPLETED:
      return <CompletedIcon />;
    default:
      return <CollectionIcon />;
  }
};

/**
 * CardBadge - Badge de status do card
 * @param {string} status - Status da HQ (OWNED, READING, WISHLIST, COMPLETED)
 */
function CardBadge({ status }) {
  const config = getStatusConfig(status);

  return (
    <div 
      className={`card-badge card-badge--${config.className}`}
      style={{
        backgroundColor: config.backgroundColor,
        color: config.textColor,
      }}
    >
      {getStatusIcon(status)}
      <span className="card-badge__label">{config.label}</span>
    </div>
  );
}

CardBadge.propTypes = {
  status: PropTypes.string,
};

CardBadge.defaultProps = {
  status: 'OWNED',
};

export default CardBadge;
