import { prisma } from '@/lib/db';
import { PROJECT_START_DATE, countWorkingDays, DAILY_OBJECTIVE, ETABLISSEMENTS, getEffectiveDisplayDate } from '@/lib/constants';
import HomeClient from './home-client';

export const dynamic = 'force-dynamic';

async function getOverviewData() {
  // Déterminer la date d'affichage effective (J-1 si avant 16h)
  const now = new Date();
  const effectiveDate = getEffectiveDisplayDate(now);
  effectiveDate.setHours(23, 59, 59, 999);
  
  const [supervisionData, lastRefresh] = await Promise.all([
    prisma.supervisionData.findMany({
      where: {
        date: {
          lte: effectiveDate,
          gte: PROJECT_START_DATE,
        },
      },
      orderBy: { date: 'desc' },
    }),
    prisma.dataRefreshLog.findFirst({
      orderBy: { refreshedAt: 'desc' },
    }),
  ]);

  const totalEnregistrees = supervisionData.reduce((sum, d) => sum + d.femmesEnceintesEnregistrees, 0);
  const totalConnectees = supervisionData.reduce((sum, d) => sum + d.femmesEnceintesConnectees, 0);
  const totalRecues = supervisionData.reduce((sum, d) => sum + d.femmesEnceintesRecues, 0);
  
  const latestDate = supervisionData.length > 0 
    ? new Date(Math.max(...supervisionData.map(d => d.date.getTime())))
    : PROJECT_START_DATE;
  
  const joursOuvrables = countWorkingDays(PROJECT_START_DATE, latestDate);
  const objectifCumule = joursOuvrables * DAILY_OBJECTIVE;
  const tauxAtteinte = objectifCumule > 0 ? Math.round((totalEnregistrees / objectifCumule) * 100) : 0;

  // Get unique dates
  const uniqueDates = [...new Set(supervisionData.map(d => d.date.toISOString().split('T')[0]))];
  
  // Calculate by establishment
  const byEtablissement = ETABLISSEMENTS.map(etab => {
    const etabData = supervisionData.filter(d => d.etablissement === etab);
    return {
      etablissement: etab,
      totalEnregistrees: etabData.reduce((sum, d) => sum + d.femmesEnceintesEnregistrees, 0),
      totalConnectees: etabData.reduce((sum, d) => sum + d.femmesEnceintesConnectees, 0),
      totalRecues: etabData.reduce((sum, d) => sum + d.femmesEnceintesRecues, 0),
    };
  });

  // Daily data for the period (for charts)
  const dailyData = uniqueDates.sort().map(dateStr => {
    const dayData = supervisionData.filter(d => d.date.toISOString().split('T')[0] === dateStr);
    return {
      date: dateStr,
      enregistrees: dayData.reduce((sum, d) => sum + d.femmesEnceintesEnregistrees, 0),
      connectees: dayData.reduce((sum, d) => sum + d.femmesEnceintesConnectees, 0),
      recues: dayData.reduce((sum, d) => sum + d.femmesEnceintesRecues, 0),
    };
  });

  return {
    totalEnregistrees,
    totalConnectees,
    totalRecues,
    objectifCumule,
    tauxAtteinte,
    joursOuvrables,
    totalJours: uniqueDates.length,
    lastRefresh: lastRefresh?.refreshedAt?.toISOString() || null,
    startDate: PROJECT_START_DATE.toISOString().split('T')[0],
    endDate: effectiveDate.toISOString().split('T')[0],
    displayDate: effectiveDate.toISOString().split('T')[0],
    byEtablissement,
    dailyData,
    hasData: supervisionData.length > 0,
  };
}

export default async function HomePage() {
  const data = await getOverviewData();
  return <HomeClient data={data} />;
}
