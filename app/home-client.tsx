'use client';

import { Users, UserCheck, Target, Calendar, Building2, TrendingUp, RefreshCw, Flag, Loader2, FileDown, CalendarRange } from 'lucide-react';
import KPICard from '@/components/kpi-card';
import PeriodFilter from '@/components/period-filter';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ReferenceLine, LineChart, Line } from 'recharts';
import { formatDateFR, FINAL_TARGET, PROJECT_START_DATE } from '@/lib/constants';
import { useState, useEffect, useCallback, useRef } from 'react';

interface HomeData {
  totalEnregistrees: number;
  totalConnectees: number;
  totalRecues: number;
  objectifCumule: number;
  tauxAtteinte: number;
  joursOuvrables: number;
  totalJours: number;
  lastRefresh: string | null;
  startDate: string;
  endDate: string;
  byEtablissement: { etablissement: string; totalEnregistrees: number; totalConnectees: number; totalRecues: number }[];
  dailyData: { date: string; enregistrees: number; connectees: number; recues: number }[];
  hasData: boolean;
}

interface HomeClientProps {
  data: HomeData & { displayDate?: string };
}

const COLORS = ['#FF6B00', '#009639', '#60B5FF', '#FF90BB', '#A19AD3'];

// Composant Badge de Période
function PeriodBadge({ startDate, endDate }: { startDate: string; endDate: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
      <CalendarRange size={12} />
      {formatDateFR(startDate)} → {formatDateFR(endDate)}
    </span>
  );
}

