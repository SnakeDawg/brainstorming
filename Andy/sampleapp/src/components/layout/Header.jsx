import { Bell, Settings, Search, Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Header = () => {
  const { sidebarCollapsed, theme, toggleTheme } = useApp();

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 z-20 flex items-center justify-between px-6 transition-all duration-200 ${
        sidebarCollapsed ? 'left-[60px]' : 'left-[240px]'
      }`}
    >
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
          <input
            type="text"
            placeholder="Search for apps, settings, or ask AI..."
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 ml-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
          ) : (
            <Sun className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
          )}
        </button>
        <button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors relative">
          <Bell className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full"></span>
        </button>
        <button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
          <Settings className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
        </button>
      </div>
    </header>
  );
};

export default Header;
