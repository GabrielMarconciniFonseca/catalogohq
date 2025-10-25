import PropTypes from "prop-types";
import "./ItemDetailTabs.css";

const TABS = [
  { id: "info", label: "Informações" },
  { id: "notes", label: "Notas" },
  { id: "history", label: "Histórico" },
];

function ItemDetailTabs({ currentTab, onTabChange, item }) {
  return (
    <div className="item-detail-tabs">
      {/* Tab Navigation */}
      <div className="item-detail-tabs__nav" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={currentTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            className={`item-detail-tabs__button ${
              currentTab === tab.id ? "item-detail-tabs__button--active" : ""
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="item-detail-tabs__content">
        {/* Info Tab */}
        {currentTab === "info" && (
          <div
            id="panel-info"
            role="tabpanel"
            className="item-detail-tabs__panel"
          >
            <div className="item-detail-tabs__section">
              <h4 className="item-detail-tabs__heading">Sinopse</h4>
              <p className="item-detail-tabs__text">
                {item.description || "Sem descrição disponível."}
              </p>
            </div>

            {item.tags && item.tags.length > 0 && (
              <div className="item-detail-tabs__section">
                <h4 className="item-detail-tabs__heading">Tags</h4>
                <div className="item-detail-tabs__tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="item-detail-tabs__tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notes Tab */}
        {currentTab === "notes" && (
          <div
            id="panel-notes"
            role="tabpanel"
            className="item-detail-tabs__panel"
          >
            <div className="item-detail-tabs__section">
              <p className="item-detail-tabs__placeholder">
                {item.notes || "Nenhuma nota adicionada."}
              </p>
            </div>
          </div>
        )}

        {/* History Tab */}
        {currentTab === "history" && (
          <div
            id="panel-history"
            role="tabpanel"
            className="item-detail-tabs__panel"
          >
            <div className="item-detail-tabs__section">
              <p className="item-detail-tabs__placeholder">
                Histórico de alterações será exibido aqui.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

ItemDetailTabs.propTypes = {
  currentTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  item: PropTypes.shape({
    description: PropTypes.string,
    notes: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ItemDetailTabs;
