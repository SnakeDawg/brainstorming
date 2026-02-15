import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { SetupState, SetupPhase, Message, Monitor, Peripheral, MigrationMethod, TaskStatus } from '../types/setup';
import { App } from '../types/apps';
import { PersonaDetectionResult } from '../types/personas';

type SetupAction =
  | { type: 'SET_PHASE'; payload: SetupPhase }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_USER_NAME'; payload: string }
  | { type: 'SET_PERSONA'; payload: PersonaDetectionResult | null }
  | { type: 'SET_SELECTED_APPS'; payload: App[] }
  | { type: 'TOGGLE_APP'; payload: App }
  | { type: 'SET_MIGRATION_METHOD'; payload: MigrationMethod }
  | { type: 'SET_MONITORS'; payload: Monitor[] }
  | { type: 'SET_PERIPHERALS'; payload: Peripheral[] }
  | { type: 'UPDATE_PROGRESS'; payload: number }
  | { type: 'ADD_TASK'; payload: TaskStatus }
  | { type: 'UPDATE_TASK_PROGRESS'; payload: { id: string; progress: number; currentAction?: string; timeRemaining?: number } }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'FAIL_TASK'; payload: { id: string; error: string } }
  | { type: 'LOAD_SESSION'; payload: SetupState }
  | { type: 'RESET_SETUP' };

const initialState: SetupState = {
  currentPhase: 'welcome',
  messages: [],
  userName: null,
  detectedPersona: null,
  selectedApps: [],
  migrationMethod: null,
  monitors: [],
  peripherals: [],
  setupProgress: 0,
  activeTasks: [],
  completedTasks: [],
  sessionId: crypto.randomUUID(),
  startTime: new Date(),
};

function setupReducer(state: SetupState, action: SetupAction): SetupState {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, currentPhase: action.payload };

    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };

    case 'SET_USER_NAME':
      return { ...state, userName: action.payload };

    case 'SET_PERSONA':
      return { ...state, detectedPersona: action.payload };

    case 'SET_SELECTED_APPS':
      return { ...state, selectedApps: action.payload };

    case 'TOGGLE_APP': {
      const isSelected = state.selectedApps.some(app => app.id === action.payload.id);
      return {
        ...state,
        selectedApps: isSelected
          ? state.selectedApps.filter(app => app.id !== action.payload.id)
          : [...state.selectedApps, action.payload],
      };
    }

    case 'SET_MIGRATION_METHOD':
      return { ...state, migrationMethod: action.payload };

    case 'SET_MONITORS':
      return { ...state, monitors: action.payload };

    case 'SET_PERIPHERALS':
      return { ...state, peripherals: action.payload };

    case 'UPDATE_PROGRESS':
      return { ...state, setupProgress: action.payload };

    case 'ADD_TASK': {
      // Prevent duplicate tasks with the same ID
      const taskExists = state.activeTasks.some(task => task.id === action.payload.id) ||
                         state.completedTasks.some(task => task.id === action.payload.id);
      if (taskExists) return state;
      return { ...state, activeTasks: [...state.activeTasks, action.payload] };
    }

    case 'UPDATE_TASK_PROGRESS': {
      const updatedTasks = state.activeTasks.map(task =>
        task.id === action.payload.id
          ? {
              ...task,
              progress: action.payload.progress,
              currentAction: action.payload.currentAction || task.currentAction,
              timeRemaining: action.payload.timeRemaining !== undefined ? action.payload.timeRemaining : task.timeRemaining,
            }
          : task
      );
      return { ...state, activeTasks: updatedTasks };
    }

    case 'COMPLETE_TASK': {
      const completedTask = state.activeTasks.find(task => task.id === action.payload);
      if (!completedTask) return state;

      return {
        ...state,
        activeTasks: state.activeTasks.filter(task => task.id !== action.payload),
        completedTasks: [...state.completedTasks, { ...completedTask, status: 'complete', progress: 100 }],
      };
    }

    case 'FAIL_TASK': {
      const failedTask = state.activeTasks.find(task => task.id === action.payload.id);
      if (!failedTask) return state;

      return {
        ...state,
        activeTasks: state.activeTasks.map(task =>
          task.id === action.payload.id
            ? { ...task, status: 'error', error: action.payload.error }
            : task
        ),
      };
    }

    case 'LOAD_SESSION':
      return action.payload;

    case 'RESET_SETUP':
      return { ...initialState, sessionId: crypto.randomUUID(), startTime: new Date() };

    default:
      return state;
  }
}

interface SetupContextType {
  state: SetupState;
  dispatch: React.Dispatch<SetupAction>;
  saveSession: () => void;
  loadSession: () => void;
  clearSession: () => void;
}

const SetupContext = createContext<SetupContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'abhi-setup-session';

export function SetupProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(setupReducer, initialState);

  // Auto-save session state to localStorage
  const saveSession = () => {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  // Load session from localStorage
  const loadSession = () => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        parsed.startTime = new Date(parsed.startTime);
        parsed.messages = parsed.messages.map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        // Ensure new properties exist (for backward compatibility)
        const loadedState = {
          ...initialState,
          ...parsed,
          activeTasks: parsed.activeTasks || [],
          completedTasks: parsed.completedTasks || [],
        };
        dispatch({ type: 'LOAD_SESSION', payload: loadedState });
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      // If load fails, clear corrupted data
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  };

  // Clear session from localStorage
  const clearSession = () => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      dispatch({ type: 'RESET_SETUP' });
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  };

  // Auto-save every 30 seconds and on state change
  useEffect(() => {
    const interval = setInterval(saveSession, 30000);
    return () => clearInterval(interval);
  }, [state]);

  // Try to load saved session on mount
  useEffect(() => {
    loadSession();
  }, []);

  return (
    <SetupContext.Provider value={{ state, dispatch, saveSession, loadSession, clearSession }}>
      {children}
    </SetupContext.Provider>
  );
}

export function useSetup() {
  const context = useContext(SetupContext);
  if (context === undefined) {
    throw new Error('useSetup must be used within a SetupProvider');
  }
  return context;
}
