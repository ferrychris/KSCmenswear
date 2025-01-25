import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNavigation } from '../mobile/MobileNavigation';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <MobileNavigation />
    </div>
  );
}