export default function HomeClient({ data: initialData }: HomeClientProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [data, setData] = useState<HomeData>(initialData as HomeData);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Initialize dates
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const projectStartStr = PROJECT_START_DATE.toISOString().split('T')[0];
  
  const [startDate, setStartDate] = useState(projectStartStr);
  const [endDate, setEndDate] = useState(initialData?.endDate || todayStr);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = useCallback(async (start: string, end: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/home?startDate=${start}&endDate=${end}`);
      if (response.ok) {
        const newData = await response.json();
        setData(newData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePeriodChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    fetchData(newStartDate, newEndDate);
  };

  // Export PDF
  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const htmlContent = generatePDFContent();
      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html_content: htmlContent,
          filename: `rapport_accueil_${startDate}_${endDate}.pdf`,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport_accueil_${startDate}_${endDate}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const errorData = await response.json();
        alert(`Erreur lors de l'export: ${errorData.error || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Erreur lors de l\'export PDF');
    } finally {
      setExporting(false);
    }
  };

  const generatePDFContent = () => {
    const periodLabel = `${formatDateFR(startDate)} → ${formatDateFR(endDate)}`;
    const tauxEnrGlobal = data.totalRecues > 0 ? Math.round(data.totalEnregistrees / data.totalRecues * 100) : 0;
    const tauxConnGlobal = data.totalEnregistrees > 0 ? Math.round(data.totalConnectees / data.totalEnregistrees * 100) : 0;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Rapport Tableau de Bord - Phase Pilote</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; color: #333; padding: 20px; }
          .header { text-align: center; margin-bottom: 25px; border-bottom: 3px solid #FF6B00; padding-bottom: 15px; }
          .header h1 { color: #FF6B00; font-size: 22px; margin-bottom: 5px; }
          .header h2 { color: #666; font-size: 14px; font-weight: normal; }
          .period-badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 5px 12px; border-radius: 20px; font-size: 12px; margin-top: 10px; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 14px; font-weight: bold; color: #333; margin-bottom: 10px; padding: 8px; background: #f8f9fa; border-left: 4px solid #FF6B00; }
          .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
          .kpi-card { padding: 15px; border-radius: 8px; text-align: center; }
          .kpi-card.orange { background: #fff7ed; border: 1px solid #fdba74; }
          .kpi-card.green { background: #f0fdf4; border: 1px solid #86efac; }
          .kpi-card.blue { background: #eff6ff; border: 1px solid #93c5fd; }
          .kpi-card.red { background: #fef2f2; border: 1px solid #fca5a5; }
          .kpi-card .value { font-size: 24px; font-weight: bold; }
          .kpi-card.orange .value { color: #ea580c; }
          .kpi-card.green .value { color: #16a34a; }
          .kpi-card.blue .value { color: #2563eb; }
          .kpi-card.red .value { color: #dc2626; }
          .kpi-card .label { font-size: 10px; color: #666; margin-top: 5px; }
          .comparison-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 15px; }
          .comparison-card { padding: 15px; border-radius: 8px; text-align: center; }
          .comparison-card.purple { background: #faf5ff; border: 1px solid #c4b5fd; }
          .comparison-card.blue { background: #eff6ff; border: 1px solid #93c5fd; }
          .comparison-card.green { background: #f0fdf4; border: 1px solid #86efac; }
          .comparison-card .value { font-size: 28px; font-weight: bold; }
          .comparison-card.purple .value { color: #7c3aed; }
          .comparison-card.blue .value { color: #2563eb; }
          .comparison-card.green .value { color: #16a34a; }
          .progress-bar { height: 20px; background: #e5e7eb; border-radius: 10px; overflow: hidden; position: relative; margin: 10px 0; }
          .progress-fill { height: 100%; position: absolute; left: 0; top: 0; }
          .progress-fill.blue { background: #60a5fa; }
          .progress-fill.green { background: #22c55e; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { padding: 8px 10px; text-align: left; border: 1px solid #e5e7eb; }
          th { background: #f8f9fa; font-weight: 600; font-size: 10px; }
          td { font-size: 10px; }
          tr:nth-child(even) { background: #fafafa; }
          tr.total { background: #fff7ed; font-weight: bold; }
          .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 9px; }
          .badge.green { background: #dcfce7; color: #166534; }
          .badge.orange { background: #ffedd5; color: #c2410c; }
          .badge.red { background: #fee2e2; color: #991b1b; }
          .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #e5e7eb; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Tableau de Bord - Phase Pilote</h1>
          <h2>Digitalisation du Carnet Mère-Enfant - Côte d'Ivoire</h2>
          <div class="period-badge">📅 Période : ${periodLabel}</div>
        </div>

        <div class="section">
          <div class="section-title">📊 Indicateurs Clés de Performance</div>
          <div class="kpi-grid">
            <div class="kpi-card orange">
              <div class="value">${data.totalEnregistrees}</div>
              <div class="label">FE Enregistrées</div>
            </div>
            <div class="kpi-card green">
              <div class="value">${data.totalConnectees}</div>
              <div class="label">FE Connectées</div>
            </div>
            <div class="kpi-card blue">
              <div class="value">${data.objectifCumule}</div>
              <div class="label">Objectif Cumulé (${data.joursOuvrables}j × 22)</div>
            </div>
            <div class="kpi-card ${data.tauxAtteinte >= 100 ? 'green' : data.tauxAtteinte >= 75 ? 'orange' : 'red'}">
              <div class="value">${data.tauxAtteinte}%</div>
              <div class="label">Taux d'Atteinte</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">🎯 Comparaison : Performance vs Objectif vs Cible Finale</div>
          <div class="comparison-grid">
            <div class="comparison-card purple">
              <div class="value">${FINAL_TARGET}</div>
              <div class="label" style="color: #6b21a8;">Cible Finale (27 Fév) - 100%</div>
            </div>
            <div class="comparison-card blue">
              <div class="value">${data.objectifCumule}</div>
              <div class="label" style="color: #1e40af;">${Math.round(data.objectifCumule / FINAL_TARGET * 100)}% de la cible</div>
            </div>
            <div class="comparison-card green">
              <div class="value">${data.totalEnregistrees}</div>
              <div class="label" style="color: #166534;">${Math.round(data.totalEnregistrees / FINAL_TARGET * 100)}% Performance</div>
            </div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill blue" style="width: ${Math.min(data.objectifCumule / FINAL_TARGET * 100, 100)}%;"></div>
            <div class="progress-fill green" style="width: ${Math.min(data.totalEnregistrees / FINAL_TARGET * 100, 100)}%;"></div>
          </div>
          <p style="text-align: center; margin-top: 5px; font-size: 11px;">
            ${data.totalEnregistrees >= data.objectifCumule 
              ? '<span style="color: #16a34a;">✓ Objectif atteint</span>' 
              : `<span style="color: #dc2626;">Écart: ${data.objectifCumule - data.totalEnregistrees} FE</span>`}
          </p>
        </div>

        <div class="section">
          <div class="section-title">🏥 Résumé par Établissement</div>
          <table>
            <thead>
              <tr>
                <th>Établissement</th>
                <th style="text-align: center;">FE Reçues</th>
                <th style="text-align: center;">FE Enregistrées</th>
                <th style="text-align: center;">Taux Enr.</th>
                <th style="text-align: center;">FE Connectées</th>
                <th style="text-align: center;">Taux Conn.</th>
              </tr>
            </thead>
            <tbody>
              ${data.byEtablissement.map(item => {
                const tauxEnr = item.totalRecues > 0 ? Math.round(item.totalEnregistrees / item.totalRecues * 100) : 0;
                const tauxConn = item.totalEnregistrees > 0 ? Math.round(item.totalConnectees / item.totalEnregistrees * 100) : 0;
                return `
                  <tr>
                    <td>${item.etablissement}</td>
                    <td style="text-align: center;">${item.totalRecues}</td>
                    <td style="text-align: center;">${item.totalEnregistrees}</td>
                    <td style="text-align: center;"><span class="badge ${tauxEnr >= 80 ? 'green' : tauxEnr >= 50 ? 'orange' : 'red'}">${tauxEnr}%</span></td>
                    <td style="text-align: center;">${item.totalConnectees}</td>
                    <td style="text-align: center;"><span class="badge ${tauxConn >= 80 ? 'green' : tauxConn >= 50 ? 'orange' : 'red'}">${tauxConn}%</span></td>
                  </tr>
                `;
              }).join('')}
              <tr class="total">
                <td>TOTAL</td>
                <td style="text-align: center;">${data.totalRecues}</td>
                <td style="text-align: center;">${data.totalEnregistrees}</td>
                <td style="text-align: center;"><span class="badge">${tauxEnrGlobal}%</span></td>
                <td style="text-align: center;">${data.totalConnectees}</td>
                <td style="text-align: center;"><span class="badge">${tauxConnGlobal}%</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>Rapport généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
          <p>Phase Pilote Digitalisation Carnet Mère-Enfant - Côte d'Ivoire</p>
        </div>
      </body>
      </html>
    `;
  };

  // Utiliser les noms complets des établissements
  const chartData = data?.byEtablissement?.map((item) => ({
    name: item?.etablissement ?? '',
    enregistrees: item?.totalEnregistrees ?? 0,
    connectees: item?.totalConnectees ?? 0,
  })) ?? [];

  const pieData = data?.byEtablissement?.map((item) => ({
    name: item?.etablissement ?? '',
    value: item?.totalEnregistrees ?? 0,
  })) ?? [];

  if (!mounted) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={contentRef}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tableau de Bord - Phase Pilote</h1>
          <p className="text-gray-600">Digitalisation du Carnet Mère-Enfant - Côte d'Ivoire</p>
        </div>
        <div className="flex items-center gap-4">
          {data?.lastRefresh && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <RefreshCw size={16} />
              <span>Dernière actualisation: {formatDateFR(data.lastRefresh)}</span>
            </div>
          )}
          {/* Bouton Export PDF */}
          <button
            onClick={handleExportPDF}
            disabled={exporting || !data?.hasData}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Export en cours...</span>
              </>
            ) : (
              <>
                <FileDown size={18} />
                <span>Exporter PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filtre de période */}
      <PeriodFilter
        startDate={startDate}
        endDate={endDate}
        onPeriodChange={handlePeriodChange}
      />

      {/* Indicateur de chargement */}
      {loading && (
        <div className="flex items-center justify-center gap-2 text-orange-500 mb-4">
          <Loader2 className="animate-spin" size={20} />
          <span>Chargement des données...</span>
        </div>
      )}

      {!data?.hasData ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <RefreshCw size={48} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-xl font-semibold text-yellow-700 mb-2">Aucune donnée disponible</h2>
          <p className="text-yellow-600 mb-4">
            Cliquez sur le bouton "Actualiser les données" dans la barre latérale pour charger les données depuis Google Sheets.
          </p>
        </div>
      ) : (
        <>
          {/* KPI Cards - Ligne 1 */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Indicateurs Clés de Performance</h3>
              <PeriodBadge startDate={startDate} endDate={endDate} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Femmes Enceintes Enregistrées"
                value={data?.totalEnregistrees ?? 0}
                subtitle="Total cumulé"
                icon={Users}
                color="orange"
              />
              <KPICard
                title="Femmes Enceintes Connectées"
                value={data?.totalConnectees ?? 0}
                subtitle="À Mama Info"
                icon={UserCheck}
                color="green"
              />
              <KPICard
                title="Objectif Cumulé FE Enregistrées"
                value={data?.objectifCumule ?? 0}
                subtitle={`${data?.joursOuvrables ?? 0} jours × 22`}
                icon={Target}
                color="blue"
              />
              <KPICard
                title="Taux d'Atteinte"
                value={`${data?.tauxAtteinte ?? 0}%`}
                subtitle="vs objectif cumulé"
                icon={TrendingUp}
                color={data?.tauxAtteinte >= 100 ? 'green' : data?.tauxAtteinte >= 75 ? 'orange' : 'red'}
              />
            </div>
          </div>

          {/* Card de comparaison Performance / Objectif / Cible finale */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Flag className="text-orange-500" size={20} />
                Comparaison : Performance vs Objectif vs Cible Finale
              </h3>
              <PeriodBadge startDate={startDate} endDate={endDate} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Cible Finale en premier */}
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Cible Finale (27 Février)</p>
                <p className="text-3xl font-bold text-purple-600">{FINAL_TARGET}</p>
                <p className="text-xs text-gray-500 mt-1">100%</p>
              </div>
              {/* 2. Objectif Cumulé */}
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Objectif Cumulé à date</p>
                <p className="text-3xl font-bold text-blue-600">{data?.objectifCumule ?? 0}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((data?.objectifCumule ?? 0) / FINAL_TARGET * 100)}% de la cible | {data?.joursOuvrables ?? 0} jours × 22
                </p>
              </div>
              {/* 3. FE Enregistrées */}
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">FE Enregistrées à date</p>
                <p className="text-3xl font-bold text-green-600">{data?.totalEnregistrees ?? 0}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((data?.totalEnregistrees ?? 0) / FINAL_TARGET * 100)}% Performance actuelle
                </p>
              </div>
            </div>
            {/* Barres de progression superposées */}
            <div className="mt-6">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>0</span>
                <span>Cible: {FINAL_TARGET}</span>
              </div>
              <div className="h-6 bg-gray-200 rounded-full overflow-hidden relative">
                {/* Barre de l'objectif cumulé (bleu) */}
                <div 
                  className="absolute h-full bg-blue-400 flex items-center justify-end pr-2"
                  style={{ width: `${Math.min((data?.objectifCumule ?? 0) / FINAL_TARGET * 100, 100)}%` }}
                >
                  <span className="text-xs text-white font-medium drop-shadow">
                    Objectif: {Math.round((data?.objectifCumule ?? 0) / FINAL_TARGET * 100)}%
                  </span>
                </div>
                {/* Barre de la performance (vert) */}
                <div 
                  className="absolute h-full bg-green-500 flex items-center justify-end pr-2"
                  style={{ width: `${Math.min((data?.totalEnregistrees ?? 0) / FINAL_TARGET * 100, 100)}%` }}
                >
                  <span className="text-xs text-white font-medium drop-shadow">
                    Perf: {Math.round((data?.totalEnregistrees ?? 0) / FINAL_TARGET * 100)}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-xs mt-2">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-green-500 rounded"></span>
                    <span className="text-green-600 font-medium">Performance: {data?.totalEnregistrees ?? 0} ({Math.round((data?.totalEnregistrees ?? 0) / FINAL_TARGET * 100)}%)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-blue-400 rounded"></span>
                    <span className="text-blue-600 font-medium">Objectif: {data?.objectifCumule ?? 0} ({Math.round((data?.objectifCumule ?? 0) / FINAL_TARGET * 100)}%)</span>
                  </span>
                </div>
                <span className={`font-medium ${(data?.totalEnregistrees ?? 0) >= (data?.objectifCumule ?? 0) ? 'text-green-600' : 'text-red-600'}`}>
                  {(data?.totalEnregistrees ?? 0) >= (data?.objectifCumule ?? 0) ? '✓ Objectif atteint' : `Écart: ${(data?.objectifCumule ?? 0) - (data?.totalEnregistrees ?? 0)} FE`}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Performance par Établissement</h3>
                <PeriodBadge startDate={startDate} endDate={endDate} />
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                    <XAxis 
                      dataKey="name" 
                      tickLine={false} 
                      tick={{ fontSize: 9 }}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                    />
                    <YAxis tickLine={false} tick={{ fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ fontSize: 11, borderRadius: 8 }}
                      formatter={(value: number, name: string) => [value, name === 'enregistrees' ? 'FE Enregistrées' : 'FE Connectées']}
                    />
                    <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="enregistrees" name="FE Enregistrées" fill="#FF6B00" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="connectees" name="FE Connectées" fill="#009639" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Répartition des Enregistrements par Établissement</h3>
                <PeriodBadge startDate={startDate} endDate={endDate} />
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="45%"
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={true}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ fontSize: 11, borderRadius: 8 }}
                      formatter={(value: number, name: string) => [value, name]}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      wrapperStyle={{ fontSize: 10, paddingTop: 10 }}
                      formatter={(value) => <span className="text-gray-700">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Résumé par Établissement</h3>
              <PeriodBadge startDate={startDate} endDate={endDate} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-700 font-semibold">Établissement</th>
                    <th className="px-4 py-3 text-center text-gray-700 font-semibold">FE Reçues</th>
                    <th className="px-4 py-3 text-center text-gray-700 font-semibold">FE Enregistrées</th>
                    <th className="px-4 py-3 text-center text-gray-700 font-semibold">Taux Enregistrement</th>
                    <th className="px-4 py-3 text-center text-gray-700 font-semibold">FE Connectées</th>
                    <th className="px-4 py-3 text-center text-gray-700 font-semibold">Taux Connexion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data?.byEtablissement?.map((item, idx) => {
                    const tauxEnregistrement = item?.totalRecues > 0 
                      ? Math.round((item?.totalEnregistrees / item?.totalRecues) * 100) 
                      : 0;
                    const tauxConnexion = item?.totalEnregistrees > 0 
                      ? Math.round((item?.totalConnectees / item?.totalEnregistrees) * 100) 
                      : 0;
                    return (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{item?.etablissement ?? '-'}</td>
                        <td className="px-4 py-3 text-center text-blue-600 font-medium">{item?.totalRecues ?? 0}</td>
                        <td className="px-4 py-3 text-center text-orange-600 font-medium">{item?.totalEnregistrees ?? 0}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-sm ${
                            tauxEnregistrement >= 80 ? 'bg-green-100 text-green-700' :
                            tauxEnregistrement >= 50 ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {tauxEnregistrement}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-green-600 font-medium">{item?.totalConnectees ?? 0}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-sm ${
                            tauxConnexion >= 80 ? 'bg-green-100 text-green-700' :
                            tauxConnexion >= 50 ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {tauxConnexion}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {/* Ligne Total */}
                  {data?.byEtablissement && data.byEtablissement.length > 0 && (
                    <tr className="bg-orange-50 font-semibold">
                      <td className="px-4 py-3">TOTAL</td>
                      <td className="px-4 py-3 text-center text-blue-600">{data.totalRecues ?? 0}</td>
                      <td className="px-4 py-3 text-center text-orange-600">{data.totalEnregistrees ?? 0}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-1 rounded text-sm bg-gray-100">
                          {data.totalRecues > 0 ? Math.round(data.totalEnregistrees / data.totalRecues * 100) : 0}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-green-600">{data.totalConnectees ?? 0}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-1 rounded text-sm bg-gray-100">
                          {data.totalEnregistrees > 0 ? Math.round(data.totalConnectees / data.totalEnregistrees * 100) : 0}%
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
