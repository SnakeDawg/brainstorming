import React, { useState } from 'react';
import { Activity, Loader2 } from 'lucide-react';
import { useSetup } from '../../contexts/SetupContext';
import ActivityView from './ActivityView';

const ActivityButton: React.FC = () => {
  const { state } = useSetup();
  const [isActivityOpen, setIsActivityOpen] = useState(false);

  const activeTasksCount = state.activeTasks.filter(t => t.status === 'in-progress').length;

  return (
    <>
      <button
        onClick={() => setIsActivityOpen(true)}
        className="fixed top-6 right-6 z-30 flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all hover:border-gray-400 group"
      >
        <div className="relative">
          {activeTasksCount > 0 ? (
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          ) : (
            <Activity className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
          )}
          {activeTasksCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
              {activeTasksCount}
            </span>
          )}
        </div>
        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
          Activity
        </span>
      </button>

      <ActivityView isOpen={isActivityOpen} onClose={() => setIsActivityOpen(false)} />
    </>
  );
};

export default ActivityButton;
