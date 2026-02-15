import { useState, useCallback } from 'react';
import { PersonaType, PersonaDetectionResult } from '../types/personas';
import { Message } from '../types/setup';
import personasData from '../data/personas.json';

interface KeywordMatch {
  persona: PersonaType;
  count: number;
  confidence: number;
}

export function usePersonaDetection() {
  const [isDetecting, setIsDetecting] = useState(false);

  const detectPersona = useCallback(async (messages: Message[]): Promise<PersonaDetectionResult> => {
    setIsDetecting(true);

    // Simulate detection delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Combine all user messages
    const userText = messages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content.toLowerCase())
      .join(' ');

    // Count keyword matches for each persona
    const matches: KeywordMatch[] = personasData.map(persona => {
      const matchedKeywords = persona.keywords.filter(keyword =>
        userText.includes(keyword.toLowerCase())
      );

      const count = matchedKeywords.length;
      const totalKeywords = persona.keywords.length;
      const confidence = (count / totalKeywords) * 100;

      return {
        persona: persona.id as PersonaType,
        count,
        confidence: Math.min(100, confidence * 3), // Boost confidence for better UX
      };
    });

    // Sort by confidence
    matches.sort((a, b) => b.confidence - a.confidence);

    const topMatch = matches[0];
    const secondMatch = matches[1];

    // If no strong match, default to Professional persona
    const hasStrongMatch = topMatch.confidence > 10;
    const finalPersona = hasStrongMatch ? topMatch.persona : 'Professional';
    const finalConfidence = hasStrongMatch ? topMatch.confidence : 65;

    // Determine if it's a hybrid persona
    const isHybrid = secondMatch && secondMatch.confidence > 30;

    const result: PersonaDetectionResult = {
      persona: finalPersona as PersonaType,
      confidence: finalConfidence,
      isHybrid,
      secondaryPersona: isHybrid ? secondMatch.persona : undefined,
    };

    setIsDetecting(false);
    return result;
  }, []);

  return {
    isDetecting,
    detectPersona,
  };
}
