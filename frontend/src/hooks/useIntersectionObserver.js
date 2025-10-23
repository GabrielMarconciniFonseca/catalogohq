import { useEffect, useRef, useCallback } from "react";

/**
 * Hook customizado para Intersection Observer
 * Carrega imagens quando ficam visíveis na tela
 */
export function useIntersectionObserver(options = {}) {
  const observerRef = useRef(null);

  const defaultOptions = {
    threshold: 0.1,
    rootMargin: "50px",
    ...options,
  };

  const observe = useCallback((element) => {
    if (observerRef.current && element) {
      observerRef.current.observe(element);
    }
  }, []);

  const unobserve = useCallback((element) => {
    if (observerRef.current && element) {
      observerRef.current.unobserve(element);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;

          if (src && img.src !== src) {
            img.src = src;
            img.classList.add("image-loaded");
            img.classList.remove("image-loading");
          }

          observerRef.current.unobserve(img);
        }
      });
    }, defaultOptions);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [defaultOptions]);

  return { observe, unobserve, disconnect };
}

/**
 * Hook para gerar URLs otimizadas de imagem
 * Suporta múltiplos tamanhos e formatos
 */
export function useOptimizedImage(imageUrl, defaultSize = "medium") {
  const getOptimizedUrl = useCallback(
    (url, size = defaultSize) => {
      if (!url) return null;

      const sizes = {
        small: 300,
        medium: 500,
        large: 800,
        xlarge: 1200,
      };

      const sizeValue = sizes[size] || sizes.medium;

      // Se for URL com query string
      if (url.includes("?")) {
        return `${url}&size=${sizeValue}`;
      }

      // Se for URL simples
      return `${url}?size=${sizeValue}`;
    },
    [defaultSize]
  );

  const srcSet = useCallback(
    (url) => {
      if (!url) return "";

      return `
        ${getOptimizedUrl(url, "small")} 300w,
        ${getOptimizedUrl(url, "medium")} 500w,
        ${getOptimizedUrl(url, "large")} 800w,
        ${getOptimizedUrl(url, "xlarge")} 1200w
      `.trim();
    },
    [getOptimizedUrl]
  );

  return { getOptimizedUrl, srcSet };
}
