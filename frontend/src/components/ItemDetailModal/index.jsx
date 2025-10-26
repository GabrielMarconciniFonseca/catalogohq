import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import ItemDetailTabs from "./ItemDetailTabs";
import ItemDetailActions from "./ItemDetailActions";
import CardRating from "../ComicCard/CardRating";
import "./ItemDetailModal.css";

const STATUS_BADGE_CONFIG = {
  OWNED: { text: "Na Coleção", bgColor: "#4C6EF5", textColor: "#FFFFFF" },
  WISHLIST: { text: "Na Wishlist", bgColor: "#E03131", textColor: "#FFFFFF" },
  ORDERED: { text: "Encomendado", bgColor: "#FF6B6B", textColor: "#FFFFFF" },
  LENT: { text: "Emprestado", bgColor: "#868E96", textColor: "#FFFFFF" },
  READING: { text: "Lendo", bgColor: "#FFD43B", textColor: "#212529" },
};

/**
 * Retorna o ícone SVG apropriado para cada status
 */
const getStatusIcon = (status) => {
  switch (status) {
    case "OWNED":
      return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M5 1L6.66667 1C7.33333 1 8 1 8 1"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M2 1L8 1C9.10457 1 10 1.89543 10 3V11H2V1Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "READING":
      return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M6 3.5V11"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M1 1.5C1 1.5 1 1.5 1 1.5L6 1.5C7.65685 1.5 9 2.34315 10 3.5V11H2V1.5H1Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "WISHLIST":
      return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M6 10.5L2 6.5C1 5.5 1 4 2 3C3 2 4.5 2 5.5 3L6 3.5L6.5 3C7.5 2 9 2 10 3C11 4 11 5.5 10 6.5L6 10.5Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "COMPLETED":
      return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
          <path
            d="M4 6L5.5 7.5L8 5"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "ORDERED":
    case "LENT":
    default:
      return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" fill="currentColor" />
        </svg>
      );
  }
};

function ItemDetailModal({
  isOpen,
  onClose,
  item,
  onEdit,
  onShare,
  isLoading,
}) {
  const dialogRef = useRef(null);
  const [currentTab, setCurrentTab] = useState("info");
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
      setIsExiting(false);
    } else if (!isOpen && dialog.open) {
      // Inicia animação de saída
      setIsExiting(true);
      setTimeout(() => {
        setIsExiting(false);
        dialog.close();
        document.body.style.overflow = "";
      }, 300); // Ajustado para 0.3s para coincidir com a animação
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) {
      handleCloseClick();
    }
  };

  const handleCloseClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      onClose();
    }, 300); // Ajustado para 0.3s para coincidir com a animação
  };

  const handleTabChange = (tabName) => {
    setCurrentTab(tabName);
  };

  if (isLoading && !item) {
    return (
      <dialog ref={dialogRef} className="item-detail-modal" aria-modal="true">
        <div className="item-detail-modal__loading">
          <p>Carregando detalhes...</p>
        </div>
      </dialog>
    );
  }

  if (!item) {
    return null;
  }

  const statusBadge = STATUS_BADGE_CONFIG[item.status] || {
    text: item.status,
    bgColor: "#868E96",
    textColor: "#FFFFFF",
  };

  const imageUrl = item.imageUrl?.startsWith("http")
    ? item.imageUrl
    : `${(
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"
      ).replace("/api", "")}${item.imageUrl}`;

  return (
    <dialog
      ref={dialogRef}
      className={`item-detail-modal${isExiting ? " modal-exit" : ""}`}
      onClick={handleBackdropClick}
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div className="item-detail-modal__content">
        {/* Header Section */}
        <div className="item-detail-modal__header">
          <h2 id="modal-title" className="item-detail-modal__title">
            {item.title}
          </h2>

          {/* Comic Preview Section */}
          <div className="item-detail-modal__preview">
            {/* Comic Image - LEFT */}
            {imageUrl && (
              <div className="item-detail-modal__image-container">
                <img
                  src={imageUrl}
                  alt={`Capa da HQ ${item.title}`}
                  className="item-detail-modal__image"
                  loading="lazy"
                />
              </div>
            )}

            {/* Info Container - RIGHT */}
            <div className="item-detail-modal__preview-container">
              {/* Status Badge */}
              <div 
                className="item-detail-modal__badge"
                style={{
                  backgroundColor: statusBadge.bgColor,
                  color: statusBadge.textColor
                }}
              >
                {getStatusIcon(item.status)}
                <span>{statusBadge.text}</span>
              </div>

              {/* Item Information */}
              <div className="item-detail-modal__info-container">
                <div className="item-detail-modal__info-item">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2 4H14V12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14H4C3.46957 14 2.96086 13.7893 2.58579 13.4142C2.21071 13.0391 2 12.5304 2 12V4Z"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    {item.series ? `${item.series} • ` : ""}Edição #
                    {item.issueNumber}
                  </span>
                </div>

                <div className="item-detail-modal__info-item">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8Z"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{item.publisher || "Não informada"}</span>
                </div>

                <div className="item-detail-modal__info-item">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M11 2H5C3.89543 2 3 2.89543 3 4V12C3 13.1046 3.89543 14 5 14H11C12.1046 14 13 13.1046 13 12V4C13 2.89543 12.1046 2 11 2Z"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    {item.language || "Não informado"} •{" "}
                    {item.year || item.publicationYear || "N/A"}
                  </span>
                </div>

                <div className="item-detail-modal__info-item">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2 8C2 4.13401 5.13401 1 9 1C12.866 1 16 4.13401 16 8C16 11.866 12.866 15 9 15C5.13401 15 2 11.866 2 8Z"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 4V8L12 10"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    Adicionado:{" "}
                    {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>

              {/* Rating Stars */}
              <div className="item-detail-modal__rating">
                <CardRating rating={item.rating || 0} />
                <span className="item-detail-modal__rating-text">
                  {(item.rating || 0).toFixed(1)} / 5.0
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <ItemDetailTabs
          currentTab={currentTab}
          onTabChange={handleTabChange}
          item={item}
        />

        {/* Action Buttons */}
        <ItemDetailActions
          onEdit={() => {
            onEdit?.(item);
            handleCloseClick();
          }}
          onShare={() => onShare?.(item)}
        />

        {/* Close Button */}
        <button
          type="button"
          className="item-detail-modal__close"
          onClick={handleCloseClick}
          aria-label="Fechar modal de detalhes"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </dialog>
  );
}

ItemDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    series: PropTypes.string,
    issueNumber: PropTypes.string,
    publisher: PropTypes.string,
    language: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    publicationYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rating: PropTypes.number,
    imageUrl: PropTypes.string,
    description: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.string,
    createdAt: PropTypes.string,
  }),
  onEdit: PropTypes.func,
  onShare: PropTypes.func,
  isLoading: PropTypes.bool,
};

ItemDetailModal.defaultProps = {
  onEdit: null,
  onShare: null,
  isLoading: false,
};

export default ItemDetailModal;
