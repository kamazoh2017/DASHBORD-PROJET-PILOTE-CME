import { prisma } from '../lib/db';

async function main() {
  console.log("=== DONNEES DE SUPERVISION ===");
  const supervision = await prisma.supervisionData.findMany({
    orderBy: [{ date: 'asc' }, { etablissement: 'asc' }]
  });
  supervision.forEach(s => {
    const dateStr = s.date.toISOString().split('T')[0];
    console.log(dateStr + " | " + s.etablissement.padEnd(20) + " | SF Form: " + s.sageFemmesFormees + " | SF Pres: " + s.sageFemmesPresentes + " | FE Rec: " + s.femmesEnceintesRecues + " | FE Enr: " + s.femmesEnceintesEnregistrees);
  });
  
  console.log("\n=== DONNEES D'APPLICATION ===");
  const application = await prisma.applicationData.findMany({
    orderBy: [{ date: 'asc' }, { etablissement: 'asc' }]
  });
  application.forEach(a => {
    const dateStr = a.date.toISOString().split('T')[0];
    console.log(dateStr + " | " + a.etablissement.padEnd(20) + " | SF Form: " + a.sageFemmesFormees + " | SF Pres: " + a.sageFemmesPresentes + " | FE Rec: " + a.femmesEnceintesRecues + " | FE Enr: " + a.femmesEnceintesEnregistrees);
  });
}

main().finally(() => prisma.$disconnect());
