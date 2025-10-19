import PropTypes from 'prop-types';
import './styles.css';

const STATUS_COPY = {
  idle: 'Pronto para uso.',
  loading: 'Carregando informações...',
  success: 'Operação concluída com sucesso.',
  error: 'Ocorreu um erro. Tente novamente.',
};

function Feedback({ status }) {
  const copy = STATUS_COPY[status.state] ?? STATUS_COPY.idle;

  return (
    <div className={`feedback feedback--${status.state}`} role="status" aria-live="polite">
      <span>{status.message || copy}</span>
    </div>
  );
}

Feedback.propTypes = {
  status: PropTypes.shape({
    state: PropTypes.oneOf(['idle', 'loading', 'success', 'error']).isRequired,
    message: PropTypes.string,
  }).isRequired,
};

export default Feedback;
