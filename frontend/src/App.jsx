import { useEffect, useMemo, useState } from 'react';
import ModalAuth from './components/ModalAuth';
import ModalForm from './components/ModalForm';
import Feedback from './components/Feedback';
import FeaturesSection from './components/FeaturesSection';
import HeroSection from './components/HeroSection';
import HowItWorksSection from './components/HowItWorksSection';
import ItemDetail from './components/ItemDetail';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';
import Layout from './components/Layout';
import SearchBar from './components/SearchBar';
import Button from './components/Button';
import { useAuth } from './context/AuthContext.jsx';
import {
  createItem,
  fetchItemById,
  fetchItems,
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
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentEditingItem, setCurrentEditingItem] = useState(null);
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [error, setError] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  useEffect(() => {
    console.log('APP INIT useEffect called');
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

  const handleSaveItem = async (itemData) => {
    setStatus({ state: 'loading', message: 'Salvando item...' });
    try {
      await createItem(itemData);
      const data = await fetchItems();
      setItems(data);
      setCurrentEditingItem(null);
      setStatus({ state: 'success', message: 'Item salvo com sucesso.' });
    } catch (err) {
      setError(err);
      setStatus({ state: 'error', message: err.message ?? 'Não foi possível salvar o item.' });
    }
  };

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthClose = () => {
    setIsAuthModalOpen(false);
  };

  const handleFormOpen = () => {
    console.log('handleFormOpen WORKING');
    setIsFormModalOpen(true);
  };

  const handleFormClose = () => {
    setIsFormModalOpen(false);
    setCurrentEditingItem(null);
  };

  const handleFormSubmit = async (itemData) => {
    await handleSaveItem(itemData);
    setIsFormModalOpen(false);
  };

  const layoutHeaderSearch = isAuthenticated ? (
    <SearchBar
      filters={filters}
      onChange={handleFilterChange}
      isLoading={status.state === 'loading'}
    />
  ) : null;

  const layoutHeaderActions = null;

  return (
    <Layout 
      onLoginClick={handleLoginClick}
      isAuthenticated={isAuthenticated}
      userName={user?.fullName || user?.username || ''}
      headerSearchContent={layoutHeaderSearch}
      headerActionsContent={layoutHeaderActions}
    >
      <div className="app">
        {isAuthenticated ? (
          <>
            <main className="app-main" id="conteudo-principal">
              <div className="app-filters">
                <div className="filter-tabs">
                  <button 
                    type="button" 
                    className={`filter-tab ${filters.status === 'todos' ? 'filter-tab--active' : ''}`}
                    onClick={() => handleFilterChange({ status: 'todos' })}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="2" y="2" width="4.67" height="4.67" fill="currentColor"/>
                      <rect x="9.33" y="2" width="4.67" height="4.67" fill="currentColor"/>
                      <rect x="9.33" y="9.33" width="4.67" height="4.67" fill="currentColor"/>
                      <rect x="2" y="9.33" width="4.67" height="4.67" fill="currentColor"/>
                    </svg>
                    Todas ({items.length})
                  </button>
                  <button 
                    type="button" 
                    className={`filter-tab ${filters.status === 'OWNED' ? 'filter-tab--active' : ''}`}
                    onClick={() => handleFilterChange({ status: 'OWNED' })}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6.67 1.33H4M2.67 1.33H13.33V13.33" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round"/>
                    </svg>
                    Coleção ({items.filter(item => item.status === 'OWNED').length})
                  </button>
                  <button 
                    type="button" 
                    className={`filter-tab ${filters.status === 'WISHLIST' ? 'filter-tab--active' : ''}`}
                    onClick={() => handleFilterChange({ status: 'WISHLIST' })}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M1.33 2.66L13.33 11.34" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round"/>
                    </svg>
                    Wishlist ({items.filter(item => item.status === 'WISHLIST').length})
                  </button>
                  <button 
                    type="button" 
                    className={`filter-tab ${filters.status === 'READING' ? 'filter-tab--active' : ''}`}
                    onClick={() => handleFilterChange({ status: 'READING' })}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 4.67V9.33M1.33 2V12" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round"/>
                    </svg>
                    Lendo ({items.filter(item => item.status === 'READING').length})
                  </button>
                  <button 
                    type="button" 
                    className={`filter-tab ${filters.status === 'COMPLETED' ? 'filter-tab--active' : ''}`}
                    onClick={() => handleFilterChange({ status: 'COMPLETED' })}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M1.33 1.33L13.33 13.33M6 6.67L4 2.67" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round"/>
                    </svg>
                    Completos ({items.filter(item => item.status === 'COMPLETED').length})
                  </button>
                </div>
              </div>
              <div className="app-content">
                <p className="results-count">
                  {filteredItems.length} HQs encontradas
                </p>
                <ItemList
                  items={filteredItems}
                  onSelectItem={handleSelectItem}
                  isLoading={status.state === 'loading' && !selectedItem}
                  error={error}
                />
              </div>
            </main>
            {selectedItem && (
              <ItemDetail
                item={selectedItem}
                isLoading={status.state === 'loading'}
                onUpdateStatus={isAuthenticated ? handleStatusChange : null}
              />
            )}
            <button
              type="button"
              className="btn btn--fab btn--fab"
              onClick={handleFormOpen}
              title="Adicionar nova HQ"
              aria-label="Adicionar nova HQ"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        ) : (
          <div className="app-login">
            <HeroSection onGetStarted={() => setIsAuthModalOpen(true)} />
            <FeaturesSection />
            <HowItWorksSection />

            <ModalAuth isOpen={isAuthModalOpen} onClose={handleAuthClose} />
          </div>
        )}
        <Feedback status={status} />
        <ModalForm 
          isOpen={isFormModalOpen} 
          onClose={handleFormClose} 
          onSubmit={handleFormSubmit}
          isSubmitting={status.state === 'loading'}
        />
      </div>
    </Layout>
  );
}

export default App;
