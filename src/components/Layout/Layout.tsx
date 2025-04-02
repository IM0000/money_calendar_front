import Footer from './Footer';
import Header from './Header';
import Section from './Section';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Section>{children}</Section>
      <Footer />
    </div>
  );
}
