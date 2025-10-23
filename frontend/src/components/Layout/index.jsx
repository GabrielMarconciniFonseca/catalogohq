import PropTypes from 'prop-types';
import Header from '../Header';
import './styles.css';

function Layout({
  children,
  onLoginClick,
  isAuthenticated,
  userName,
  headerSearchContent,
  headerActionsContent,
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
        <small>Catálogo HQ · Experiência moderna, acessível e responsiva</small>
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

Layout.defaultProps = {
  onLoginClick: () => {},
  isAuthenticated: false,
  userName: '',
  headerSearchContent: null,
  headerActionsContent: null,
};

export default Layout;
