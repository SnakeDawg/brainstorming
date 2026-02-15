import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ProgressBar from '../components/common/ProgressBar';
import Badge from '../components/common/Badge';
import { HardDrive, Zap, Trash2, Power, Settings } from 'lucide-react';

const SystemOptimization = () => {
  const location = useLocation();
  const [storageData, setStorageData] = useState({
    total: 1000,
    used: 650,
    junkFiles: 12.5,
    tempFiles: 8.3,
    duplicates: 4.2
  });

  const [startupApps, setStartupApps] = useState([
    { id: 1, name: 'Microsoft Teams', impact: 'High', enabled: true },
    { id: 2, name: 'Spotify', impact: 'Medium', enabled: true },
    { id: 3, name: 'Adobe Creative Cloud', impact: 'High', enabled: false },
    { id: 4, name: 'Discord', impact: 'Medium', enabled: true },
    { id: 5, name: 'Steam', impact: 'Low', enabled: false },
  ]);

  const [performanceMode, setPerformanceMode] = useState('balanced');
  const [cleaning, setCleaning] = useState(false);

  const handleCleanup = (recommendationId = null) => {
    setCleaning(true);
    setTimeout(() => {
      setStorageData(prev => ({
        ...prev,
        used: prev.used - prev.junkFiles - prev.tempFiles - prev.duplicates,
        junkFiles: 0,
        tempFiles: 0,
        duplicates: 0
      }));
      setCleaning(false);

      // Signal completion to home page if triggered from recommendation
      if (recommendationId) {
        localStorage.setItem('completedRecommendation', recommendationId);
      }
    }, 2000);
  };

  const toggleStartupApp = (id) => {
    setStartupApps(prev =>
      prev.map(app =>
        app.id === id ? { ...app, enabled: !app.enabled } : app
      )
    );
  };

  const getImpactBadge = (impact) => {
    const variants = {
      High: 'error',
      Medium: 'warning',
      Low: 'success'
    };
    return <Badge variant={variants[impact]} size="small">{impact} Impact</Badge>;
  };

  // Auto-trigger cleanup when navigated from home page
  useEffect(() => {
    if (location.state?.autoTrigger && location.state?.action === 'Clean Up') {
      setTimeout(() => handleCleanup(location.state?.recommendationId), 500);
    }
  }, [location.state]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">System Optimization</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">Optimize performance and clean up your system</p>
      </div>

      {/* Storage Optimizer */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Storage Optimizer</h2>
          </div>
          <Button
            onClick={handleCleanup}
            loading={cleaning}
            disabled={storageData.junkFiles + storageData.tempFiles + storageData.duplicates === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clean Up
          </Button>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-neutral-600 dark:text-neutral-400">Storage Usage</span>
            <span className="font-semibold text-neutral-900 dark:text-white">{storageData.used} GB / {storageData.total} GB</span>
          </div>
          <ProgressBar
            value={(storageData.used / storageData.total) * 100}
            max={100}
            variant={(storageData.used / storageData.total) * 100 > 80 ? 'error' : 'primary'}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Junk Files</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">{storageData.junkFiles} GB</p>
          </div>
          <div className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Temporary Files</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">{storageData.tempFiles} GB</p>
          </div>
          <div className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Duplicate Files</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">{storageData.duplicates} GB</p>
          </div>
        </div>
      </Card>

      {/* Startup Manager */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Power className="w-5 h-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Startup Programs</h2>
        </div>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          Manage which programs start automatically when you boot your PC
        </p>

        <div className="space-y-3">
          {startupApps.map(app => (
            <div
              key={app.id}
              className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white dark:bg-neutral-600 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">{app.name}</p>
                  {getImpactBadge(app.impact)}
                </div>
              </div>
              <button
                onClick={() => toggleStartupApp(app.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  app.enabled ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    app.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Performance Mode */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Performance Mode</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['power-saver', 'balanced', 'performance'].map(mode => (
            <button
              key={mode}
              onClick={() => setPerformanceMode(mode)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                performanceMode === mode
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30'
                  : 'border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-neutral-900 dark:text-white capitalize">
                  {mode.replace('-', ' ')}
                </h3>
                {performanceMode === mode && (
                  <div className="w-3 h-3 rounded-full bg-primary-600"></div>
                )}
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {mode === 'power-saver' && 'Extend battery life, reduce performance'}
                {mode === 'balanced' && 'Balance performance and battery life'}
                {mode === 'performance' && 'Maximum performance, higher power usage'}
              </p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SystemOptimization;
