import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';

/**
 * Componente otimizado de imagem com lazy loading, resposta responsiva e fallback
 * @component
 * @example
 * // Uso básico
 * <OptimizedImage
 *   src="https://example.com/image.jpg"
 *   alt="Descrição"
 *   width={346}
 *   height={519}
 * />
 */
export function OptimizedImage({
  src,
  alt,
  width = 346,
  height = 519,
  className = '',
  onLoad = null,
  onError = null,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Usar Intersection Observer para lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const dataSrc = img.dataset.src;
            if (dataSrc && !img.src) {
              img.src = dataSrc;
            }
            observer.unobserve(img);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    observer.observe(img);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLoad = () => {
    setImageLoaded(true);
    img?.classList.add('image-loaded');
    img?.classList.remove('image-loading');
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    img?.classList.add('image-error');
    onError?.();
  };

  if (!src) {
    return (
      <div
        className={`optimized-image optimized-image--fallback ${className}`}
        style={{ width, height }}
      >
        <span>Sem imagem</span>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      data-src={src}
      src={`${src}?size=small`}
      alt={alt}
      width={width}
      height={height}
      className={`optimized-image image-loading ${className} ${
        imageLoaded ? 'image-loaded' : ''
      } ${imageError ? 'image-error' : ''}`}
      loading="lazy"
      onLoad={handleLoad}
      onError={handleError}
      style={{
        display: imageError ? 'none' : 'block',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
  );
}

OptimizedImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
};

export default OptimizedImage;
