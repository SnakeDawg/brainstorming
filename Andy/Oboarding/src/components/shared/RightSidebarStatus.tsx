import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSetup } from '../../contexts/SetupContext';
import TaskStatusItem from '../progress/TaskStatusItem';

const RightSidebarStatus: React.FC = () => {
  const { state } = useSetup();

  const allTasks = [...(state.activeTasks || []), ...(state.completedTasks || [])];

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Setup Progress</h2>
        <p className="text-sm text-gray-600">
          {state.detectedPersona
            ? `Optimizing for ${state.detectedPersona.persona}`
            : 'Getting to know you'}
        </p>
      </div>

      {/* Overall Progress Bar */}
      {state.setupProgress > 0 && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-bold text-primary-600">{state.setupProgress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-600 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${state.setupProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Active Tasks */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Background Tasks</h3>

        {allTasks.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {allTasks.map((task) => (
                <TaskStatusItem key={task.id} task={task} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No active tasks yet</p>
        )}

        {/* Queued Apps (if in app-recommendations or later phase) */}
        {state.selectedApps.length > 0 &&
          !allTasks.some(t => t.type === 'install') && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Apps Queued ({state.selectedApps.length})
              </h3>
              <div className="space-y-2">
                {state.selectedApps.slice(0, 5).map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center gap-2 text-xs text-gray-600"
                  >
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <span className="truncate">{app.name}</span>
                  </div>
                ))}
                {state.selectedApps.length > 5 && (
                  <p className="text-xs text-gray-500 pl-4">
                    +{state.selectedApps.length - 5} more
                  </p>
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default RightSidebarStatus;
