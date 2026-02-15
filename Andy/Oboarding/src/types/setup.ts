import { PersonaDetectionResult } from './personas';
import { App } from './apps';

export type SetupPhase =
  | 'welcome'
  | 'privacy'
  | 'name-input'
  | 'interview'
  | 'analyzing'
  | 'persona-detection'
  | 'persona-confirmation'
  | 'app-recommendations'
  | 'device-detection'
  | 'display-arrangement'
  | 'display-calibration'
  | 'bluetooth-pairing'
  | 'peripheral-setup'
  | 'device-setup'
  | 'data-migration'
  | 'installation'
  | 'complete';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface TaskStatus {
  id: string;
  name: string;
  type: 'download' | 'install' | 'configure' | 'update';
  status: 'pending' | 'in-progress' | 'complete' | 'error';
  progress: number; // 0-100
  currentAction?: string;
  timeRemaining?: number; // seconds
  error?: string;
}

export interface SetupState {
  currentPhase: SetupPhase;
  messages: Message[];
  userName: string | null;
  detectedPersona: PersonaDetectionResult | null;
  selectedApps: App[];
  migrationMethod: MigrationMethod | null;
  monitors: Monitor[];
  peripherals: Peripheral[];
  setupProgress: number;
  activeTasks: TaskStatus[];
  completedTasks: TaskStatus[];
  sessionId: string;
  startTime: Date;
}

export type MigrationMethod = 'cloud' | 'network' | 'usb' | 'skip';

export interface Monitor {
  id: string;
  name: string;
  resolution: { width: number; height: number };
  refreshRate: number;
  isPrimary: boolean;
  position: { x: number; y: number };
}

export interface Peripheral {
  id: string;
  name: string;
  type: 'keyboard' | 'mouse' | 'webcam' | 'speaker' | 'headphone' | 'microphone' | 'other';
  status: 'detected' | 'updating' | 'ready';
}

export interface ConversationFlow {
  id: string;
  question: string;
  context?: string[];
  expectedKeywords?: string[];
  followUpQuestions?: string[];
}
