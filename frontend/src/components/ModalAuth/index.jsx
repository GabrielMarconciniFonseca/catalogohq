import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import googleIcon from '../../assets/icons/google-login-icon.svg';
import closeIcon from '../../assets/icons/modal-close-icon.svg';
import './styles.css';

function ModalAuth({ isOpen, onClose, onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');



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

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password, mode });
  };

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

        <div className="modal-auth__header">
          <h2>Acesse sua conta</h2>
          <p>Entre ou crie uma conta para começar a catalogar sua coleção</p>
        </div>

        <div className="modal-auth__content">
          <div className="modal-auth__tabs">
            <button
              type="button"
              className={`modal-auth__tab ${mode === 'login' ? 'is-active' : ''}`}
              onClick={() => setMode('login')}
            >
              Entrar
            </button>
            <button
              type="button"
              className={`modal-auth__tab ${mode === 'signup' ? 'is-active' : ''}`}
              onClick={() => setMode('signup')}
            >
              Criar Conta
            </button>
          </div>

          <form className="modal-auth__form" onSubmit={handleSubmit}>
            <div className="modal-auth__field">
              <label className="modal-auth__label">Email</label>
              <input
                className="modal-auth__input"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="modal-auth__field">
              <label className="modal-auth__label">Senha</label>
              <input
                className="modal-auth__input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="modal-auth__submit">
              {mode === 'login' ? 'Entrar' : 'Criar Conta'}
            </button>

            <div className="modal-auth__or">
              <div className="modal-auth__or-line" />
              <div className="modal-auth__or-text">OU</div>
            </div>

            <button type="button" className="modal-auth__google" onClick={() => onLogin({ provider: 'google' })}>
              <img src={googleIcon} alt="Google" />
              Entrar com Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

ModalAuth.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onLogin: PropTypes.func,
};

ModalAuth.defaultProps = {
  isOpen: false,
  onClose: () => {},
  onLogin: () => {},
};

export default ModalAuth;
