import { useState } from 'react';
import PropTypes from 'prop-types';
import './ItemForm.css';

const INITIAL_VALUES = {
  name: '',
  category: '',
  price: '',
  stock: '',
  sku: '',
  description: '',
};

function ItemForm({ categories, onSubmit, isSubmitting }) {
  const [values, setValues] = useState(INITIAL_VALUES);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      name: values.name.trim(),
      category: values.category || null,
      price: values.price ? Number(values.price) : null,
      stock: values.stock ? Number(values.stock) : null,
      sku: values.sku || null,
      description: values.description.trim() || null,
    };

    if (!payload.name) {
      return;
    }

    await onSubmit(payload);
    setValues(INITIAL_VALUES);
  };

  return (
    <form className="item-form" onSubmit={handleSubmit} aria-label="Cadastro de item">
      <h3>Cadastrar novo item</h3>
      <div className="item-form__grid">
        <label className="item-form__field">
          <span>Nome*</span>
          <input name="name" value={values.name} onChange={handleChange} placeholder="Nome do item" required />
        </label>
        <label className="item-form__field">
          <span>Categoria</span>
          <select name="category" value={values.category} onChange={handleChange}>
            <option value="">Selecione</option>
            {categories
              .filter((category) => category !== 'todos')
              .map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </select>
        </label>
        <label className="item-form__field">
          <span>Preço</span>
          <input
            type="number"
            name="price"
            value={values.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            placeholder="0,00"
          />
        </label>
        <label className="item-form__field">
          <span>Estoque</span>
          <input type="number" name="stock" value={values.stock} onChange={handleChange} min="0" />
        </label>
        <label className="item-form__field">
          <span>SKU</span>
          <input name="sku" value={values.sku} onChange={handleChange} placeholder="SKU interno" />
        </label>
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
      <button type="submit" className="item-form__submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Salvar item'}
      </button>
    </form>
  );
}

ItemForm.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string),
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

ItemForm.defaultProps = {
  categories: [],
  isSubmitting: false,
};

export default ItemForm;
