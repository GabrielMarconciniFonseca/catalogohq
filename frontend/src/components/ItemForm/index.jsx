import { useEffect, useMemo, useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import './styles.css';

const INITIAL_VALUES = {
  title: '',
  series: '',
  issueNumber: '',
  publisher: '',
  language: '',
  condition: '',
  location: '',
  description: '',
  status: 'OWNED',
  tags: '',
  cover: null,
};

const STATUS_OPTIONS = [
  { value: 'OWNED', label: 'Na coleção' },
  { value: 'WISHLIST', label: 'Na wishlist' },
  { value: 'ORDERED', label: 'Encomendado' },
  { value: 'LENT', label: 'Emprestado' },
];

const ItemForm = forwardRef(function ItemForm({ onSubmit, isSubmitting }, ref) {
  const [values, setValues] = useState({ ...INITIAL_VALUES });
  const [preview, setPreview] = useState(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!preview) {
      return undefined;
    }
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const canSubmit = useMemo(
    () =>
      values.title.trim() &&
      values.issueNumber.trim() &&
      values.publisher.trim() &&
      values.status,
    [values],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormError('');
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setFormError('');
    setValues((prev) => ({ ...prev, cover: file }));
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  };

  const resetForm = () => {
    setValues({ ...INITIAL_VALUES });
    setPreview(null);
    setFormError('');
  };

  const buildTags = () => {
    if (!values.tags.trim()) {
      return [];
    }
    const parts = values.tags.split(',');
    return parts
      .map((part) => part.trim())
      .filter((part, index, self) => part && self.indexOf(part) === index);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) {
      setFormError('Preencha os campos obrigatórios para continuar.');
      return;
    }

    const payload = {
      title: values.title.trim(),
      series: values.series.trim() || null,
      issueNumber: values.issueNumber.trim(),
      publisher: values.publisher.trim(),
      language: values.language.trim() || null,
      condition: values.condition.trim() || null,
      location: values.location.trim() || null,
      description: values.description.trim() || null,
      status: values.status,
      tags: buildTags(),
      imageUrl: null,
    };

    const formData = new FormData();
    formData.append('item', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    if (values.cover) {
      formData.append('cover', values.cover);
    }

    try {
      await onSubmit(formData);
      resetForm();
    } catch (error) {
      setFormError(error.message ?? 'Não foi possível salvar a HQ.');
    }
  };

  return (
    <form className="item-form" onSubmit={handleSubmit} aria-label="Cadastro de HQ">
      <h3>Cadastrar nova edição</h3>
      <div className="item-form__grid">
        {/* Linha 1: Título (full) */}
        <label className="item-form__field item-form__field--full">
          <span>Título*</span>
          <input name="title" value={values.title} onChange={handleChange} placeholder="Título da HQ" required />
        </label>

        {/* Linha 2: Série (1/2) + Número (1/2) */}
        <label className="item-form__field">
          <span>Série</span>
          <input name="series" value={values.series} onChange={handleChange} placeholder="Série ou arco" />
        </label>
        <label className="item-form__field">
          <span>Número*</span>
          <input name="issueNumber" value={values.issueNumber} onChange={handleChange} placeholder="Edição" required />
        </label>

        {/* Linha 3: Editora (1/2) + Idioma (1/2) */}
        <label className="item-form__field">
          <span>Editora*</span>
          <input name="publisher" value={values.publisher} onChange={handleChange} placeholder="Editora" required />
        </label>
        <label className="item-form__field">
          <span>Idioma</span>
          <input name="language" value={values.language} onChange={handleChange} placeholder="Português" />
        </label>

        {/* Linha 4: Condição (1/2) + Localização (1/2) */}
        <label className="item-form__field">
          <span>Condição</span>
          <input name="condition" value={values.condition} onChange={handleChange} placeholder="Nova, usada..." />
        </label>
        <label className="item-form__field">
          <span>Localização</span>
          <input name="location" value={values.location} onChange={handleChange} placeholder="Estante ou caixa" />
        </label>

        {/* Linha 5: Status (full) */}
        <label className="item-form__field item-form__field--full">
          <span>Status*</span>
          <select name="status" value={values.status} onChange={handleChange} required>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {/* Linha 6: Tags (full) */}
        <label className="item-form__field item-form__field--full">
          <span>Tags</span>
          <input
            name="tags"
            value={values.tags}
            onChange={handleChange}
            placeholder="separe com vírgula"
            aria-describedby="tags-hint"
          />
          <small id="tags-hint" className="item-form__hint">
            Ex.: marvel, capa dura, autografada
          </small>
        </label>

        {/* Linha 7: Capa (full) */}
        <label className="item-form__field item-form__field--file item-form__field--full">
          <span>Capa (imagem)</span>
          <input type="file" accept="image/*" name="cover" onChange={handleFileChange} />
        </label>

        {/* Preview de imagem (full) */}
        {preview && (
          <div className="item-form__preview item-form__field--full" aria-live="polite">
            <img src={preview} alt="Pré-visualização da capa selecionada" />
            <button
              type="button"
              className="item-form__remove"
              onClick={() => {
                setValues((prev) => ({ ...prev, cover: null }));
                setPreview(null);
              }}
            >
              Remover imagem
            </button>
          </div>
        )}

        {/* Linha 8: Descrição (full) */}
        <label className="item-form__field item-form__field--full">
          <span>Descrição</span>
          <textarea
            name="description"
            value={values.description}
            onChange={handleChange}
            rows={4}
            placeholder="Adicione observações, estado de conservação, etc"
          />
        </label>
      </div>

      {/* Erro */}
      {formError && (
        <p className="item-form__error" role="alert">
          {formError}
        </p>
      )}

      {/* Botão Submit */}
      <button type="submit" className="item-form__submit" disabled={isSubmitting || !canSubmit}>
        {isSubmitting ? 'Salvando...' : 'Salvar edição'}
      </button>
    </form>
  );
});

ItemForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

ItemForm.defaultProps = {
  isSubmitting: false,
};

export default ItemForm;
