import PropTypes from 'prop-types';
import { useItemStatus } from '../../hooks/useItemStatus';
import { COMIC_STATUS, STATUS_CONFIG } from '../../constants/comicStatus';
import Feedback from '../Feedback';
import './ItemStatusMenu.css';

/**
 * Menu para alterar o status de um item
 * Demonstra o uso do hook useItemStatus
 * 
 * @param {object} props
 * @param {number|string} props.itemId - ID do item
 * @param {string} props.currentStatus - Status atual do item
 * @param {function} props.onStatusChanged - Callback após mudança de status bem-sucedida
 * @param {function} props.onClose - Callback para fechar o menu
 */
function ItemStatusMenu({ itemId, currentStatus, onStatusChanged, onClose }) {
  const { updateStatus, feedback, clearFeedback, isLoading } = useItemStatus();

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) {
      return;
    }

    const success = await updateStatus(itemId, newStatus);
    
    if (success && onStatusChanged) {
      // Aguardar um momento para o usuário ver o feedback
      setTimeout(() => {
        onStatusChanged(itemId, newStatus);
        if (onClose) onClose();
      }, 1500);
    }
  };

  return (
    <div className="item-status-menu">
      <div className="item-status-menu__header">
        <h3>Alterar Status</h3>
        {onClose && (
          <button 
            type="button"
            className="item-status-menu__close"
            onClick={onClose}
            aria-label="Fechar menu"
            disabled={isLoading}
          >
            ✕
          </button>
        )}
      </div>

      {/* Lista de opções de status */}
      <div className="item-status-menu__options">
        {Object.values(COMIC_STATUS).map((status) => {
          const config = STATUS_CONFIG[status];
          const isCurrent = status === currentStatus;
          
          return (
            <button
              key={status}
              type="button"
              className={`item-status-menu__option ${isCurrent ? 'item-status-menu__option--current' : ''}`}
              onClick={() => handleStatusChange(status)}
              disabled={isLoading || isCurrent}
              style={{
                '--status-color': config.backgroundColor,
              }}
            >
              <span 
                className="item-status-menu__option-indicator"
                style={{ backgroundColor: config.backgroundColor }}
              />
              <span className="item-status-menu__option-label">
                {config.label}
              </span>
              {isCurrent && (
                <span className="item-status-menu__option-check">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback de operação */}
      {feedback.state !== 'idle' && (
        <div className="item-status-menu__feedback">
          <Feedback status={feedback} />
        </div>
      )}
    </div>
  );
}

ItemStatusMenu.propTypes = {
  itemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  currentStatus: PropTypes.string.isRequired,
  onStatusChanged: PropTypes.func,
  onClose: PropTypes.func,
};

export default ItemStatusMenu;
