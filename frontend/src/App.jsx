import { useEffect, useMemo, useState } from 'react';
import ItemList from './components/ItemList.jsx';
import ItemDetail from './components/ItemDetail.jsx';
import ItemForm from './components/ItemForm.jsx';
import SearchBar from './components/SearchBar.jsx';
import Feedback from './components/Feedback.jsx';
import Layout from './components/Layout.jsx';
import { fetchItems, fetchItemById, createItem } from './services/api.js';
import './styles/App.css';

const DEFAULT_FILTERS = {
  term: '',
  category: 'todos',
};

function App() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedItem, setSelectedItem] = useState(null);
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      setStatus({ state: 'loading', message: 'Carregando itens...' });
      try {
        const data = await fetchItems();
        setItems(data);
        setStatus({ state: 'success', message: 'Itens carregados com sucesso.' });
      } catch (err) {
        setError(err);
        setStatus({ state: 'error', message: 'Não foi possível carregar os itens.' });
      }
    };

    loadItems();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(items.map((item) => item.category ?? 'Outros'));
    return ['todos', ...Array.from(uniqueCategories)];
  }, [items]);

  const filteredItems = useMemo(() => {
    const term = filters.term.trim().toLowerCase();
    return items.filter((item) => {
      const matchesTerm =
        !term ||
        item.name.toLowerCase().includes(term) ||
        (item.description ?? '').toLowerCase().includes(term);
      const matchesCategory =
        filters.category === 'todos' || item.category === filters.category;
      return matchesTerm && matchesCategory;
    });
  }, [items, filters]);

  const handleSelectItem = async (itemId) => {
    try {
      setStatus({ state: 'loading', message: 'Carregando detalhes...' });
      const item = await fetchItemById(itemId);
      setSelectedItem(item);
      setStatus({ state: 'success', message: 'Detalhes carregados.' });
    } catch (err) {
      setError(err);
      setStatus({ state: 'error', message: 'Não foi possível carregar os detalhes.' });
    }
  };

  const handleCreateItem = async (payload) => {
    try {
      setStatus({ state: 'loading', message: 'Salvando item...' });
      const newItem = await createItem(payload);
      setItems((prev) => [newItem, ...prev]);
      setSelectedItem(newItem);
      setStatus({ state: 'success', message: 'Item cadastrado com sucesso!' });
    } catch (err) {
      setError(err);
      setStatus({ state: 'error', message: 'Erro ao salvar item.' });
    }
  };

  const handleFilterChange = (nextFilters) => {
    setFilters((prev) => ({ ...prev, ...nextFilters }));
  };

  return (
    <Layout>
      <header className="app-header">
        <div>
          <h1>Catálogo HQ</h1>
          <p>Gerencie o catálogo de produtos com uma experiência moderna e responsiva.</p>
        </div>
      </header>
      <main className="app-main">
        <section className="list-section" aria-label="Listagem de itens">
          <SearchBar
            filters={filters}
            categories={categories}
            onChange={handleFilterChange}
            isLoading={status.state === 'loading'}
          />
          <ItemList
            items={filteredItems}
            onSelectItem={handleSelectItem}
            isLoading={status.state === 'loading' && !selectedItem}
            error={error}
          />
        </section>
        <section className="details-section" aria-label="Detalhes do item">
          <ItemDetail item={selectedItem} isLoading={status.state === 'loading'} />
          <ItemForm categories={categories} onSubmit={handleCreateItem} isSubmitting={status.state === 'loading'} />
        </section>
      </main>
      <Feedback status={status} />
    </Layout>
  );
}

export default App;
