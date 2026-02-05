import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    
    let whereClause: any = {};
    
    if (fromDate && toDate) {
      whereClause.date = {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      };
    }
    
    const [supervisionData, applicationData] = await Promise.all([
      prisma.supervisionData.findMany({
        where: whereClause,
        orderBy: [{ date: 'asc' }, { etablissement: 'asc' }],
      }),
      prisma.applicationData.findMany({
        where: whereClause,
        orderBy: [{ date: 'asc' }, { etablissement: 'asc' }],
      }),
    ]);
    
    // Create comparison map
    const comparisonMap = new Map<string, any>();
    
    for (const sup of supervisionData) {
      const key = `${sup.date.toISOString().split('T')[0]}_${sup.etablissement}`;
      comparisonMap.set(key, {
        date: sup.date,
        etablissement: sup.etablissement,
        supervision: sup,
        application: null,
        ecartEnregistrees: 0,
        ecartConnectees: 0,
      });
    }
    
    for (const app of applicationData) {
      const key = `${app.date.toISOString().split('T')[0]}_${app.etablissement}`;
      const existing = comparisonMap.get(key);
      
      if (existing) {
        existing.application = app;
        existing.ecartEnregistrees = app.femmesEnceintesEnregistrees - existing.supervision.femmesEnceintesEnregistrees;
        existing.ecartConnectees = app.femmesEnceintesConnectees - existing.supervision.femmesEnceintesConnectees;
      } else {
        comparisonMap.set(key, {
          date: app.date,
          etablissement: app.etablissement,
          supervision: null,
          application: app,
          ecartEnregistrees: app.femmesEnceintesEnregistrees,
          ecartConnectees: app.femmesEnceintesConnectees,
        });
      }
    }
    
    const comparison = Array.from(comparisonMap.values()).sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.etablissement.localeCompare(b.etablissement);
    });
    
    // Calculate statistics
    let totalMatches = 0;
    let totalRecords = comparison.length;
    let sumEcartEnregistrees = 0;
    let sumEcartConnectees = 0;
    let maxEcart = 0;
    
    for (const item of comparison) {
      if (item.supervision && item.application) {
        if (item.ecartEnregistrees === 0 && item.ecartConnectees === 0) {
          totalMatches++;
        }
        sumEcartEnregistrees += Math.abs(item.ecartEnregistrees);
        sumEcartConnectees += Math.abs(item.ecartConnectees);
        maxEcart = Math.max(maxEcart, Math.abs(item.ecartEnregistrees), Math.abs(item.ecartConnectees));
      }
    }
    
    const stats = {
      tauxConcordance: totalRecords > 0 ? Math.round((totalMatches / totalRecords) * 100) : 0,
      ecartMoyenEnregistrees: totalRecords > 0 ? Math.round(sumEcartEnregistrees / totalRecords * 10) / 10 : 0,
      ecartMoyenConnectees: totalRecords > 0 ? Math.round(sumEcartConnectees / totalRecords * 10) / 10 : 0,
      ecartMax: maxEcart,
      totalRecords,
    };
    
    return NextResponse.json({ comparison, stats });
  } catch (error) {
    console.error('Comparison API error:', error);
    return NextResponse.json({ error: 'Failed to fetch comparison data' }, { status: 500 });
  }
}
