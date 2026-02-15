import React, { useEffect, useState } from 'react';
import { Sparkles, ChevronRight, Clock, CheckCircle2, Loader2, Coffee, AlertCircle } from 'lucide-react';
import Button from '../shared/Button';
import Card from '../shared/Card';
import TaskStatusItem from './TaskStatusItem';
import ProgressBar from '../shared/ProgressBar';
import { useSetup } from '../../contexts/SetupContext';

const InstallationProgress: React.FC = () => {
  const { state, dispatch } = useSetup();
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(0);

  const allTasks = [...state.activeTasks, ...state.completedTasks];
  const totalTasks = allTasks.length;
  const completedCount = state.completedTasks.length;
  const inProgressCount = state.activeTasks.filter(t => t.status === 'in-progress').length;
  const pendingCount = state.activeTasks.filter(t => t.status === 'pending').length;
  const errorCount = state.activeTasks.filter(t => t.status === 'error').length;

  const overallProgress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Calculate estimated time
  useEffect(() => {
    const activeTasks = state.activeTasks.filter(t => t.status !== 'error');
    const totalTime = activeTasks.reduce((acc, task) => {
      return acc + (task.timeRemaining || 0);
    }, 0);
    setEstimatedTimeRemaining(totalTime);
  }, [state.activeTasks]);

  // Auto-advance when all tasks complete
  useEffect(() => {
    if (totalTasks > 0 && completedCount === totalTasks) {
      setTimeout(() => {
        dispatch({ type: 'SET_PHASE', payload: 'complete' });
      }, 2000);
    }
  }, [completedCount, totalTasks, dispatch]);

  const handleContinue = () => {
    dispatch({ type: 'SET_PHASE', payload: 'complete' });
  };

  const formatTime = (seconds: number): string => {
    // Cap at 45 minutes for realistic setup time
    const cappedSeconds = Math.min(seconds, 2700); // 45 minutes max

    if (cappedSeconds < 60) return `${Math.ceil(cappedSeconds)}s`;
    const minutes = Math.floor(cappedSeconds / 60);
    const remainingSeconds = cappedSeconds % 60;

    return remainingSeconds > 0
      ? `${minutes}m ${Math.ceil(remainingSeconds)}s`
      : `${minutes}m`;
  };

  // Group tasks by type
  const tasksByType = {
    apps: allTasks.filter(t => t.type === 'install' && t.name.includes('Install')),
    firmware: allTasks.filter(t => t.type === 'update' && t.name.includes('firmware')),
    drivers: allTasks.filter(t => t.type === 'install' && t.name.includes('driver')),
    configure: allTasks.filter(t => t.type === 'configure'),
    updates: allTasks.filter(t => t.type === 'update' && !t.name.includes('firmware')),
  };

  const isComplete = completedCount === totalTasks && totalTasks > 0;

  return (
    <div className="h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex overflow-hidden">
      <div className="flex-1 flex flex-col p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-purple-600 rounded-3xl mb-4 shadow-lg">
              {isComplete ? (
                <CheckCircle2 className="w-10 h-10 text-white" />
              ) : (
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              )}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {isComplete ? 'Setup Complete!' : 'Setting Up Your PC'}
            </h1>
            <p className="text-xl text-gray-600">
              {isComplete
                ? 'All tasks completed successfully'
                : 'We have all the information we need to configure your device'}
            </p>
          </div>

          {/* Take a Break Message */}
          {!isComplete && (
            <Card variant="elevated" padding="lg" className="mb-6 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Coffee className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Take a Break!</h3>
                  <p className="text-sm text-gray-600">
                    Your PC is being configured in the background. Feel free to grab a coffee or stretch your legs.
                    We'll notify you when everything is ready. Estimated time remaining: <strong>{formatTime(estimatedTimeRemaining)}</strong>
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card variant="elevated" padding="md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
                </div>
              </div>
            </Card>

            <Card variant="elevated" padding="md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{inProgressCount}</p>
                </div>
              </div>
            </Card>

            <Card variant="elevated" padding="md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Queued</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                </div>
              </div>
            </Card>

            <Card variant="elevated" padding="md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time Left</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isComplete ? '0s' : formatTime(estimatedTimeRemaining)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Overall Progress */}
          <Card variant="elevated" padding="lg" className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">Overall Setup Progress</span>
              <span className="text-2xl font-bold text-primary-600">{overallProgress}%</span>
            </div>
            <ProgressBar progress={overallProgress} size="lg" />
            <p className="text-sm text-gray-600 mt-3">
              {completedCount} of {totalTasks} tasks completed
            </p>
          </Card>

          {/* Task Categories */}
          <div className="space-y-4 mb-6">
            {/* Application Installations */}
            {tasksByType.apps.length > 0 && (
              <Card variant="elevated" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Application Installations ({tasksByType.apps.filter(t => t.status === 'complete').length}/{tasksByType.apps.length})
                  </h2>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {tasksByType.apps.map((task) => (
                    <TaskStatusItem key={task.id} task={task} />
                  ))}
                </div>
              </Card>
            )}

            {/* Firmware Updates */}
            {tasksByType.firmware.length > 0 && (
              <Card variant="elevated" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Firmware Updates ({tasksByType.firmware.filter(t => t.status === 'complete').length}/{tasksByType.firmware.length})
                  </h2>
                </div>
                <div className="space-y-2">
                  {tasksByType.firmware.map((task) => (
                    <TaskStatusItem key={task.id} task={task} />
                  ))}
                </div>
              </Card>
            )}

            {/* Driver Installations */}
            {tasksByType.drivers.length > 0 && (
              <Card variant="elevated" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Driver Installations ({tasksByType.drivers.filter(t => t.status === 'complete').length}/{tasksByType.drivers.length})
                  </h2>
                </div>
                <div className="space-y-2">
                  {tasksByType.drivers.map((task) => (
                    <TaskStatusItem key={task.id} task={task} />
                  ))}
                </div>
              </Card>
            )}

            {/* System Updates */}
            {tasksByType.updates.length > 0 && (
              <Card variant="elevated" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    System Updates ({tasksByType.updates.filter(t => t.status === 'complete').length}/{tasksByType.updates.length})
                  </h2>
                </div>
                <div className="space-y-2">
                  {tasksByType.updates.map((task) => (
                    <TaskStatusItem key={task.id} task={task} />
                  ))}
                </div>
              </Card>
            )}

            {/* Configuration Tasks */}
            {tasksByType.configure.length > 0 && (
              <Card variant="elevated" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Configuration ({tasksByType.configure.filter(t => t.status === 'complete').length}/{tasksByType.configure.length})
                  </h2>
                </div>
                <div className="space-y-2">
                  {tasksByType.configure.map((task) => (
                    <TaskStatusItem key={task.id} task={task} />
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Error Summary */}
          {errorCount > 0 && (
            <Card variant="elevated" padding="lg" className="mb-6 bg-red-50 border-red-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Some Tasks Failed</h3>
                  <p className="text-sm text-gray-600">
                    {errorCount} task{errorCount !== 1 ? 's' : ''} encountered errors during installation.
                    You can retry these later or continue without them.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Continue Button */}
          {isComplete && (
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleContinue}
                rightIcon={<ChevronRight className="w-5 h-5" />}
              >
                Continue to Finish Setup
              </Button>
            </div>
          )}

          {/* No Tasks */}
          {allTasks.length === 0 && (
            <Card variant="outlined" padding="lg" className="text-center">
              <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">No Tasks Queued</h3>
              <p className="text-sm text-gray-600 mb-4">
                No applications or updates were selected for installation.
              </p>
              <Button onClick={handleContinue}>Continue</Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstallationProgress;
