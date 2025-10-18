import { useEffect, useMemo, useState } from 'react';
import AuthPanel from './components/AuthPanel.jsx';
import Feedback from './components/Feedback.jsx';
import ItemDetail from './components/ItemDetail.jsx';
import ItemForm from './components/ItemForm.jsx';
import ItemList from './components/ItemList.jsx';
import Layout from './components/Layout.jsx';
import SearchBar from './components/SearchBar.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { createItem, fetchItemById, fetchItems } from './services/api.js';
import './styles/App.css';

const DEFAULT_FILTERS = {
  term: '',
  publisher: 'todos',
};

function App() {
  const { isAuthenticated } = useAuth();
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
        setError(null);
        setStatus({ state: 'success', message: 'Itens carregados com sucesso.' });
      } catch (err) {
        setError(err);
        setStatus({ state: 'error', message: 'Não foi possível carregar os itens.' });
      }
    };

    loadItems();
  }, []);

  const publishers = useMemo(() => {
    const uniquePublishers = new Set(items.map((item) => item.publisher ?? 'Outros'));
    return ['todos', ...Array.from(uniquePublishers)];
  }, [items]);

  const filteredItems = useMemo(() => {
    const term = filters.term.trim().toLowerCase();
    return items.filter((item) => {
      const matchesTerm =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.author.toLowerCase().includes(term) ||
        (item.description ?? '').toLowerCase().includes(term);
      const publisherLabel = item.publisher ?? 'Outros';
      const matchesPublisher =
        filters.publisher === 'todos' || publisherLabel === filters.publisher;
      return matchesTerm && matchesPublisher;
    });
  }, [items, filters]);

  const handleSelectItem = async (itemId) => {
    try {
      setStatus({ state: 'loading', message: 'Carregando detalhes...' });
      const item = await fetchItemById(itemId);
      setSelectedItem(item);
      setError(null);
      setStatus({ state: 'success', message: 'Detalhes carregados.' });
    } catch (err) {
      setError(err);
      setStatus({ state: 'error', message: 'Não foi possível carregar os detalhes.' });
    }
  };

  const handleCreateItem = async (formData) => {
    try {
      setStatus({ state: 'loading', message: 'Salvando item...' });
      const newItem = await createItem(formData);
      setItems((prev) => [newItem, ...prev]);
      setSelectedItem(newItem);
      setError(null);
      setStatus({ state: 'success', message: 'Item cadastrado com sucesso!' });
    } catch (err) {
      setError(err);
      setStatus({ state: 'error', message: err.message ?? 'Erro ao salvar item.' });
    }
  };

  const handleFilterChange = (nextFilters) => {
    setFilters((prev) => ({ ...prev, ...nextFilters }));
  };

  return (
    <Layout>
      <header className="app-header" role="banner">
        <div className="app-header__intro">
          <h1>Catálogo HQ</h1>
          <p>
            Visualize e gerencie sua coleção de HQs com autenticação segura, upload de capas e interface otimizada para
            acessibilidade e Core Web Vitals.
          </p>
        </div>
        <AuthPanel />
      </header>
      <main className="app-main" id="conteudo-principal" aria-live="polite">
        <section className="list-section" aria-label="Listagem de itens">
          <SearchBar
            filters={filters}
            categories={publishers}
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
        <section className="details-section" aria-label="Detalhes do item selecionado">
          <ItemDetail item={selectedItem} isLoading={status.state === 'loading'} />
          {isAuthenticated ? (
            <ItemForm onSubmit={handleCreateItem} isSubmitting={status.state === 'loading'} />
          ) : (
            <div className="form-placeholder" role="note">
              <h3>Faça login para cadastrar novas HQs</h3>
              <p>Autentique-se para liberar o formulário de cadastro e manter o catálogo sempre atualizado.</p>
            </div>
          )}
        </section>
      </main>
      <Feedback status={status} />
    </Layout>
  );
}

export default App;
