import PropTypes from 'prop-types';
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="layout">
      <div className="layout__content">{children}</div>
      <footer className="layout__footer">
        <small>Catálogo HQ · Experiência moderna e acessível</small>
      </footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
