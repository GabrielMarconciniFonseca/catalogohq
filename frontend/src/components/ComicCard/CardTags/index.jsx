import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import './CardTags.css';

/**
 * CardTags - Lista de tags do card
 * @param {string[]} tags - Array de tags
 * @param {number} maxTags - Número máximo de tags a exibir
 */
const CardTags = memo(function CardTags({ tags = [], maxTags = 3 }) {
  const displayTags = useMemo(
    () => {
      if (!tags || tags.length === 0) {
        return [];
      }
      return tags.slice(0, maxTags);
    },
    [tags, maxTags]
  );

  if (displayTags.length === 0) {
    return null;
  }

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
});

CardTags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  maxTags: PropTypes.number,
};

CardTags.defaultProps = {
  tags: [],
  maxTags: 3,
};

export default CardTags;
