import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Loader2, XCircle, Clock } from 'lucide-react';
import ProgressBar from '../shared/ProgressBar';
import { TaskStatus } from '../../types/setup';

interface TaskStatusItemProps {
  task: TaskStatus;
}

const TaskStatusItem: React.FC<TaskStatusItemProps> = ({ task }) => {
  const getStatusIcon = () => {
    switch (task.status) {
      case 'complete':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Circle className="w-5 h-5 text-gray-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
  };

  const formatProgress = (progress: number): string => {
    // Round to whole number if it's close, otherwise show 1 decimal place
    const rounded = Math.round(progress * 10) / 10;
    return rounded % 1 === 0 ? Math.round(rounded).toString() : rounded.toFixed(1);
  };

  return (
    <motion.div
      className="flex items-start gap-3 py-2"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
    >
      {/* Status Icon */}
      <div className="flex-shrink-0 mt-0.5">{getStatusIcon()}</div>

      {/* Task Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-sm font-medium text-gray-900 truncate">{task.name}</p>
          {task.timeRemaining !== undefined && task.status === 'in-progress' && (
            <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
              <Clock className="w-3 h-3" />
              <span>{formatTime(task.timeRemaining)}</span>
            </div>
          )}
        </div>

        {/* Current Action */}
        {task.currentAction && task.status === 'in-progress' && (
          <p className="text-xs text-gray-600 mb-1">{task.currentAction}</p>
        )}

        {/* Error Message */}
        {task.error && task.status === 'error' && (
          <p className="text-xs text-red-600 mb-1">{task.error}</p>
        )}

        {/* Progress Bar */}
        {(task.status === 'in-progress' || task.status === 'complete') && (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <ProgressBar progress={task.progress} size="sm" />
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0">{formatProgress(task.progress)}%</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskStatusItem;
