import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { SUPERVISION_SHEET_ID, APPLICATION_SHEET_ID, ETABLISSEMENTS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

async function fetchGoogleSheetCSV(sheetId: string, gid: string = '0'): Promise<string> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to fetch sheet: ${response.statusText}`);
  }
  return response.text();
}

function parseCSV(csv: string): Record<string, string>[] {
  const lines = csv.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows: Record<string, string>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    // Parse CSV properly handling commas within quotes
    const line = lines[i];
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/"/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/"/g, ''));
    
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] || '';
    });
    rows.push(row);
  }
  
  return rows;
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  // Try DD/MM/YYYY format
  const ddmmyyyy = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (ddmmyyyy) {
    return new Date(parseInt(ddmmyyyy[3]), parseInt(ddmmyyyy[2]) - 1, parseInt(ddmmyyyy[1]));
  }
  
  // Try YYYY-MM-DD format
  const yyyymmdd = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (yyyymmdd) {
    return new Date(parseInt(yyyymmdd[1]), parseInt(yyyymmdd[2]) - 1, parseInt(yyyymmdd[3]));
  }
  
  return null;
}

function normalizeEtablissement(name: string): string {
  const normalized = name.toUpperCase().trim()
    .replace('YOPOUGON-ATTIÉ', 'YOPOUGON-ATTIE')
    .replace('HG YOPOUGON ATTIE', 'HG YOPOUGON-ATTIE')
    .replace('EPHD YOPOUGON ATTIE', 'HG YOPOUGON-ATTIE')
    .replace('EPHDYA', 'HG YOPOUGON-ATTIE');
  
  return ETABLISSEMENTS.find(e => 
    normalized.includes(e) || e.includes(normalized)
  ) || normalized;
}

export async function POST() {
  try {
    // Clear existing data to avoid duplicates
    await prisma.supervisionData.deleteMany({});
    await prisma.applicationData.deleteMany({});
    
    // Fetch supervision data from first Google Sheet (aggregated daily data)
    const supervisionCSV = await fetchGoogleSheetCSV(SUPERVISION_SHEET_ID, '664771458');
    const supervisionRows = parseCSV(supervisionCSV);
    
    console.log('Supervision rows:', supervisionRows.length);
    
    let supervisionCount = 0;
    for (const row of supervisionRows) {
      // The DATE column is the second column (after Horodateur)
      const dateStr = row['DATE'] || row['Date'];
      const date = parseDate(dateStr);
      if (!date) {
        console.log('Invalid date:', dateStr, row);
        continue;
      }
      
      const rawEtablissement = row['ETABLISSEMENT DE SANTE'] || row['Etablissement'] || '';
      const etablissement = normalizeEtablissement(rawEtablissement);
      
      if (!ETABLISSEMENTS.includes(etablissement)) {
        console.log('Invalid etablissement:', rawEtablissement, '->', etablissement);
        continue;
      }
      
      // Parse numeric values - handle trailing spaces in column names
      const sfFormees = parseInt(row['NOMBRE DE SAGE-FEMMES FORMEES'] || row['NOMBRE DE SAGE-FEMMES FORMEES '] || '0') || 0;
      const sfPresentes = parseInt(row['NOMBRE DE SAGE-FEMMES FORMEES PRESENTES'] || '0') || 0;
      const feRecues = parseInt(row['NOMBRE DE FEMMES ENCEINTES RECUES'] || '0') || 0;
      const feEnregistrees = parseInt(row['NOMBRE DE FEMMES ENCEINTES ENREGISTREES'] || '0') || 0;
      const feConnectees = parseInt(row['NOMBRE DE FEMMES ENCEINTES CONNECTEES A MAMA INFO'] || '0') || 0;
      
      const data = {
        date,
        etablissement,
        sageFemmesFormees: sfFormees,
        sageFemmesPresentes: sfPresentes,
        femmesEnceintesRecues: feRecues,
        femmesEnceintesEnregistrees: feEnregistrees,
        femmesEnceintesConnectees: feConnectees,
      };
      
      console.log('Inserting supervision:', date.toISOString().split('T')[0], etablissement, 'FE Recues:', feRecues, 'FE Enr:', feEnregistrees);
      
      await prisma.supervisionData.create({ data });
      supervisionCount++;
    }
    
    // Log refresh
    await prisma.dataRefreshLog.create({
      data: {
        source: 'supervision',
        recordCount: supervisionCount,
        status: 'success',
      },
    });
    
    // Fetch application data from the "report" sheets in second Google Sheet
    // These sheets have format: 20260203report, 20260204report, etc.
    // Columns: Health facilities, NB TRAINED MW, NB PRESENT MW, NB REGISTERED WOMEN
    const reportSheets = [
      { gid: '886294467', date: new Date(2026, 1, 3) },  // 20260203report - Feb 3
      { gid: '721836876', date: new Date(2026, 1, 4) },  // 20260204report - Feb 4
    ];
    
    // Get supervision data to retrieve FE Reçues
    const supervisionDataForApp = await prisma.supervisionData.findMany();
    const supervisionMap: Record<string, number> = {};
    for (const s of supervisionDataForApp) {
      const key = `${s.date.toISOString().split('T')[0]}_${s.etablissement}`;
      supervisionMap[key] = s.femmesEnceintesRecues;
    }
    
    let applicationCount = 0;
    
    for (const sheet of reportSheets) {
      try {
        const csv = await fetchGoogleSheetCSV(APPLICATION_SHEET_ID, sheet.gid);
        const rows = parseCSV(csv);
        
        console.log(`Processing report sheet gid=${sheet.gid}, date=${sheet.date.toISOString().split('T')[0]}, rows=${rows.length}`);
        
        for (const row of rows) {
          const rawEtablissement = row['Health facilities'] || '';
          const etablissement = normalizeEtablissement(rawEtablissement);
          
          if (!ETABLISSEMENTS.includes(etablissement)) {
            console.log('Skipping invalid etablissement:', rawEtablissement);
            continue;
          }
          
          // Parse columns from report sheet
          const sfFormees = parseInt(row['NB TRAINED MW'] || '0') || 0;
          const sfPresentes = parseInt(row['NB PRESENT MW'] || '0') || 0;
          const feEnregistrees = parseInt(row['NB REGISTERED WOMEN'] || '0') || 0;
          
          // FE Reçues comes from supervision data (first link)
          const supervisionKey = `${sheet.date.toISOString().split('T')[0]}_${etablissement}`;
          const feRecues = supervisionMap[supervisionKey] || 0;
          
          // FE Connectées = FE Enregistrées (as specified)
          const feConnectees = feEnregistrees;
          
          const data = {
            date: sheet.date,
            etablissement,
            sageFemmesFormees: sfFormees,
            sageFemmesPresentes: sfPresentes,
            femmesEnceintesRecues: feRecues,
            femmesEnceintesEnregistrees: feEnregistrees,
            femmesEnceintesConnectees: feConnectees,
          };
          
          console.log('Inserting application:', sheet.date.toISOString().split('T')[0], etablissement, 
            'SF Formées:', sfFormees, 'SF Présentes:', sfPresentes, 'FE Reçues:', feRecues, 'FE Enr:', feEnregistrees);
          
          await prisma.applicationData.create({ data });
          applicationCount++;
        }
      } catch (error) {
        console.error(`Error processing sheet gid=${sheet.gid}:`, error);
      }
    }
    
    await prisma.dataRefreshLog.create({
      data: {
        source: 'application',
        recordCount: applicationCount,
        status: 'success',
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      supervision: supervisionCount,
      application: applicationCount,
    });
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
