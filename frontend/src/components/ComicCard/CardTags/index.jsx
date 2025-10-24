import PropTypes from 'prop-types';
import './CardTags.css';

/**
 * CardTags - Lista de tags do card
 * @param {string[]} tags - Array de tags
 * @param {number} maxTags - Número máximo de tags a exibir
 */
function CardTags({ tags = [], maxTags = 3 }) {
  if (!tags || tags.length === 0) {
    return null;
  }

  const displayTags = tags.slice(0, maxTags);

  return (
    <div className="card-tags">
      {displayTags.map((tag, index) => {
        const tagText = tag.startsWith('#') ? tag : `#${tag}`;
        return (
          <span key={index} className="card-tags__tag">
            {tagText}
          </span>
        );
      })}
    </div>
  );
}

CardTags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  maxTags: PropTypes.number,
};

CardTags.defaultProps = {
  tags: [],
  maxTags: 3,
};

export default CardTags;
