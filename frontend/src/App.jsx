import { useEffect, useMemo, useState } from 'react';
import AuthPanel from './components/AuthPanel.jsx';
import Feedback from './components/Feedback.jsx';
import ImportCsvForm from './components/ImportCsvForm.jsx';
import ItemDetail from './components/ItemDetail.jsx';
import ItemForm from './components/ItemForm.jsx';
import ItemList from './components/ItemList.jsx';
import Layout from './components/Layout.jsx';
import SearchBar from './components/SearchBar.jsx';
import { useAuth } from './context/AuthContext.jsx';
import {
  createItem,
  fetchItemById,
  fetchItems,
  importItemsCsv,
  updateItemStatus,
} from './services/api.js';
import './styles/App.css';

const DEFAULT_FILTERS = {
  term: '',
  publisher: 'todos',
  series: 'todas',
  status: 'todos',
  tags: '',
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

  const seriesOptions = useMemo(() => {
    const uniqueSeries = new Set(items.map((item) => item.series ?? 'Outras séries'));
    return ['todas', ...Array.from(uniqueSeries)];
  }, [items]);

  const activeFilterTags = useMemo(() => {
    if (!filters.tags.trim()) {
      return [];
    }
    return filters.tags
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
  }, [filters.tags]);

  const filteredItems = useMemo(() => {
    const term = filters.term.trim().toLowerCase();
    return items.filter((item) => {
      const matchesTerm =
        !term ||
        item.title.toLowerCase().includes(term) ||
        (item.series ?? '').toLowerCase().includes(term) ||
        (item.publisher ?? '').toLowerCase().includes(term) ||
        (item.location ?? '').toLowerCase().includes(term) ||
        (item.description ?? '').toLowerCase().includes(term) ||
        (item.tags ?? []).some((tag) => tag.toLowerCase().includes(term));

      const publisherLabel = item.publisher ?? 'Outros';
      const matchesPublisher =
        filters.publisher === 'todos' || publisherLabel === filters.publisher;

      const seriesLabel = item.series ?? 'Outras séries';
      const matchesSeries = filters.series === 'todas' || seriesLabel === filters.series;

      const matchesStatus = filters.status === 'todos' || item.status === filters.status;

      const matchesTags =
        !activeFilterTags.length ||
        activeFilterTags.every((tag) => (item.tags ?? []).some((itemTag) => itemTag.toLowerCase().includes(tag)));

      return matchesTerm && matchesPublisher && matchesSeries && matchesStatus && matchesTags;
    });
  }, [items, filters, activeFilterTags]);

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
      setStatus({ state: 'loading', message: 'Salvando edição...' });
      const newItem = await createItem(formData);
      setItems((prev) => [newItem, ...prev]);
      setSelectedItem(newItem);
      setError(null);
      setStatus({ state: 'success', message: 'Edição cadastrada com sucesso!' });
    } catch (err) {
      setError(err);
      setStatus({ state: 'error', message: err.message ?? 'Erro ao salvar edição.' });
      throw err;
    }
  };

  const handleImportCsv = async (file) => {
    try {
      setStatus({ state: 'loading', message: 'Importando arquivo CSV...' });
      const importedItems = await importItemsCsv(file);
      setItems((prev) => [...importedItems, ...prev]);
      setError(null);
      setStatus({ state: 'success', message: 'Importação concluída com sucesso!' });
    } catch (err) {
      setError(err);
      setStatus({ state: 'error', message: err.message ?? 'Não foi possível importar o CSV.' });
      throw err;
    }
  };

  const handleStatusChange = async (itemId, nextStatus) => {
    try {
      setStatus({ state: 'loading', message: 'Atualizando status...' });
      const updated = await updateItemStatus(itemId, nextStatus);
      setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setSelectedItem(updated);
      setError(null);
      setStatus({ state: 'success', message: 'Status atualizado com sucesso.' });
    } catch (err) {
      setError(err);
      setStatus({ state: 'error', message: err.message ?? 'Não foi possível atualizar o status.' });
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
            Visualize e gerencie sua coleção de HQs com autenticação segura, upload de capas, importação CSV e interface otimizada
            para acessibilidade e Core Web Vitals.
          </p>
        </div>
        <AuthPanel />
      </header>
      <main className="app-main" id="conteudo-principal" aria-live="polite">
        <section className="list-section" aria-label="Listagem de itens">
          <SearchBar
            filters={filters}
            publishers={publishers}
            seriesOptions={seriesOptions}
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
          <ItemDetail
            item={selectedItem}
            isLoading={status.state === 'loading'}
            onUpdateStatus={isAuthenticated ? handleStatusChange : null}
          />
          {isAuthenticated ? (
            <div className="forms-stack">
              <ItemForm onSubmit={handleCreateItem} isSubmitting={status.state === 'loading'} />
              <ImportCsvForm onImport={handleImportCsv} isImporting={status.state === 'loading'} />
            </div>
          ) : (
            <div className="form-placeholder" role="note">
              <h3>Faça login para cadastrar novas HQs</h3>
              <p>
                Autentique-se para liberar o formulário de cadastro, importar planilhas CSV e manter o catálogo sempre atualizado.
              </p>
            </div>
          )}
        </section>
      </main>
      <Feedback status={status} />
    </Layout>
  );
}

export default App;
