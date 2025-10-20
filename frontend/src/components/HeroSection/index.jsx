import PropTypes from 'prop-types';
import organizeIcon from '../../assets/icons/organize-icon.svg';
import './styles.css';

function HeroSection({ onGetStarted }) {
  return (
    <section className="hero-section">
      <div className="hero-section__container">
        {/* Linha decorativa gradiente */}
        <div className="hero-section__gradient-line"></div>
        
        {/* Conteúdo principal */}
        <div className="hero-section__content">
          {/* Badge com ícone */}
          <div className="hero-section__badge">
            <img src={organizeIcon} alt="" className="hero-section__badge-icon" />
            <span className="hero-section__badge-text">Organize sua coleção com facilidade</span>
          </div>
          
          {/* Textos principais */}
          <div className="hero-section__text">
            <h1 className="hero-section__heading">
              Gerencie sua coleção de HQs e Mangás
            </h1>
            <p className="hero-section__paragraph">
              Visualize e gerencie sua coleção de HQs com autenticação segura, upload de capas, 
              importação CSV e interface otimizada para acessibilidade e Core Web Vitals.
            </p>
          </div>
          
          {/* Botão CTA */}
          <button 
            className="hero-section__button"
            onClick={onGetStarted}
            type="button"
          >
            Começar Agora
          </button>
        </div>
      </div>
    </section>
  );
}

HeroSection.propTypes = {
  onGetStarted: PropTypes.func,
};

HeroSection.defaultProps = {
  onGetStarted: () => {},
};

export default HeroSection;