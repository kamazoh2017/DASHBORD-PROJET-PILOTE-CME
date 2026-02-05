export const ETABLISSEMENTS = [
  'CHU COCODY',
  'CHR ABOBO',
  'HG YOPOUGON-ATTIE',
  'HG BINGERVILLE',
  'FSU WILLIAMSVILLE'
];

// Nombre de sage-femmes formées par établissement (données fixes)
export const SAGE_FEMMES_FORMEES: Record<string, number> = {
  'CHU COCODY': 12,
  'CHR ABOBO': 10,
  'HG YOPOUGON-ATTIE': 8,
  'HG BINGERVILLE': 8,
  'FSU WILLIAMSVILLE': 6
};

export const PROJECT_START_DATE = new Date('2026-02-03');
export const PROJECT_END_DATE = new Date('2026-02-27');
export const DAILY_OBJECTIVE = 22;
export const FINAL_TARGET = 400; // Cible finale de 400 femmes enceintes

export const SUPERVISION_SHEET_ID = '1PknFijL8kB1OCKvVf5AnzHpXolAjrJCgGlCGGqcvKhM';
export const APPLICATION_SHEET_ID = '10kme9THRbZFP7kBaFmvwrSCp_QgToEjCF6GrQBwap_w';

// Function to count working days (excluding weekends)
export function countWorkingDays(startDate: Date, endDate: Date): number {
  let count = 0;
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

export function isWorkingDay(date: Date): boolean {
  const dayOfWeek = date.getDay();
  return dayOfWeek !== 0 && dayOfWeek !== 6;
}

export function formatDateFR(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Détermine la date effective d'affichage (J-1 si avant 16h)
export function getEffectiveDisplayDate(currentDate: Date = new Date()): Date {
  const hour = currentDate.getHours();
  const effectiveDate = new Date(currentDate);
  
  // Si avant 16h, on affiche J-1
  if (hour < 16) {
    effectiveDate.setDate(effectiveDate.getDate() - 1);
  }
  
  // Si c'est un weekend, on recule au vendredi
  while (!isWorkingDay(effectiveDate)) {
    effectiveDate.setDate(effectiveDate.getDate() - 1);
  }
  
  // Ne pas aller avant la date de démarrage
  if (effectiveDate < PROJECT_START_DATE) {
    return PROJECT_START_DATE;
  }
  
  return effectiveDate;
}

// Vérifie si les données du jour J sont disponibles (après 14h)
export function isDayDataAvailable(date: Date, currentTime: Date = new Date()): boolean {
  const dateStr = date.toISOString().split('T')[0];
  const todayStr = currentTime.toISOString().split('T')[0];
  
  // Si la date est dans le passé, les données sont disponibles
  if (dateStr < todayStr) {
    return true;
  }
  
  // Si c'est aujourd'hui, les données sont disponibles après 14h
  if (dateStr === todayStr) {
    return currentTime.getHours() >= 14;
  }
  
  // Date dans le futur, pas de données
  return false;
}
