export type PersonaType = 'Gamer' | 'Student' | 'Professional' | 'Creator' | 'Casual';

export interface Persona {
  id: PersonaType;
  name: string;
  description: string;
  keywords: string[];
  icon: string;
  color: string;
}

export interface PersonaDetectionResult {
  persona: PersonaType;
  confidence: number;
  isHybrid: boolean;
  secondaryPersona?: PersonaType;
}
