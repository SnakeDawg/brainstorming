import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Gamepad2, GraduationCap, Briefcase, Palette, Home } from 'lucide-react';
import { useSetup } from '../../contexts/SetupContext';
import TaskStatusItem from '../progress/TaskStatusItem';
// ProgressBar import removed (unused)
import { PersonaType } from '../../types/personas';

const StatusPanel: React.FC = () => {
  const { state } = useSetup();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getPersonaIcon = (persona: PersonaType) => {
    switch (persona) {
      case 'Gamer':
        return <Gamepad2 className="w-4 h-4" />;
      case 'Student':
        return <GraduationCap className="w-4 h-4" />;
      case 'Professional':
        return <Briefcase className="w-4 h-4" />;
      case 'Creator':
        return <Palette className="w-4 h-4" />;
      case 'Casual':
        return <Home className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPhaseLabel = (phase: string): string => {
    switch (phase) {
      case 'welcome':
        return 'Welcome';
      case 'privacy':
        return 'Privacy Notice';
      case 'interview':
        return 'Getting to Know You';
      case 'persona-detection':
        return 'Analyzing Preferences';
      case 'app-recommendations':
        return 'App Selection';
      case 'device-setup':
        return 'Device Setup';
      case 'data-migration':
        return 'Data Migration';
      case 'installation':
        return 'Installing Apps';
      case 'complete':
        return 'Setup Complete';
      default:
        return phase;
    }
  };

  const allTasks = [...(state.activeTasks || []), ...(state.completedTasks || [])];
  const hasActiveTasks = (state.activeTasks?.length || 0) > 0 || (state.completedTasks?.length || 0) > 0;

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">Setup Status</span>
            {state.detectedPersona && (
              <div className="flex items-center gap-1 px-2 py-1 bg-primary-50 rounded-full">
                {getPersonaIcon(state.detectedPersona.persona)}
                <span className="text-xs font-medium text-primary-700">
                  {state.detectedPersona.persona}
                </span>
              </div>
            )}
          </div>
          <span className="text-xs text-gray-600">• {getPhaseLabel(state.currentPhase)}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Overall Progress */}
          {state.setupProgress > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-600 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${state.setupProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700">{state.setupProgress}%</span>
            </div>
          )}

          {/* Collapse/Expand Icon */}
          {isCollapsed ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Collapsible Content */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="border-t border-gray-200"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-6 py-4 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Phase Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Current Phase</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Phase</span>
                      <span className="font-medium text-gray-900">{getPhaseLabel(state.currentPhase)}</span>
                    </div>

                    {state.detectedPersona && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Detected Persona</span>
                        <div className="flex items-center gap-1">
                          {getPersonaIcon(state.detectedPersona.persona)}
                          <span className="font-medium text-gray-900">{state.detectedPersona.persona}</span>
                          <span className="text-xs text-gray-500">
                            ({Math.round(state.detectedPersona.confidence * 100)}%)
                          </span>
                        </div>
                      </div>
                    )}

                    {state.selectedApps.length > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Selected Apps</span>
                        <span className="font-medium text-gray-900">{state.selectedApps.length} apps</span>
                      </div>
                    )}

                    {state.messages.length > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Messages Exchanged</span>
                        <span className="font-medium text-gray-900">{state.messages.length}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Active Tasks */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    {hasActiveTasks ? 'Tasks' : 'No Active Tasks'}
                  </h3>

                  {hasActiveTasks ? (
                    <div className="space-y-1">
                      {allTasks.slice(0, 5).map((task) => (
                        <TaskStatusItem key={task.id} task={task} />
                      ))}
                      {allTasks.length > 5 && (
                        <p className="text-xs text-gray-500 text-center pt-2">
                          +{allTasks.length - 5} more tasks
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Background tasks will appear here during installation and setup.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StatusPanel;
