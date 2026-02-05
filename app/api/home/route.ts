import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PROJECT_START_DATE, countWorkingDays, DAILY_OBJECTIVE, ETABLISSEMENTS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    // Parse dates or use defaults
    const startDate = startDateParam ? new Date(startDateParam) : PROJECT_START_DATE;
    const endDate = endDateParam ? new Date(endDateParam) : new Date();
    
    // Set end date to end of day
    const endDateEnd = new Date(endDate);
    endDateEnd.setHours(23, 59, 59, 999);

    // Fetch data within the period
    const [supervisionData, lastRefresh] = await Promise.all([
      prisma.supervisionData.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDateEnd,
          },
        },
        orderBy: { date: 'desc' },
      }),
      prisma.dataRefreshLog.findFirst({
        orderBy: { refreshedAt: 'desc' },
      }),
    ]);

    // Calculate totals for the period
    const totalEnregistrees = supervisionData.reduce((sum, d) => sum + d.femmesEnceintesEnregistrees, 0);
    const totalConnectees = supervisionData.reduce((sum, d) => sum + d.femmesEnceintesConnectees, 0);
    const totalRecues = supervisionData.reduce((sum, d) => sum + d.femmesEnceintesRecues, 0);
    
    // Get unique dates in the period
    const uniqueDates = [...new Set(supervisionData.map(d => d.date.toISOString().split('T')[0]))];
    
    // Calculate working days in the selected period
    const joursOuvrables = countWorkingDays(startDate, endDate);
    const objectifCumule = joursOuvrables * DAILY_OBJECTIVE;
    const tauxAtteinte = objectifCumule > 0 ? Math.round((totalEnregistrees / objectifCumule) * 100) : 0;

    // Calculate by establishment for the period
    const byEtablissement = ETABLISSEMENTS.map(etab => {
      const etabData = supervisionData.filter(d => d.etablissement === etab);
      return {
        etablissement: etab,
        totalEnregistrees: etabData.reduce((sum, d) => sum + d.femmesEnceintesEnregistrees, 0),
        totalConnectees: etabData.reduce((sum, d) => sum + d.femmesEnceintesConnectees, 0),
        totalRecues: etabData.reduce((sum, d) => sum + d.femmesEnceintesRecues, 0),
        sfFormees: etabData.length > 0 ? etabData[0].sageFemmesFormees : 0,
        avgSfPresentes: etabData.length > 0 
          ? Math.round(etabData.reduce((sum, d) => sum + d.sageFemmesPresentes, 0) / etabData.length)
          : 0,
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

    return NextResponse.json({
      totalEnregistrees,
      totalConnectees,
      totalRecues,
      objectifCumule,
      tauxAtteinte,
      joursOuvrables,
      totalJours: uniqueDates.length,
      lastRefresh: lastRefresh?.refreshedAt?.toISOString() || null,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      byEtablissement,
      dailyData,
      hasData: supervisionData.length > 0,
    });
  } catch (error) {
    console.error('Error fetching home data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
