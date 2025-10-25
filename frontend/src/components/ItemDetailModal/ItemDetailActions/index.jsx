import PropTypes from "prop-types";
import Button from "../../Button";
import "./ItemDetailActions.css";

function ItemDetailActions({ onEdit, onShare }) {
  return (
    <div className="item-detail-actions">
      <Button
        onClick={onEdit}
        variant="primary"
        className="item-detail-actions__button"
      >
        Editar
      </Button>
      <Button
        onClick={onShare}
        variant="secondary"
        className="item-detail-actions__button"
      >
        Compartilhar
      </Button>
    </div>
  );
}

ItemDetailActions.propTypes = {
  onEdit: PropTypes.func,
  onShare: PropTypes.func,
};

ItemDetailActions.defaultProps = {
  onEdit: () => {},
  onShare: () => {},
};

export default ItemDetailActions;
