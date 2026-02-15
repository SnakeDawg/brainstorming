import { useCallback } from 'react';
import { useSetup } from '../contexts/SetupContext';
import { App } from '../types/apps';
import { TaskStatus } from '../types/setup';

export function useInstallationSimulator() {
  const { dispatch } = useSetup();

  const startInstallation = useCallback((apps: App[]) => {
    // Create tasks for each app
    apps.forEach((app, index) => {
      const task: TaskStatus = {
        id: `install-${app.id}`,
        name: `Installing ${app.name}`,
        type: 'install',
        status: 'pending',
        progress: 0,
        currentAction: 'Queued',
        timeRemaining: app.installTime * 60, // Convert minutes to seconds
      };

      dispatch({ type: 'ADD_TASK', payload: task });

      // Simulate installation with delay
      setTimeout(() => {
        simulateAppInstallation(app, task.id, dispatch);
      }, index * 2000); // Stagger start times
    });
  }, [dispatch]);

  return { startInstallation };
}

// Simulate realistic installation progress
function simulateAppInstallation(
  app: App,
  taskId: string,
  dispatch: React.Dispatch<any>
) {
  const totalTime = app.installTime * 60 * 1000; // Convert to milliseconds
  const startTime = Date.now();

  // Download phase (40% of time)
  const downloadInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const downloadProgress = Math.min((elapsed / (totalTime * 0.4)) * 40, 40);

    if (downloadProgress >= 40) {
      clearInterval(downloadInterval);

      // Start install phase
      installPhase(app, taskId, dispatch, startTime, totalTime);
    } else {
      const timeRemaining = Math.ceil((totalTime - elapsed) / 1000);
      dispatch({
        type: 'UPDATE_TASK_PROGRESS',
        payload: {
          id: taskId,
          progress: Math.floor(downloadProgress),
          currentAction: `Downloading... ${Math.floor(downloadProgress)}%`,
          timeRemaining,
        },
      });
    }
  }, 500);
}

function installPhase(
  _app: App,
  taskId: string,
  dispatch: React.Dispatch<any>,
  startTime: number,
  totalTime: number
) {
  const installInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const totalProgress = 40 + Math.min(((elapsed - totalTime * 0.4) / (totalTime * 0.6)) * 60, 60);

    if (totalProgress >= 100) {
      clearInterval(installInterval);

      // Complete task
      dispatch({ type: 'COMPLETE_TASK', payload: taskId });

      // Update overall progress
      dispatch({ type: 'UPDATE_PROGRESS', payload: Math.min(totalProgress, 100) });
    } else {
      const timeRemaining = Math.ceil((totalTime - elapsed) / 1000);
      dispatch({
        type: 'UPDATE_TASK_PROGRESS',
        payload: {
          id: taskId,
          progress: Math.floor(totalProgress),
          currentAction: `Installing... ${Math.floor(totalProgress - 40)}%`,
          timeRemaining,
        },
      });
    }
  }, 500);
}
