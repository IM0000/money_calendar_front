import { useAuthStore } from '@/zustand/useAuthStore';
import Footer from './Footer';
import Header from './Header';
import Section from './Section';
import { useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Section>{children}</Section>
      <Footer />
    </div>
  );
}
