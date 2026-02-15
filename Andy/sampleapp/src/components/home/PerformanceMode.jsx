import { useState } from 'react';
import Card from '../common/Card';
import { Gauge } from 'lucide-react';
import mockSystemData from '../../data/mockSystemData.json';

const PerformanceMode = () => {
  const [modes, setModes] = useState(mockSystemData.performanceModes);

  const handleModeSelect = (selectedId) => {
    setModes(prev =>
      prev.map(mode => ({
        ...mode,
        active: mode.id === selectedId
      }))
    );
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="w-5 h-5 text-primary-600" />
        <h3 className="font-semibold text-neutral-900 dark:text-white">Performance Mode</h3>
      </div>

      <div className="space-y-2">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => handleModeSelect(mode.id)}
            className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
              mode.active
                ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30'
                : 'border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-900 dark:text-white">{mode.name}</span>
                  {mode.active && (
                    <span className="text-xs text-primary-600 font-medium">Active</span>
                  )}
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">{mode.description}</p>
              </div>
              {mode.active && (
                <div className="w-3 h-3 rounded-full bg-primary-600"></div>
              )}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default PerformanceMode;
