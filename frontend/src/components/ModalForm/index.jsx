import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ItemForm from '../ItemForm';
import './ModalForm.css';

function ModalForm({ isOpen, onClose, onSubmit, isSubmitting }) {
  const dialogRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialog.close();
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) {
      handleClose();
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      // O erro é tratado no componente ItemForm
    }
  };

  const handleFormSubmit = () => {
    if (formRef.current) {
      const submitButton = formRef.current.querySelector('.item-form__submit');
      if (submitButton) {
        submitButton.click();
      }
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="modal-form"
      onClick={handleBackdropClick}
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div className="modal-form__content">
        <div className="modal-form__header">
          <h2 id="modal-title" className="modal-form__title">Adicionar Nova HQ</h2>
          <p className="modal-form__description">
            Preencha os dados da HQ que deseja adicionar ao catálogo
          </p>
          <button
            type="button"
            className="modal-form__close"
            onClick={handleClose}
            aria-label="Fechar modal"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        
        <div className="modal-form__body">
          <div ref={formRef}>
            <ItemForm 
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>

        <div className="modal-form__footer">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cancelar"
          >
            Cancelar
          </button>
          <button
            type="button"
            className="modal-form__submit-btn"
            onClick={handleFormSubmit}
            disabled={isSubmitting}
            aria-label="Adicionar HQ"
          >
            {isSubmitting ? 'Salvando...' : 'Adicionar HQ'}
          </button>
        </div>
      </div>
    </dialog>
  );
}

ModalForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

ModalForm.defaultProps = {
  isSubmitting: false,
};

export default ModalForm;
