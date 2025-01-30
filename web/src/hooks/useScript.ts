import { useEffect } from 'react';

function useScript(src: string): boolean {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [src]);

  return true;
}

export default useScript; 