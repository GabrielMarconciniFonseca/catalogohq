import PropTypes from 'prop-types';
import figmaHeaderIcon from '../../assets/icons/catalogo-hq-icon.svg';
import userIcon from '../../assets/icons/user-icon.svg';
import './Header.css';

function Header({ 
  onLoginClick = () => {}, 
  isAuthenticated = false, 
  userName = '', 
  searchContent = null, 
  actionsContent = null 
}) {
  const hasSearch = Boolean(searchContent);
  const hasActions = Boolean(actionsContent);
  const profileLabel = isAuthenticated
    ? `Abrir menu do usuário ${userName || 'Usuário'}`
    : 'Fazer login no Catálogo HQ';

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__brand">
          <img src={figmaHeaderIcon} alt="Ícone Catálogo HQ" className="header__brand-icon" />
          <span className="header__brand-text">Catalogo HQ</span>
        </div>
        {hasSearch && (
          <div className="header__search" role="search">
            {searchContent}
          </div>
        )}
        <div className="header__right">
          {hasActions && (
            <div className="header__actions">
              {actionsContent}
            </div>
          )}
          {isAuthenticated ? (
            <button
              type="button"
              className="header__profile-button"
              onClick={onLoginClick}
              aria-label={profileLabel}
            >
              <img src={userIcon} alt="" aria-hidden="true" className="header__profile-icon" />
            </button>
          ) : (
            <button
              type="button"
              className="header__login-button"
              onClick={onLoginClick}
              aria-label={profileLabel}
            >
              <img src={userIcon} alt="" aria-hidden="true" className="header__login-icon" />
              <span className="header__login-text">Faça o seu login</span>
            </button>
          )}
        </div>
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

export default Header;