'use client';

import { useState, useEffect } from 'react';
import DateFilter from '@/components/date-filter';
import DataTable from '@/components/data-table';
import ObjectiveChart from '@/components/charts/objective-chart';
import CumulativeChart from '@/components/charts/cumulative-chart';
import SageFemmeChart from '@/components/charts/sage-femme-chart';
import KPICard from '@/components/kpi-card';
import { DailyData } from '@/lib/types';
import { PROJECT_START_DATE, countWorkingDays, DAILY_OBJECTIVE, formatDateFR, ETABLISSEMENTS, isDayDataAvailable, FINAL_TARGET } from '@/lib/constants';
import { Users, UserCheck, Target, Calendar, Loader2, AlertCircle, Flag } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useTranslations } from 'next-intl';

// Composant pour le tableau cumulé par établissement
function CumulativeTable({ data, title }: { data: DailyData[]; title: string }) {
  const t = useTranslations('supervision');
  const tCommon = useTranslations('common');
  // Agréger les données par établissement
  const aggregatedData = ETABLISSEMENTS.map(etab => {
    const etabData = data.filter(d => d.etablissement === etab);
    return {
      etablissement: etab,
      sageFemmesFormees: etabData.length > 0 ? etabData[0].sageFemmesFormees : 0,
      sageFemmesPresentes: etabData.reduce((sum, d) => sum + (d.sageFemmesPresentes ?? 0), 0),
      femmesEnceintesRecues: etabData.reduce((sum, d) => sum + (d.femmesEnceintesRecues ?? 0), 0),
      femmesEnceintesEnregistrees: etabData.reduce((sum, d) => sum + (d.femmesEnceintesEnregistrees ?? 0), 0),
      femmesEnceintesConnectees: etabData.reduce((sum, d) => sum + (d.femmesEnceintesConnectees ?? 0), 0),
    };
  });

  const totals = {
    sageFemmesFormees: aggregatedData.reduce((sum, d) => sum + d.sageFemmesFormees, 0),
    sageFemmesPresentes: aggregatedData.reduce((sum, d) => sum + d.sageFemmesPresentes, 0),
    femmesEnceintesRecues: aggregatedData.reduce((sum, d) => sum + d.femmesEnceintesRecues, 0),
    femmesEnceintesEnregistrees: aggregatedData.reduce((sum, d) => sum + d.femmesEnceintesEnregistrees, 0),
    femmesEnceintesConnectees: aggregatedData.reduce((sum, d) => sum + d.femmesEnceintesConnectees, 0),
  };

  const getTauxEnregistrement = (recues: number, enregistrees: number) => {
    return recues > 0 ? Math.round((enregistrees / recues) * 100) : 0;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-blue-50 border-b">
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-3 text-left text-gray-700 font-semibold">{t('table.establishment')}</th>
              <th className="px-3 py-3 text-center text-gray-700 font-semibold">{t('table.trainedMidwives')}</th>
              <th className="px-3 py-3 text-center text-gray-700 font-semibold">{t('table.presentMidwives')}</th>
              <th className="px-3 py-3 text-center text-gray-700 font-semibold">{t('table.receivedPregnant')}</th>
              <th className="px-3 py-3 text-center text-gray-700 font-semibold">{t('table.registeredPregnant')}</th>
              <th className="px-3 py-3 text-center text-gray-700 font-semibold">{t('table.registrationRate')}</th>
              <th className="px-3 py-3 text-center text-gray-700 font-semibold">{t('table.connectedPregnant')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {aggregatedData.map((row, idx) => {
              const tauxEnreg = getTauxEnregistrement(row.femmesEnceintesRecues, row.femmesEnceintesEnregistrees);
              return (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-3 font-medium text-gray-800">{row.etablissement}</td>
                  <td className="px-3 py-3 text-center">{row.sageFemmesFormees}</td>
                  <td className="px-3 py-3 text-center">{row.sageFemmesPresentes}</td>
                  <td className="px-3 py-3 text-center text-blue-600">{row.femmesEnceintesRecues}</td>
                  <td className="px-3 py-3 text-center text-orange-600 font-medium">{row.femmesEnceintesEnregistrees}</td>
                  <td className="px-3 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      tauxEnreg >= 80 ? 'bg-green-100 text-green-700' :
                      tauxEnreg >= 50 ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {tauxEnreg}%
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center text-green-600 font-medium">{row.femmesEnceintesConnectees}</td>
                </tr>
              );
            })}
            <tr className="bg-blue-50 font-semibold">
              <td className="px-3 py-3">{tCommon('total')}</td>
              <td className="px-3 py-3 text-center">{totals.sageFemmesFormees}</td>
              <td className="px-3 py-3 text-center">{totals.sageFemmesPresentes}</td>
              <td className="px-3 py-3 text-center text-blue-600">{totals.femmesEnceintesRecues}</td>
              <td className="px-3 py-3 text-center text-orange-600">{totals.femmesEnceintesEnregistrees}</td>
              <td className="px-3 py-3 text-center">
                <span className="px-2 py-1 rounded text-xs bg-gray-100">
                  {getTauxEnregistrement(totals.femmesEnceintesRecues, totals.femmesEnceintesEnregistrees)}%
                </span>
              </td>
              <td className="px-3 py-3 text-center text-green-600">{totals.femmesEnceintesConnectees}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SupervisionClient() {
  const t = useTranslations('supervision');
  const tCommon = useTranslations('common');
  const [selectedDate, setSelectedDate] = useState('2026-02-05');
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [cumulativeData, setCumulativeData] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataAvailable, setDataAvailable] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // Vérifier si les données du jour sont disponibles (après 14h)
      const selectedDateObj = new Date(selectedDate);
      const now = new Date();
      const isAvailable = isDayDataAvailable(selectedDateObj, now);
      setDataAvailable(isAvailable);
      
      if (!isAvailable) {
        setDailyData([]);
        setCumulativeData([]);
        setLoading(false);
        return;
      }
      
      try {
        // Fetch daily data
        const dailyRes = await fetch(`/api/supervision?date=${selectedDate}`);
        const daily = await dailyRes.json();
        setDailyData(Array.isArray(daily) ? daily : []);

        // Fetch cumulative data
        const cumRes = await fetch(`/api/supervision?fromDate=${PROJECT_START_DATE.toISOString().split('T')[0]}&toDate=${selectedDate}`);
        const cumulative = await cumRes.json();
        setCumulativeData(Array.isArray(cumulative) ? cumulative : []);
      } catch (error) {
        console.error('Error fetching supervision data:', error);
        setDailyData([]);
        setCumulativeData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedDate]);

  // Calculate totals
  const dailyTotals = {
    enregistrees: dailyData.reduce((sum, d) => sum + (d?.femmesEnceintesEnregistrees ?? 0), 0),
    connectees: dailyData.reduce((sum, d) => sum + (d?.femmesEnceintesConnectees ?? 0), 0),
  };

  const cumulativeTotals = {
    enregistrees: cumulativeData.reduce((sum, d) => sum + (d?.femmesEnceintesEnregistrees ?? 0), 0),
    connectees: cumulativeData.reduce((sum, d) => sum + (d?.femmesEnceintesConnectees ?? 0), 0),
  };

  const joursOuvrables = countWorkingDays(PROJECT_START_DATE, new Date(selectedDate));
  const objectifCumule = joursOuvrables * DAILY_OBJECTIVE;

  // Chart data avec noms complets des établissements
  const dailyChartData = dailyData.map(d => ({
    name: d?.etablissement ?? 'N/A',
    enregistrees: d?.femmesEnceintesEnregistrees ?? 0,
    connectees: d?.femmesEnceintesConnectees ?? 0,
  }));

  // Group cumulative by date for chart
  const dateGroups = new Map<string, { enregistrees: number; connectees: number }>();
  cumulativeData.forEach(d => {
    const dateKey = new Date(d?.date).toISOString().split('T')[0];
    const existing = dateGroups.get(dateKey) ?? { enregistrees: 0, connectees: 0 };
    dateGroups.set(dateKey, {
      enregistrees: existing.enregistrees + (d?.femmesEnceintesEnregistrees ?? 0),
      connectees: existing.connectees + (d?.femmesEnceintesConnectees ?? 0),
    });
  });

  let runningTotal = 0;
  const cumulativeChartData = Array.from(dateGroups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => {
      runningTotal += values.enregistrees;
      const days = countWorkingDays(PROJECT_START_DATE, new Date(date));
      return {
        date: formatDateFR(date),
        objectif: days * DAILY_OBJECTIVE,
        performance: runningTotal,
      };
    });

  // Sage-femme chart data avec noms complets
  const sageFemmeData = dailyData.map(d => ({
    etablissement: d?.etablissement ?? 'N/A',
    formees: d?.sageFemmesFormees ?? 0,
    presentes: d?.sageFemmesPresentes ?? 0,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t('pageTitle')}</h1>
        <p className="text-gray-600">Données collectées par les superviseurs terrain (1er lien Google Sheets)</p>
      </div>

      <div className="mb-6">
        <DateFilter selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      {/* Avertissement si données non disponibles */}
      {!dataAvailable && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="text-yellow-600" size={24} />
          <div>
            <p className="font-medium text-yellow-800">{tCommon('noDataAvailable')}</p>
            <p className="text-sm text-yellow-600">Les données du jour sont disponibles à partir de 14h. Sélectionnez une date antérieure ou revenez après 14h.</p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title={t('kpis.registeredPregnant')}
          value={dailyTotals.enregistrees}
          subtitle={`Objectif: ${DAILY_OBJECTIVE}`}
          icon={Users}
          color={dailyTotals.enregistrees >= DAILY_OBJECTIVE ? 'green' : 'orange'}
        />
        <KPICard
          title={t('kpis.connectedPregnant')}
          value={dailyTotals.connectees}
          icon={UserCheck}
          color="green"
        />
        <KPICard
          title={`${tCommon('total')} ${t('kpis.registeredPregnant')}`}
          value={cumulativeTotals.enregistrees}
          subtitle={`Objectif: ${objectifCumule} | Cible: ${FINAL_TARGET}`}
          icon={Target}
          color={cumulativeTotals.enregistrees >= objectifCumule ? 'green' : 'orange'}
        />
        <KPICard
          title="Jours Ouvrables"
          value={joursOuvrables}
          subtitle="Depuis le 03/02/2026"
          icon={Calendar}
          color="blue"
        />
      </div>

      {/* Data Tables - 2 tableaux distincts */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Tableau 1: Données du jour */}
        <DataTable 
          data={dailyData} 
          title={`📅 Tableau 1 : Données du ${formatDateFR(selectedDate)}`} 
          showTotal 
          hideDate
        />
        
        {/* Tableau 2: Données cumulées */}
        <CumulativeTable 
          data={cumulativeData}
          title={`📊 Tableau 2 : Données cumulées du 03/02/2026 au ${formatDateFR(selectedDate)}`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ObjectiveChart 
          data={dailyChartData} 
          title={`${t('charts.dailyEvolution')} vs Objectif (22 FE)`}
          showObjectiveLine
        />
        <CumulativeChart 
          data={cumulativeChartData} 
          title="Objectif Cumulé vs Performance Cumulée" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SageFemmeChart 
          data={sageFemmeData} 
          title={`${t('charts.midwives')} ${t('charts.byEstablishment')}`}
        />
        {/* Chart SF Présentes - Histogramme empilé */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-4">{t('charts.midwives')} {t('charts.byEstablishment')}</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sageFemmeData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <XAxis 
                  dataKey="etablissement" 
                  tickLine={false} 
                  tick={{ fontSize: 9 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
                <Bar 
                  dataKey="presentes" 
                  name={t('table.presentMidwives')}
                  fill="#009639" 
                  radius={[4, 4, 0, 0]}
                  stackId="sf"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
