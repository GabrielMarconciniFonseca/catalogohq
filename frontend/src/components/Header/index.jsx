import PropTypes from 'prop-types';
import figmaHeaderIcon from '../../assets/icons/catalogo-hq-icon.svg';
import userIcon from '../../assets/icons/user-icon.svg';
import './Header.css';

function Header({ onLoginClick, isAuthenticated, userName, searchContent, actionsContent }) {
  const hasSearch = Boolean(isAuthenticated && searchContent);
  const hasActions = Boolean(isAuthenticated && actionsContent);

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <img src={figmaHeaderIcon} alt="Ícone Catálogo HQ" className="header__logo-icon" />
          <span className="header__logo-text">Catálogo HQ</span>
        </div>
        {hasSearch && (
          <div className="header__search">
            {searchContent}
          </div>
        )}
        {isAuthenticated ? (
          <div className="header__controls">
            {hasActions && (
              <div className="header__actions">
                {actionsContent}
              </div>
            )}
            <div className="header__auth">
              <img src={userIcon} alt="" className="header__auth-icon" />
              <button 
                className="header__auth-button"
                onClick={onLoginClick}
                type="button"
              >
                {`Olá, ${userName || 'Usuário'}`}
              </button>
            </div>
          </div>
        ) : (
          <div className="header__auth">
            <img src={userIcon} alt="" className="header__auth-icon" />
            <button 
              className="header__auth-button"
              onClick={onLoginClick}
              type="button"
            >
              Faça o seu login
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

Header.propTypes = {
  onLoginClick: PropTypes.func,
  isAuthenticated: PropTypes.bool,
  userName: PropTypes.string,
  searchContent: PropTypes.node,
  actionsContent: PropTypes.node,
};

Header.defaultProps = {
  onLoginClick: () => {},
  isAuthenticated: false,
  userName: '',
  searchContent: null,
  actionsContent: null,
};

export default Header;