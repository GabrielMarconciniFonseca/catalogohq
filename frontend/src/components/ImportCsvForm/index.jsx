import { useState } from 'react';
import PropTypes from 'prop-types';
import './styles.css';

function ImportCsvForm({ onImport, isImporting }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const nextFile = event.target.files?.[0] ?? null;
    setFile(nextFile);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Selecione um arquivo CSV para importar.');
      return;
    }
    try {
      await onImport(file);
      setFile(null);
      setError('');
      event.target.reset();
    } catch (err) {
      setError(err.message ?? 'Não foi possível importar o arquivo.');
    }
  };

  return (
    <form className="csv-import" onSubmit={handleSubmit} aria-label="Importar edições por CSV">
      <h4>Importação rápida por CSV</h4>
      <p className="csv-import__helper">
        Utilize um arquivo com colunas <strong>title, series, issueNumber, publisher, status, tags</strong>. Campos opcionais:
        language, condition, location, description.
      </p>
      <div className="csv-import__controls">
        <input type="file" accept=".csv" onChange={handleFileChange} aria-label="Selecionar arquivo CSV" />
        <button type="submit" disabled={isImporting}>
          {isImporting ? 'Importando...' : 'Importar CSV'}
        </button>
      </div>
      {error && (
        <p className="csv-import__error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

ImportCsvForm.propTypes = {
  onImport: PropTypes.func.isRequired,
  isImporting: PropTypes.bool,
};

ImportCsvForm.defaultProps = {
  isImporting: false,
};

export default ImportCsvForm;
