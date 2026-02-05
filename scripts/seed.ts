import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ETABLISSEMENTS = [
  'CHU COCODY',
  'CHR ABOBO',
  'HG YOPOUGON-ATTIE',
  'HG BINGERVILLE',
  'FSU WILLIAMSVILLE'
];

// Nombre de sage-femmes formées par établissement (données réelles)
const SAGE_FEMMES_FORMEES: Record<string, number> = {
  'CHU COCODY': 12,
  'CHR ABOBO': 10,
  'HG YOPOUGON-ATTIE': 8,
  'HG BINGERVILLE': 8,
  'FSU WILLIAMSVILLE': 6
};

const PROJECT_START = new Date('2026-02-03');
const PROJECT_END = new Date('2026-02-05'); // Data up to today

function isWorkingDay(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.supervisionData.deleteMany();
  await prisma.applicationData.deleteMany();
  await prisma.dataRefreshLog.deleteMany();

  const currentDate = new Date(PROJECT_START);
  
  while (currentDate <= PROJECT_END) {
    if (isWorkingDay(currentDate)) {
      for (const etablissement of ETABLISSEMENTS) {
        // Utiliser les valeurs fixes de SF formées par établissement
        const sageFemmesFormees = SAGE_FEMMES_FORMEES[etablissement];
        const sageFemmesPresentes = getRandomInt(Math.floor(sageFemmesFormees * 0.5), sageFemmesFormees);
        const femmesRecues = getRandomInt(6, 15);
        const femmesEnregistrees = getRandomInt(3, Math.min(femmesRecues, 8));
        const femmesConnectees = getRandomInt(2, femmesEnregistrees);

        // Supervision data
        await prisma.supervisionData.create({
          data: {
            date: new Date(currentDate),
            etablissement,
            sageFemmesFormees,
            sageFemmesPresentes,
            femmesEnceintesRecues: femmesRecues,
            femmesEnceintesEnregistrees: femmesEnregistrees,
            femmesEnceintesConnectees: femmesConnectees,
          },
        });

        // Application data (with slight variations to show discrepancies)
        // Pour les données app: FE Enregistrées = FE Connectées (même valeur)
        const appFemmesEnregistrees = Math.max(0, femmesEnregistrees + getRandomInt(-1, 1));
        await prisma.applicationData.create({
          data: {
            date: new Date(currentDate),
            etablissement,
            sageFemmesFormees,
            sageFemmesPresentes: Math.max(0, sageFemmesPresentes + getRandomInt(-1, 1)),
            femmesEnceintesRecues: femmesRecues,
            femmesEnceintesEnregistrees: appFemmesEnregistrees,
            femmesEnceintesConnectees: appFemmesEnregistrees, // Même valeur car pas de distinction
          },
        });
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Log the refresh
  await prisma.dataRefreshLog.create({
    data: {
      source: 'seed',
      recordCount: 15, // 3 days * 5 establishments
      status: 'success',
    },
  });

  console.log('Database seeded successfully!');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
