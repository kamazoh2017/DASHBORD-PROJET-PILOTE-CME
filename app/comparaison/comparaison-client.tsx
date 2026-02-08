'use client';

import { useState, useEffect } from 'react';
import { PROJECT_START_DATE, formatDateFR, ETABLISSEMENTS, countWorkingDays, DAILY_OBJECTIVE, FINAL_TARGET } from '@/lib/constants';
import KPICard from '@/components/kpi-card';
import ComparisonBarChart from '@/components/charts/comparison-bar-chart';
import { GitCompare, CheckCircle, AlertTriangle, XCircle, Loader2, TrendingUp, TrendingDown, Flag } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, Cell } from 'recharts';
import { useTranslations } from 'next-intl';

interface ComparisonItem {
  date: string;
  etablissement: string;
  supervision: any;
  application: any;
  ecartEnregistrees: number;
  ecartConnectees: number;
}

interface Stats {
  tauxConcordance: number;
  ecartMoyenEnregistrees: number;
  ecartMoyenConnectees: number;
  ecartMax: number;
  totalRecords: number;
}

export default function ComparaisonClient() {
  const t = useTranslations('comparison');
  const tCommon = useTranslations('common');
  const [comparison, setComparison] = useState<ComparisonItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const endDate = new Date();
        const res = await fetch(`/api/comparison?fromDate=${PROJECT_START_DATE.toISOString().split('T')[0]}&toDate=${endDate.toISOString().split('T')[0]}`);
        const data = await res.json();
        setComparison(data?.comparison ?? []);
        setStats(data?.stats ?? null);
      } catch (error) {
        console.error('Error fetching comparison:', error);
        setComparison([]);
        setStats(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Group by establishment
  const byEtablissement = ETABLISSEMENTS.map(etab => {
    const etabData = comparison.filter(c => c?.etablissement === etab);
    const supTotal = etabData.reduce((sum, c) => sum + (c?.supervision?.femmesEnceintesEnregistrees ?? 0), 0);
    const appTotal = etabData.reduce((sum, c) => sum + (c?.application?.femmesEnceintesEnregistrees ?? 0), 0);
    return {
      name: etab?.split(' ')?.[0] ?? etab,
      fullName: etab,
      supervision: supTotal,
      application: appTotal,
      ecart: appTotal - supTotal,
    };
  });

  // Group by date for trend
  const dateGroups = new Map<string, { supervision: number; application: number }>();
  comparison.forEach(c => {
    const dateKey = new Date(c?.date).toISOString().split('T')[0];
    const existing = dateGroups.get(dateKey) ?? { supervision: 0, application: 0 };
    dateGroups.set(dateKey, {
      supervision: existing.supervision + (c?.supervision?.femmesEnceintesEnregistrees ?? 0),
      application: existing.application + (c?.application?.femmesEnceintesEnregistrees ?? 0),
    });
  });

  const trendData = Array.from(dateGroups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => ({
      date: formatDateFR(date),
      supervision: values.supervision,
      application: values.application,
      ecart: values.application - values.supervision,
    }));

  // Filter comparison data by selected date
  const filteredComparison = selectedDate 
    ? comparison.filter(c => new Date(c?.date).toISOString().split('T')[0] === selectedDate)
    : comparison;

  // Get unique dates for filter
  const uniqueDates = [...new Set(comparison.map(c => new Date(c?.date).toISOString().split('T')[0]))].sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <GitCompare className="text-purple-600" />
          {t('pageTitle')}
        </h1>
        <p className="text-gray-600">Analyse des écarts entre les données de supervision et d'application</p>
      </div>

      {/* Statistics KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title={t('kpis.concordanceRate')}
          value={`${stats?.tauxConcordance ?? 0}%`}
          subtitle="Enregistrements identiques"
          icon={stats?.tauxConcordance && stats.tauxConcordance >= 80 ? CheckCircle : AlertTriangle}
          color={stats?.tauxConcordance && stats.tauxConcordance >= 80 ? 'green' : stats?.tauxConcordance && stats.tauxConcordance >= 50 ? 'orange' : 'red'}
        />
        <KPICard
          title={`${t('table.difference')} (${t('charts.registered')})`}
          value={stats?.ecartMoyenEnregistrees ?? 0}
          subtitle="Par enregistrement"
          icon={TrendingUp}
          color="blue"
        />
        <KPICard
          title={`${t('table.difference')} (${t('charts.connected')})`}
          value={stats?.ecartMoyenConnectees ?? 0}
          subtitle="Par enregistrement"
          icon={TrendingDown}
          color="orange"
        />
        <KPICard
          title={`${t('table.difference')} Maximum`}
          value={stats?.ecartMax ?? 0}
          subtitle="Plus grand écart détecté"
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Comparaison Progression: Cible vs Objectif vs Performance */}
      {(() => {
        const joursOuvrables = countWorkingDays(PROJECT_START_DATE, new Date());
        const objectifCumule = joursOuvrables * DAILY_OBJECTIVE;
        const totalSupervision = comparison.reduce((sum, c) => sum + (c?.supervision?.femmesEnceintesEnregistrees ?? 0), 0);
        const totalApplication = comparison.reduce((sum, c) => sum + (c?.application?.femmesEnceintesEnregistrees ?? 0), 0);
        const performanceMoyenne = Math.round((totalSupervision + totalApplication) / 2);
        
        const progressionData = [
          { name: 'Cible (27 Fév)', value: FINAL_TARGET, color: '#9333ea' },
          { name: 'Objectif à date', value: objectifCumule, color: '#3b82f6' },
          { name: `Perf. ${t('charts.supervision')}`, value: totalSupervision, color: '#f97316' },
          { name: `Perf. ${t('charts.application')}`, value: totalApplication, color: '#22c55e' },
        ];
        
        return (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Flag className="text-purple-500" size={20} />
              Comparaison des Progressions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Cible Finale (27 Fév)</p>
                <p className="text-2xl font-bold text-purple-600">{FINAL_TARGET}</p>
                <p className="text-xs text-gray-500 mt-1">100%</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Objectif à date</p>
                <p className="text-2xl font-bold text-blue-600">{objectifCumule}</p>
                <p className="text-xs text-gray-500 mt-1">{Math.round(objectifCumule / FINAL_TARGET * 100)}% de la cible</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Perf. {t('charts.supervision')}</p>
                <p className="text-2xl font-bold text-orange-600">{totalSupervision}</p>
                <p className="text-xs text-gray-500 mt-1">{Math.round(totalSupervision / FINAL_TARGET * 100)}% de la cible</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Perf. {t('charts.application')}</p>
                <p className="text-2xl font-bold text-green-600">{totalApplication}</p>
                <p className="text-xs text-gray-500 mt-1">{Math.round(totalApplication / FINAL_TARGET * 100)}% de la cible</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressionData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                  <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis tickLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="value" name="Valeur" radius={[4, 4, 0, 0]}>
                    {progressionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })()}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ComparisonBarChart 
          data={byEtablissement} 
          title={`${t('charts.comparisonByEstablishment')} (${t('charts.registered')})`}
        />
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-4">{t('charts.dailyComparison')}</h3>
          <div className="h-80">
            {trendData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                {tCommon('noDataAvailable')}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <XAxis 
                    dataKey="date" 
                    tickLine={false} 
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tickLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="supervision" name={t('charts.supervision')} stroke="#FF6B00" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="application" name={t('charts.application')} stroke="#009639" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">{t('tabs.details')}</h3>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">{tCommon('all')}</option>
            {uniqueDates.map(date => (
              <option key={date} value={date}>{formatDateFR(date)}</option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">{tCommon('date')}</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">{t('table.establishment')}</th>
                <th className="px-4 py-3 text-center text-orange-600 font-semibold">{t('table.supervisionRegistered')}</th>
                <th className="px-4 py-3 text-center text-green-600 font-semibold">{t('table.applicationRegistered')}</th>
                <th className="px-4 py-3 text-center text-gray-700 font-semibold">{t('table.difference')}</th>
                <th className="px-4 py-3 text-center text-orange-600 font-semibold">{t('table.supervisionConnected')}</th>
                <th className="px-4 py-3 text-center text-green-600 font-semibold">{t('table.applicationConnected')}</th>
                <th className="px-4 py-3 text-center text-gray-700 font-semibold">{t('table.difference')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredComparison.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    {tCommon('noDataAvailable')}
                  </td>
                </tr>
              ) : (
                filteredComparison.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{formatDateFR(item?.date)}</td>
                    <td className="px-4 py-3 font-medium">{item?.etablissement ?? '-'}</td>
                    <td className="px-4 py-3 text-center text-orange-600">
                      {item?.supervision?.femmesEnceintesEnregistrees ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-center text-green-600">
                      {item?.application?.femmesEnceintesEnregistrees ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        item?.ecartEnregistrees === 0 ? 'bg-green-100 text-green-700' :
                        Math.abs(item?.ecartEnregistrees ?? 0) <= 2 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {item?.ecartEnregistrees > 0 ? '+' : ''}{item?.ecartEnregistrees ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-orange-600">
                      {item?.supervision?.femmesEnceintesConnectees ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-center text-green-600">
                      {item?.application?.femmesEnceintesConnectees ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        item?.ecartConnectees === 0 ? 'bg-green-100 text-green-700' :
                        Math.abs(item?.ecartConnectees ?? 0) <= 2 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {item?.ecartConnectees > 0 ? '+' : ''}{item?.ecartConnectees ?? 0}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ecart by establishment detail */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6">
        <h3 className="font-semibold text-gray-800 mb-4">{t('charts.comparisonByEstablishment')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {byEtablissement.map((item, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-lg border ${
                item.ecart === 0 ? 'border-green-200 bg-green-50' :
                Math.abs(item.ecart) <= 5 ? 'border-yellow-200 bg-yellow-50' :
                'border-red-200 bg-red-50'
              }`}
            >
              <h4 className="font-medium text-gray-800 mb-2">{item.fullName}</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">{t('charts.supervision')}</p>
                  <p className="font-semibold text-orange-600">{item.supervision}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t('charts.application')}</p>
                  <p className="font-semibold text-green-600">{item.application}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t('table.difference')}</p>
                  <p className={`font-semibold ${
                    item.ecart === 0 ? 'text-green-600' :
                    item.ecart > 0 ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    {item.ecart > 0 ? '+' : ''}{item.ecart}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
