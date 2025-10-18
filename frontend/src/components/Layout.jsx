import PropTypes from 'prop-types';
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="layout">
      <a className="layout__skip-link" href="#conteudo-principal">
        Pular para o conteúdo principal
      </a>
      <div className="layout__content">{children}</div>
      <footer className="layout__footer">
        <small>Catálogo HQ · Experiência moderna, acessível e responsiva</small>
      </footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
