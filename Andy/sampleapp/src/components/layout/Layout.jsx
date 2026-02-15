import Sidebar from './Sidebar';
import Header from './Header';
import { useApp } from '../../context/AppContext';

const Layout = ({ children }) => {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Sidebar />
      <Header />
      <main
        className={`pt-16 transition-all duration-200 ${
          sidebarCollapsed ? 'ml-[60px]' : 'ml-[240px]'
        }`}
      >
        <div className="p-6 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
