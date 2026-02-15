import { App } from '../types/apps';
import { PersonaType } from '../types/personas';
import appsData from '../data/apps.json';

export function getRecommendedApps(primaryPersona: PersonaType, secondaryPersona?: PersonaType): App[] {
  const allApps = appsData as App[];

  // Filter apps that match the primary persona
  const recommendedApps = allApps.filter(app => {
    const matchesPrimary = app.personas.includes(primaryPersona);
    const matchesSecondary = secondaryPersona ? app.personas.includes(secondaryPersona) : false;

    return matchesPrimary || matchesSecondary;
  });

  // Sort by relevance (apps matching both personas first)
  if (secondaryPersona) {
    recommendedApps.sort((a, b) => {
      const aMatchesBoth = a.personas.includes(primaryPersona) && a.personas.includes(secondaryPersona);
      const bMatchesBoth = b.personas.includes(primaryPersona) && b.personas.includes(secondaryPersona);

      if (aMatchesBoth && !bMatchesBoth) return -1;
      if (!aMatchesBoth && bMatchesBoth) return 1;
      return 0;
    });
  }

  return recommendedApps;
}

export function getEssentialApps(): App[] {
  const allApps = appsData as App[];

  // Return apps that are useful across all personas
  const essentialAppIds = ['chrome', 'firefox', 'vlc', '7zip'];

  return allApps.filter(app => essentialAppIds.includes(app.id));
}

export function getCategoryApps(category: string): App[] {
  const allApps = appsData as App[];
  return allApps.filter(app => app.category === category);
}
