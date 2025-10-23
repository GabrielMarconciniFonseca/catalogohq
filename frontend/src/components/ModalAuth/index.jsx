import PropTypes from 'prop-types';
import { useEffect } from 'react';
import closeIcon from '../../assets/icons/modal-close-icon.svg';
import AuthPanel from '../AuthPanel';
import './styles.css';

function ModalAuth({ isOpen, onClose }) {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-auth__backdrop" 
      role="dialog" 
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className="modal-auth" role="document">
        <button className="modal-auth__close" onClick={onClose} aria-label="Fechar modal">
          <img src={closeIcon} alt="Fechar" />
        </button>
        <div className="modal-auth__content">
          <AuthPanel onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
}

ModalAuth.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

ModalAuth.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default ModalAuth;
