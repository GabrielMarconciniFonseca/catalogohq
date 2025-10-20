import PropTypes from 'prop-types';
import './styles.css';

const steps = [
  {
    id: 1,
    number: '1',
    title: 'Crie sua Conta',
    description: 'Registre-se gratuitamente e acesse seu painel personalizado',
    gradient: 'linear-gradient(135deg, rgba(21, 93, 252, 1) 0%, rgba(20, 71, 230, 1) 100%)'
  },
  {
    id: 2,
    number: '2',
    title: 'Adicione suas HQs',
    description: 'Cadastre manualmente ou importe sua coleção via CSV',
    gradient: 'linear-gradient(135deg, rgba(152, 16, 250, 1) 0%, rgba(130, 0, 219, 1) 100%)'
  },
  {
    id: 3,
    number: '3',
    title: 'Organize e Gerencie',
    description: 'Busque, filtre e acompanhe sua coleção com facilidade',
    gradient: 'linear-gradient(135deg, rgba(230, 0, 118, 1) 0%, rgba(198, 0, 92, 1) 100%)'
  }
];

function HowItWorksSection() {
  return (
    <section className="how-it-works-section">
      <div className="how-it-works-section__container">
        {/* Header */}
        <div className="how-it-works-section__header">
          <h2 className="how-it-works-section__title">Como Funciona</h2>
          <p className="how-it-works-section__subtitle">
            Comece a catalogar sua coleção em poucos minutos
          </p>
        </div>
        
        {/* Steps */}
        <div className="how-it-works-section__steps">
          {/* Linha conectora gradiente */}
          <div className="how-it-works-section__connector-line"></div>
          
          {/* Lista de passos */}
          <div className="how-it-works-section__steps-list">
            {steps.map((step, index) => (
              <div key={step.id} className="how-it-works-section__step">
                <div 
                  className="how-it-works-section__step-number"
                  style={{ background: step.gradient }}
                >
                  <span>{step.number}</span>
                </div>
                <div className="how-it-works-section__step-content">
                  <h3 className="how-it-works-section__step-title">{step.title}</h3>
                  <p className="how-it-works-section__step-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

HowItWorksSection.propTypes = {
  // Sem props por enquanto, mas preparado para futuras extensões
};

export default HowItWorksSection;