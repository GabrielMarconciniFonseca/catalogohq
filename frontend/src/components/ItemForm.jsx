import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import './ItemForm.css';

const INITIAL_VALUES = {
  title: '',
  author: '',
  publisher: '',
  price: '',
  stockQuantity: '',
  releaseDate: '',
  description: '',
  cover: null,
};

function ItemForm({ onSubmit, isSubmitting }) {
  const [values, setValues] = useState(INITIAL_VALUES);
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
      values.author.trim() &&
      values.publisher.trim() &&
      values.price !== '' &&
      values.releaseDate,
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
    setValues(INITIAL_VALUES);
    setPreview(null);
    setFormError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) {
      setFormError('Preencha os campos obrigatórios para continuar.');
      return;
    }

    const payload = {
      title: values.title.trim(),
      author: values.author.trim(),
      publisher: values.publisher.trim(),
      description: values.description.trim() || null,
      price: Number(values.price),
      releaseDate: values.releaseDate,
      stockQuantity: values.stockQuantity ? Number(values.stockQuantity) : 0,
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
      <h3>Cadastrar nova HQ</h3>
      <div className="item-form__grid">
        <label className="item-form__field">
          <span>Título*</span>
          <input name="title" value={values.title} onChange={handleChange} placeholder="Título da HQ" required />
        </label>
        <label className="item-form__field">
          <span>Autor*</span>
          <input name="author" value={values.author} onChange={handleChange} placeholder="Nome do autor" required />
        </label>
        <label className="item-form__field">
          <span>Editora*</span>
          <input name="publisher" value={values.publisher} onChange={handleChange} placeholder="Editora" required />
        </label>
        <label className="item-form__field">
          <span>Preço*</span>
          <input
            type="number"
            name="price"
            value={values.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            placeholder="0,00"
            required
          />
        </label>
        <label className="item-form__field">
          <span>Estoque</span>
          <input
            type="number"
            name="stockQuantity"
            value={values.stockQuantity}
            onChange={handleChange}
            min="0"
            placeholder="0"
          />
        </label>
        <label className="item-form__field">
          <span>Data de lançamento*</span>
          <input type="date" name="releaseDate" value={values.releaseDate} onChange={handleChange} required />
        </label>
        <label className="item-form__field item-form__field--file">
          <span>Capa (imagem)</span>
          <input type="file" accept="image/*" name="cover" onChange={handleFileChange} />
        </label>
        {preview && (
          <div className="item-form__preview" aria-live="polite">
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
      </div>
      <label className="item-form__field">
        <span>Descrição</span>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          rows={4}
          placeholder="Adicione uma breve descrição"
        />
      </label>
      {formError && (
        <p className="item-form__error" role="alert">
          {formError}
        </p>
      )}
      <button type="submit" className="item-form__submit" disabled={isSubmitting || !canSubmit}>
        {isSubmitting ? 'Salvando...' : 'Salvar HQ'}
      </button>
    </form>
  );
}

ItemForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

ItemForm.defaultProps = {
  isSubmitting: false,
};

export default ItemForm;
