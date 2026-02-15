import { useEffect } from 'react';
import { useSetup } from '../contexts/SetupContext';

/**
 * Hook to simulate background task progress (Windows Updates, Driver Updates)
 */
export function useBackgroundTasks() {
  const { state, dispatch } = useSetup();

  useEffect(() => {
    // Simulate Windows Update progress
    const windowsUpdateInterval = setInterval(() => {
      const windowsTask = state.activeTasks.find(t => t.id === 'task-windows-update');
      if (windowsTask && windowsTask.status === 'in-progress' && windowsTask.progress < 100) {
        const newProgress = Math.min(100, windowsTask.progress + Math.random() * 5);
        const timeRemaining = Math.max(0, Math.floor((100 - newProgress) * 3));

        let currentAction = 'Downloading updates';
        if (newProgress > 60) currentAction = 'Installing updates';
        if (newProgress > 90) currentAction = 'Finalizing';

        dispatch({
          type: 'UPDATE_TASK_PROGRESS',
          payload: {
            id: 'task-windows-update',
            progress: newProgress,
            currentAction,
            timeRemaining,
          },
        });

        if (newProgress >= 100) {
          setTimeout(() => {
            dispatch({ type: 'COMPLETE_TASK', payload: 'task-windows-update' });
            // Start driver update after Windows update completes
            dispatch({
              type: 'UPDATE_TASK_PROGRESS',
              payload: {
                id: 'task-driver-update',
                progress: 0,
                currentAction: 'Scanning for drivers',
              },
            });
            const driverTask = state.activeTasks.find(t => t.id === 'task-driver-update');
            if (driverTask) {
              dispatch({
                type: 'UPDATE_TASK_PROGRESS',
                payload: {
                  id: 'task-driver-update',
                  progress: 0,
                  currentAction: 'Scanning for drivers',
                },
              });
              // Change status to in-progress
              // Task status would be updated through dispatch
            }
          }, 500);
        }
      }
    }, 2000);

    // Simulate Driver Update progress (starts after Windows Update)
    const driverUpdateInterval = setInterval(() => {
      const driverTask = state.activeTasks.find(t => t.id === 'task-driver-update');
      const windowsTask = state.activeTasks.find(t => t.id === 'task-windows-update');

      // Only start driver update if Windows update is complete
      if (
        driverTask &&
        windowsTask?.status === 'complete' &&
        driverTask.progress < 100
      ) {
        const newProgress = Math.min(100, driverTask.progress + Math.random() * 8);
        const timeRemaining = Math.max(0, Math.floor((100 - newProgress) * 2));

        let currentAction = 'Scanning for drivers';
        if (newProgress > 20) currentAction = 'Downloading drivers';
        if (newProgress > 70) currentAction = 'Installing drivers';
        if (newProgress > 95) currentAction = 'Finalizing';

        dispatch({
          type: 'UPDATE_TASK_PROGRESS',
          payload: {
            id: 'task-driver-update',
            progress: newProgress,
            currentAction,
            timeRemaining,
          },
        });

        if (newProgress >= 100) {
          setTimeout(() => {
            dispatch({ type: 'COMPLETE_TASK', payload: 'task-driver-update' });
          }, 500);
        }
      }
    }, 2500);

    return () => {
      clearInterval(windowsUpdateInterval);
      clearInterval(driverUpdateInterval);
    };
  }, [state.activeTasks, dispatch]);
}
