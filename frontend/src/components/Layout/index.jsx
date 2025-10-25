import PropTypes from 'prop-types';
import Header from '../Header';
import './Layout.css';

function Layout({
  children,
  onLoginClick = () => {},
  isAuthenticated = false,
  userName = '',
  headerSearchContent = null,
  headerActionsContent = null,
}) {
  return (
    <div className="layout">
      <a className="layout__skip-link" href="#conteudo-principal">
        Pular para o conteúdo principal
      </a>
      <Header 
        onLoginClick={onLoginClick}
        isAuthenticated={isAuthenticated}
        userName={userName}
        searchContent={headerSearchContent}
        actionsContent={headerActionsContent}
      />
      <main id="conteudo-principal" className="layout__content">
        {children}
      </main>
      <footer className="layout__footer">
        <div className="layout__footer-content">
          <div className="layout__footer-column">
            <h3 className="layout__footer-title">Catálogo HQ</h3>
            <p className="layout__footer-description">
              A melhor plataforma para catalogar e organizar sua coleção de HQs e mangás.
            </p>
          </div>
          <div className="layout__footer-column">
            <h4 className="layout__footer-subtitle">Produto</h4>
            <ul className="layout__footer-list">
              <li><a href="#recursos">Recursos</a></li>
              <li><a href="#precos">Preços</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
          <div className="layout__footer-column">
            <h4 className="layout__footer-subtitle">Empresa</h4>
            <ul className="layout__footer-list">
              <li><a href="#sobre">Sobre</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#contato">Contato</a></li>
            </ul>
          </div>
          <div className="layout__footer-column">
            <h4 className="layout__footer-subtitle">Legal</h4>
            <ul className="layout__footer-list">
              <li><a href="#privacidade">Privacidade</a></li>
              <li><a href="#termos">Termos</a></li>
              <li><a href="#cookies">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="layout__footer-bottom">
          <small>© 2025 Catálogo HQ. Todos os direitos reservados.</small>
        </div>
      </footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  onLoginClick: PropTypes.func,
  isAuthenticated: PropTypes.bool,
  userName: PropTypes.string,
  headerSearchContent: PropTypes.node,
  headerActionsContent: PropTypes.node,
};

export default Layout;
