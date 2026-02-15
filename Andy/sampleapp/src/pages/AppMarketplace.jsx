import { useState } from 'react';
import { Search, Star, Download, Check } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import mockAppsData from '../data/mockApps.json';

const AppMarketplace = () => {
  const [apps, setApps] = useState(mockAppsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);

  const categories = ['All', 'Productivity', 'Multimedia', 'Utilities', 'Security', 'Development', 'Communication'];

  const handleInstall = (appId) => {
    setApps(prev =>
      prev.map(app =>
        app.id === appId ? { ...app, installed: !app.installed } : app
      )
    );
    if (selectedApp?.id === appId) {
      setSelectedApp(prev => ({ ...prev, installed: !prev.installed }));
    }
  };

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">App Marketplace</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">Discover and install apps to enhance your system</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          placeholder="Search apps..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-neutral-200 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map(app => (
          <Card
            key={app.id}
            hover
            onClick={() => setSelectedApp(app)}
            className="relative"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-soft flex items-center justify-center text-3xl flex-shrink-0">
                {app.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-neutral-900 dark:text-white truncate">{app.name}</h3>
                  {app.installed && (
                    <Check className="w-5 h-5 text-success-600 flex-shrink-0" />
                  )}
                </div>
                <Badge variant="default" size="small" className="mt-1">
                  {app.category}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3 line-clamp-2">{app.description}</p>

            <div className="flex items-center gap-4 mt-4 text-xs text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-warning-500 text-warning-500" />
                <span>{app.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                <span>{app.downloads}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-600">
              <Button
                variant={app.installed ? 'secondary' : 'primary'}
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleInstall(app.id);
                }}
                className="w-full"
              >
                {app.installed ? 'Uninstall' : 'Install'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredApps.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-500 dark:text-neutral-400">No apps found matching your criteria.</p>
        </div>
      )}

      {/* App Details Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={selectedApp.name}
          size="large"
          footer={
            <Button
              variant={selectedApp.installed ? 'secondary' : 'primary'}
              onClick={() => handleInstall(selectedApp.id)}
            >
              {selectedApp.installed ? 'Uninstall' : 'Install'}
            </Button>
          }
        >
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-xl bg-gradient-soft flex items-center justify-center text-5xl flex-shrink-0">
                {selectedApp.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="primary">{selectedApp.category}</Badge>
                  {selectedApp.installed && <Badge variant="success" icon={Check}>Installed</Badge>}
                  {selectedApp.featured && <Badge variant="warning">Featured</Badge>}
                </div>
                <p className="text-neutral-700 dark:text-neutral-300">{selectedApp.description}</p>

                <div className="flex items-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-warning-500 text-warning-500" />
                    <span className="font-medium text-neutral-900 dark:text-white">{selectedApp.rating}</span>
                    <span className="text-neutral-500 dark:text-neutral-400">Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                    <span className="font-medium text-neutral-900 dark:text-white">{selectedApp.downloads}</span>
                    <span className="text-neutral-500 dark:text-neutral-400">Downloads</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg text-sm">
              <div>
                <span className="text-neutral-600 dark:text-neutral-400">Publisher:</span>
                <p className="font-medium text-neutral-900 dark:text-white">{selectedApp.publisher}</p>
              </div>
              <div>
                <span className="text-neutral-600 dark:text-neutral-400">Last Updated:</span>
                <p className="font-medium text-neutral-900 dark:text-white">{selectedApp.updated}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">About this app</h4>
              <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
                {selectedApp.description}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AppMarketplace;
