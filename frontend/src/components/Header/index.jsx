import PropTypes from 'prop-types';
import logoIcon from '../../assets/icons/logo-icon.svg';
import userIcon from '../../assets/icons/user-icon.svg';
import './styles.css';

function Header({ onLoginClick, isAuthenticated, userName }) {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <img src={logoIcon} alt="" className="header__logo-icon" />
          <span className="header__logo-text">Catálogo HQ</span>
        </div>
        
        <div className="header__auth">
          <img src={userIcon} alt="" className="header__auth-icon" />
          <button 
            className="header__auth-button"
            onClick={onLoginClick}
            type="button"
          >
            {isAuthenticated ? `Olá, ${userName || 'Usuário'}` : 'Faça o seu login'}
          </button>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  onLoginClick: PropTypes.func,
  isAuthenticated: PropTypes.bool,
  userName: PropTypes.string,
};

Header.defaultProps = {
  onLoginClick: () => {},
  isAuthenticated: false,
  userName: '',
};

export default Header;