import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnimation } from '@/hooks/useAnimation';

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const { play } = useAnimation(`page-transition-${location.pathname}`, {
    duration: 300,
    easing: 'easeInOutCubic',
  });

  useEffect(() => {
    play();
  }, [location.pathname, play]);

  return (
    <div
      className="transition-opacity duration-300 ease-in-out"
      style={{
        opacity: 0,
        animation: 'fadeIn 300ms ease-in-out forwards',
      }}
    >
      {children}
    </div>
  );
}