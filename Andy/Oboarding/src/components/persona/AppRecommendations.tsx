import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight, Search } from 'lucide-react';
import Button from '../shared/Button';
import Card from '../shared/Card';
import AppCard from './AppCard';
import { useSetup } from '../../contexts/SetupContext';
import { getRecommendedApps } from '../../utils/appRecommender';
import { useInstallationSimulator } from '../../hooks/useInstallationSimulator';
import { App } from '../../types/apps';

const AppRecommendations: React.FC = () => {
  const { state, dispatch } = useSetup();
  const { startInstallation } = useInstallationSimulator();
  const [recommendedApps, setRecommendedApps] = useState<App[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Gaming', 'Productivity', 'Communication', 'Development', 'Creative', 'Utilities', 'Entertainment', 'Security'];

  useEffect(() => {
    if (state.detectedPersona) {
      const apps = getRecommendedApps(
        state.detectedPersona.persona,
        state.detectedPersona.secondaryPersona
      );
      console.log('Recommended apps for persona:', state.detectedPersona.persona, apps);
      setRecommendedApps(apps);

      // Pre-select top 5 recommended apps
      const topApps = apps.slice(0, 5);
      dispatch({ type: 'SET_SELECTED_APPS', payload: topApps });
    }
  }, [state.detectedPersona, dispatch]);

  const handleToggleApp = (app: App) => {
    dispatch({ type: 'TOGGLE_APP', payload: app });
  };

  const handleContinue = () => {
    // Start simulated installation
    if (state.selectedApps.length > 0) {
      startInstallation(state.selectedApps);
    }
    dispatch({ type: 'SET_PHASE', payload: 'device-detection' });
  };

  const filteredApps = recommendedApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalSize = state.selectedApps.reduce((acc, app) => {
    const sizeNum = parseFloat(app.size);
    return acc + sizeNum;
  }, 0);

  const totalTime = state.selectedApps.reduce((acc, app) => {
    return acc + app.installTime;
  }, 0);
  const totalTimeMinutes = Math.ceil(totalTime / 60);

  return (
    <div className="h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div
          className="text-center mb-8"
         
         
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recommended Apps for You</h1>
          <p className="text-lg text-gray-600">
            Based on your {state.detectedPersona?.persona} profile, here are apps we think you'll need
          </p>
        </div>

        {/* Summary Card */}
        <div
         
         
         
          className="mb-6"
        >
          <Card variant="elevated" padding="md">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-gray-600">Selected Apps</p>
                  <p className="text-2xl font-bold text-gray-900">{state.selectedApps.length}</p>
                </div>
                <div className="h-12 w-px bg-gray-200" />
                <div>
                  <p className="text-sm text-gray-600">Total Size</p>
                  <p className="text-2xl font-bold text-gray-900">{totalSize.toFixed(1)} GB</p>
                </div>
                <div className="h-12 w-px bg-gray-200" />
                <div>
                  <p className="text-sm text-gray-600">Install Time</p>
                  <p className="text-2xl font-bold text-gray-900">~{totalTimeMinutes} min</p>
                </div>
              </div>
              <Button
                onClick={handleContinue}
                size="lg"
                rightIcon={<ChevronRight className="w-5 h-5" />}
                disabled={state.selectedApps.length === 0}
              >
                Continue Setup
              </Button>
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <div
          className="mb-6 flex flex-col sm:flex-row gap-4"
         
         
         
        >
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category === 'all' ? 'All Apps' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Apps Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
         
         
         
        >
          <AnimatePresence mode="popLayout">
            {filteredApps.map((app) => (
              <div
                key={app.id}
               
               
               
               
              >
                <AppCard
                  app={app}
                  isSelected={state.selectedApps.some(a => a.id === app.id)}
                  onToggle={() => handleToggleApp(app)}
                />
              </div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {filteredApps.length === 0 && (
          <div
            className="text-center py-12"
           
           
          >
            <p className="text-gray-600">No apps found matching your criteria</p>
            <Button
              variant="ghost"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Footer Note */}
        <motion.p
          className="text-center text-sm text-gray-500 mt-8"
         
         
         
        >
          You can always install more apps later from the Microsoft Store or web
        </motion.p>
        </div>
      </div>
    </div>
  );
};

export default AppRecommendations;
