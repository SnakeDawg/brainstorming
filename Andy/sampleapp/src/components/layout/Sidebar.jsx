import { NavLink } from 'react-router-dom';
import {
  Home,
  MessageSquare,
  Store,
  Zap,
  Shield,
  Download,
  HelpCircle,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useApp();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/assistant', icon: MessageSquare, label: 'Personal Assistant' },
    { path: '/marketplace', icon: Store, label: 'App Marketplace' },
    { path: '/system-optimization', icon: Zap, label: 'System Optimization' },
    { path: '/security', icon: Shield, label: 'Security' },
    { path: '/device-updates', icon: Download, label: 'Device Updates' },
    { path: '/support', icon: HelpCircle, label: 'Support' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 transition-all duration-200 z-30 flex flex-col ${
        sidebarCollapsed ? 'w-[60px]' : 'w-[240px]'
      }`}
    >
      {/* Logo/Title */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-700">
        {!sidebarCollapsed && (
          <h1 className="text-lg font-bold text-primary-600 dark:text-primary-400">AI System Manager</h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors ml-auto"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 mb-1 transition-colors relative group ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:text-primary-600 dark:hover:text-primary-400'
                }
                ${sidebarCollapsed ? 'justify-center' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 dark:bg-primary-400 rounded-r" />
                  )}
                  <Icon className={`w-5 h-5 ${sidebarCollapsed ? '' : 'mr-3'} flex-shrink-0`} />
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-neutral-800 dark:bg-neutral-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info */}
      <div className={`border-t border-neutral-200 dark:border-neutral-700 p-4 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold">
            DU
          </div>
          <div className="ml-3 flex-1 overflow-hidden">
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">Demo User</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">demo@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
