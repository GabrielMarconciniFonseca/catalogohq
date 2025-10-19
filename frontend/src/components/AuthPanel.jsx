import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import './AuthPanel.css';

const MODES = {
  login: 'Entrar',
  register: 'Criar conta',
};

function AuthPanel() {
  const { isAuthenticated, user, login, register, loginWithGoogle, logout, error, setError } = useAuth();
  const [mode, setMode] = useState('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
    fullName: '',
  });

  const title = useMemo(() => (mode === 'login' ? 'Acesse sua conta' : 'Registre-se'), [mode]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (mode === 'login') {
        await login({ username: formValues.username, password: formValues.password });
      } else {
        await register({
          username: formValues.username,
          password: formValues.password,
          fullName: formValues.fullName,
        });
      }
      setFormValues({ username: '', password: '', fullName: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchMode = (nextMode) => {
    setMode(nextMode);
    setError(null);
    setFormValues({ username: '', password: '', fullName: '' });
  };

  if (isAuthenticated) {
    return (
      <div className="auth-panel auth-panel--welcome" aria-live="polite">
        <p>
          <strong>{user.fullName}</strong>
          <span>Conectado como {user.username}</span>
        </p>
        <button type="button" onClick={logout} className="auth-panel__button">
          Sair
        </button>
      </div>
    );
  }

  return (
    <section className="auth-panel" aria-label="Autenticação">
      <header className="auth-panel__header">
        <h2>{title}</h2>
        <div className="auth-panel__switcher" role="tablist" aria-label="Alternar entre login e cadastro">
          {Object.entries(MODES).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={mode === key}
              className={`auth-panel__tab ${mode === key ? 'auth-panel__tab--active' : ''}`}
              onClick={() => handleSwitchMode(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </header>
      <form className="auth-panel__form" onSubmit={handleSubmit} aria-live="assertive">
        <div className="auth-panel__field">
          <label htmlFor="auth-username">Usuário</label>
          <input
            id="auth-username"
            name="username"
            autoComplete="username"
            value={formValues.username}
            onChange={handleInputChange}
            required
            minLength={3}
          />
        </div>
        {mode === 'register' && (
          <div className="auth-panel__field">
            <label htmlFor="auth-full-name">Nome completo</label>
            <input
              id="auth-full-name"
              name="fullName"
              autoComplete="name"
              value={formValues.fullName}
              onChange={handleInputChange}
              required
              minLength={3}
            />
          </div>
        )}
        <div className="auth-panel__field">
          <label htmlFor="auth-password">Senha</label>
          <input
            id="auth-password"
            name="password"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            value={formValues.password}
            onChange={handleInputChange}
            required
            minLength={6}
          />
        </div>
        {error && (
          <p className="auth-panel__feedback" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="auth-panel__button" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : MODES[mode]}
        </button>
        <div className="auth-panel__divider" role="presentation">
          <span>ou</span>
        </div>
        <button
          type="button"
          className="auth-panel__button auth-panel__button--google"
          onClick={loginWithGoogle}
        >
          Entrar com Google
        </button>
      </form>
    </section>
  );
}

export default AuthPanel;
