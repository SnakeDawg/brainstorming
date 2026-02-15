import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ProgressBar from '../components/common/ProgressBar';
import { Download, CheckCircle, RefreshCw, Clock } from 'lucide-react';
import mockUpdatesData from '../data/mockUpdates.json';

const DeviceUpdates = () => {
  const location = useLocation();
  const [updates, setUpdates] = useState(mockUpdatesData);
  const [installing, setInstalling] = useState({});
  const [checking, setChecking] = useState(false);

  const handleInstall = (id, recommendationId = null) => {
    setInstalling(prev => ({ ...prev, [id]: 0 }));

    const interval = setInterval(() => {
      setInstalling(prev => {
        const progress = (prev[id] || 0) + 10;
        if (progress >= 100) {
          clearInterval(interval);
          setUpdates(prevUpdates =>
            prevUpdates.map(update =>
              update.id === id ? { ...update, installed: true } : update
            )
          );

          // Signal completion to home page if triggered from recommendation
          if (recommendationId) {
            localStorage.setItem('completedRecommendation', recommendationId);
          }

          return { ...prev, [id]: undefined };
        }
        return { ...prev, [id]: progress };
      });
    }, 300);
  };

  const handleCheckUpdates = () => {
    setChecking(true);
    setTimeout(() => setChecking(false), 2000);
  };

  // Auto-trigger action when navigated from home page
  useEffect(() => {
    if (location.state?.autoTrigger) {
      // Simulate clicking the first critical update
      const firstCriticalUpdate = updates.find(u => u.priority === 'critical' && !u.installed);
      if (firstCriticalUpdate) {
        setTimeout(() => handleInstall(firstCriticalUpdate.id, location.state?.recommendationId), 500);
      }
    }
  }, [location.state]);

  const getPriorityBadge = (priority) => {
    const variants = {
      critical: 'critical',
      recommended: 'recommended',
      optional: 'optional'
    };
    return <Badge variant={variants[priority]}>{priority}</Badge>;
  };

  const pendingUpdates = updates.filter(u => !u.installed);
  const installedUpdates = updates.filter(u => u.installed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Device Updates</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Keep your system up to date with the latest patches</p>
        </div>
        <Button onClick={handleCheckUpdates} loading={checking} icon={RefreshCw}>
          Check for Updates
        </Button>
      </div>

      {/* Updates Available */}
      {pendingUpdates.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Updates Available: {pendingUpdates.length}
            </h2>
          </div>

          <div className="space-y-4">
            {pendingUpdates.map(update => (
              <div key={update.id} className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-neutral-900 dark:text-white">{update.name}</h3>
                      {getPriorityBadge(update.priority)}
                      {update.requiresRestart && (
                        <Badge variant="warning" size="small">Restart</Badge>
                      )}
                    </div>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">{update.description}</p>
                    <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                      <span>{update.size}</span>
                      <span>•</span>
                      <span>{update.type}</span>
                    </div>

                    {installing[update.id] !== undefined && (
                      <div className="mt-3">
                        <ProgressBar value={installing[update.id]} variant="primary" showLabel />
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => handleInstall(update.id)}
                    disabled={installing[update.id] !== undefined}
                    size="small"
                  >
                    {installing[update.id] !== undefined ? 'Installing...' : 'Install'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {pendingUpdates.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-success-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">You're all up to date!</h2>
            <p className="text-neutral-600 dark:text-neutral-400">No updates available at this time.</p>
          </div>
        </Card>
      )}

      {/* Update History */}
      {installedUpdates.length > 0 && (
        <Card>
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Recent Updates</h3>
          <div className="space-y-3">
            {installedUpdates.map(update => (
              <div key={update.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700">
                <CheckCircle className="w-5 h-5 text-success-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-neutral-900 dark:text-white">{update.name}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Installed successfully</p>
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">{update.releaseDate}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default DeviceUpdates;
