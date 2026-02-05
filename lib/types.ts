export interface DailyData {
  id?: string;
  date: Date | string;
  etablissement: string;
  sageFemmesFormees: number;
  sageFemmesPresentes: number;
  femmesEnceintesRecues: number;
  femmesEnceintesEnregistrees: number;
  femmesEnceintesConnectees: number;
}

export interface CumulativeData {
  date: string;
  totalSageFemmesFormees: number;
  totalSageFemmesPresentes: number;
  totalFemmesRecues: number;
  totalFemmesEnregistrees: number;
  totalFemmesConnectees: number;
  objectifCumule: number;
  joursOuvrables: number;
}

export interface ComparisonData {
  date: string;
  etablissement: string;
  supervision: DailyData | null;
  application: DailyData | null;
  ecartEnregistrees: number;
  ecartConnectees: number;
}

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}
