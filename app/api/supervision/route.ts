import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    
    let whereClause: any = {};
    
    if (date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      whereClause.date = {
        gte: targetDate,
        lt: nextDay,
      };
    } else if (fromDate && toDate) {
      whereClause.date = {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      };
    }
    
    const data = await prisma.supervisionData.findMany({
      where: whereClause,
      orderBy: [{ date: 'asc' }, { etablissement: 'asc' }],
    });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Supervision API error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
