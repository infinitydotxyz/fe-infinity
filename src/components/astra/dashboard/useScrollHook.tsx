import { useEffect, useRef, useState, useCallback, MutableRefObject } from 'react';

// Small hook to use ResizeOberver if available. This fixes some issues when the component is resized.
// This needs a polyfill to work on all browsers. The polyfill is not included in order to keep the package light.
const useResizeObserver = (
  ref: MutableRefObject<HTMLElement | undefined>,
  callback: (rect: DOMRectReadOnly) => void
) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ResizeObserver) {
      const resizeObserver = new ResizeObserver((entries) => {
        // Wrap it in requestAnimationFrame to avoid this error - ResizeObserver loop limit exceeded
        window.requestAnimationFrame(() => {
          if (!Array.isArray(entries) || !entries.length) {
            return;
          }
          callback(entries[0].contentRect);
        });
      });

      if (ref.current) {
        resizeObserver.observe(ref.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [ref]);
};

export const useScrollInfo = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const ref = useRef<HTMLElement>();

  useResizeObserver(ref, () => {
    update();
  });

  function update() {
    const element = ref.current;

    if (element) {
      setScrollTop(element.scrollTop);
    }
  }

  const setRef = useCallback((node) => {
    if (node) {
      // When the ref is first set (after mounting)
      node.addEventListener('scroll', update);

      if (!window.ResizeObserver) {
        window.addEventListener('resize', update); // Fallback if ResizeObserver is not available
      }
      ref.current = node;

      update(); // initialization
    } else if (ref.current) {
      // When unmounting
      ref.current.removeEventListener('scroll', update);
      if (!window.ResizeObserver) {
        window.removeEventListener('resize', update);
      }
    }

    return ref;
  }, []);

  return { scrollTop, setRef, ref };
};
