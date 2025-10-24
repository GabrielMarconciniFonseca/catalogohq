import { useEffect, useState } from 'react';
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
import CategoryFilter from './components/CategoryFilter';
import { useAuth } from './context/AuthContext.jsx';
import { useCategoryFilters } from './hooks/useCategoryFilters.js';
import {
  createItem,
  fetchItemById,
  fetchItems,
  updateItemStatus,
} from './services/api.js';
import { ensureArray, SAFE_INITIAL_STATES } from './utils/arrayHelpers.js';
import './styles/App.css';

const DEFAULT_FILTERS = SAFE_INITIAL_STATES.filters;

function App() {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState(SAFE_INITIAL_STATES.items);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentEditingItem, setCurrentEditingItem] = useState(null);
  const [status, setStatus] = useState(SAFE_INITIAL_STATES.status);
  const [error, setError] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Hook customizado para gerenciar filtros e itens filtrados
  const {
    filters,
    filteredItems,
    categories,
    publishers,
    seriesOptions,
    updateFilters,
    updateFilter,
    filteredCount,
  } = useCategoryFilters(items);

  useEffect(() => {
    console.log('APP INIT useEffect called');
    const loadItems = async () => {
      setStatus({ state: 'loading', message: 'Carregando itens...' });
      try {
        const data = await fetchItems();
        
      // Garantir que data seja sempre um array
      const safeData = ensureArray(data, 'handleSaveItem fetchItems response');
      
      // TEMPORÁRIO: Adicionar datas e ratings aos itens para testar o overlay e as estrelas
      const dataWithDates = safeData.map((item, index) => ({
        ...item,
        purchaseDate: new Date(2024, 9, 14 + index).toISOString(), // Datas variadas
        rating: 4.5 + (index * 0.3) // Ratings variados: 4.5, 4.8, 5.1 (normalizado para 5.0)...
      }));
      
      setItems(dataWithDates);
      setError(null);
        setStatus({ state: 'success', message: 'Itens carregados com sucesso.' });
      } catch (err) {
        console.error('Erro ao carregar itens:', err);
        setError(err);
        setItems([]); // Garantir array vazio em caso de erro
        setStatus({ state: 'error', message: 'Não foi possível carregar os itens.' });
      }
    };

    loadItems();
  }, []);

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
      
      // Garantir que items seja sempre um array antes de atualizar
      setItems((prev) => {
        const safePrev = ensureArray(prev, 'handleCreateItem previous state');
        return [newItem, ...safePrev];
      });
      
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
      
      // Garantir que items seja sempre um array antes de atualizar
      setItems((prev) => {
        const safePrev = ensureArray(prev, 'handleStatusChange previous state');
        return safePrev.map((item) => (item.id === updated.id ? updated : item));
      });
      
      setSelectedItem(updated);
      setError(null);
      setStatus({ state: 'success', message: 'Status atualizado com sucesso.' });
    } catch (err) {
      setError(err);
      setStatus({ state: 'error', message: err.message ?? 'Não foi possível atualizar o status.' });
    }
  };

  // Usar a função do hook para atualizar filtros
  const handleFilterChange = updateFilters;

  const handleSaveItem = async (itemData) => {
    setStatus({ state: 'loading', message: 'Salvando item...' });
    try {
      await createItem(itemData);
      const data = await fetchItems();
      
      // Garantir que data seja sempre um array
      const safeData = ensureArray(data, 'fetchItems response');
      setItems(safeData);
      
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
                <CategoryFilter 
                  activeFilter={filters.status}
                  categories={categories}
                  onFilterChange={(filterId) => handleFilterChange({ status: filterId })}
                />
              </div>
              <div className="app-content">
                <div className="app-content__header">
                  <p className="results-count">
                    {filteredCount} HQs encontradas
                  </p>
                  <button
                    type="button"
                    className="btn btn--primary btn--add-hq"
                    onClick={handleFormOpen}
                    title="Adicionar nova HQ"
                    aria-label="Adicionar nova HQ"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 2V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M2 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Adicionar HQ
                  </button>
                </div>
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
            {/* Botão FAB antigo - pode ser removido após validação do novo layout */}
            {/* <button
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
            </button> */}
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
