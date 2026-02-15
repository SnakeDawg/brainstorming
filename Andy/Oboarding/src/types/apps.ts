import { PersonaType } from './personas';

export interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AppCategory;
  personas: PersonaType[];
  size: string;
  installTime: number; // in seconds
}

export type AppCategory =
  | 'Productivity'
  | 'Communication'
  | 'Gaming'
  | 'Creative'
  | 'Education'
  | 'Utilities'
  | 'Entertainment';

export interface AppInstallation {
  app: App;
  status: 'pending' | 'downloading' | 'installing' | 'installed' | 'failed';
  progress: number;
}
