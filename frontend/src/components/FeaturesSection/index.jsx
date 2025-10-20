import PropTypes from 'prop-types';
import uploadIcon from '../../assets/icons/upload-icon.svg';
import csvIcon from '../../assets/icons/csv-icon.svg';
import searchIcon from '../../assets/icons/search-icon.svg';
import securityIcon from '../../assets/icons/security-icon.svg';
import './styles.css';

const features = [
  {
    id: 'upload',
    icon: uploadIcon,
    title: 'Upload de Capas',
    description: 'Adicione capas de alta qualidade para visualizar sua coleção de forma atraente'
  },
  {
    id: 'csv',
    icon: csvIcon,
    title: 'Importação CSV',
    description: 'Importe sua coleção existente rapidamente através de arquivos CSV'
  },
  {
    id: 'search',
    icon: searchIcon,
    title: 'Busca Avançada',
    description: 'Encontre rapidamente qualquer HQ por título, editora, série ou tags'
  },
  {
    id: 'security',
    icon: securityIcon,
    title: 'Segurança',
    description: 'Autenticação segura e proteção de dados para manter sua coleção privada'
  }
];

function FeaturesSection() {
  return (
    <section className="features-section">
      {/* Header com fundo gradiente */}
      <div className="features-section__header">
        <h2 className="features-section__title">Recursos Poderosos</h2>
        <p className="features-section__subtitle">
          Tudo que você precisa para organizar e gerenciar sua coleção de quadrinhos
        </p>
      </div>
      
      {/* Grid de recursos */}
      <div className="features-section__grid">
        {features.map((feature) => (
          <div key={feature.id} className="features-section__card">
            <div className="features-section__card-icon">
              <img src={feature.icon} alt="" />
            </div>
            <div className="features-section__card-content">
              <h3 className="features-section__card-title">{feature.title}</h3>
              <p className="features-section__card-description">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

FeaturesSection.propTypes = {
  // Sem props por enquanto, mas preparado para futuras extensões
};

export default FeaturesSection;