import Footer from './Footer';
import Header from './Header';
import Section from './Section';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Section>{children}</Section>
      <Footer />
    </div>
  );
}
