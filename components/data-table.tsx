'use client';

import { DailyData } from '@/lib/types';
import { formatDateFR } from '@/lib/constants';

interface DataTableProps {
  data: DailyData[];
  title: string;
  showTotal?: boolean;
  hideDate?: boolean;
  isCumulative?: boolean;
}

export default function DataTable({ data, title, showTotal = false, hideDate = false, isCumulative = false }: DataTableProps) {
  const safeData = data ?? [];

  const totals = showTotal ? {
    sageFemmesFormees: safeData.reduce((sum, d) => sum + (d?.sageFemmesFormees ?? 0), 0),
    sageFemmesPresentes: safeData.reduce((sum, d) => sum + (d?.sageFemmesPresentes ?? 0), 0),
    femmesEnceintesRecues: safeData.reduce((sum, d) => sum + (d?.femmesEnceintesRecues ?? 0), 0),
    femmesEnceintesEnregistrees: safeData.reduce((sum, d) => sum + (d?.femmesEnceintesEnregistrees ?? 0), 0),
    femmesEnceintesConnectees: safeData.reduce((sum, d) => sum + (d?.femmesEnceintesConnectees ?? 0), 0),
  } : null;

  // Calculer le taux d'enregistrement
  const getTauxEnregistrement = (recues: number, enregistrees: number) => {
    return recues > 0 ? Math.round((enregistrees / recues) * 100) : 0;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {!hideDate && <th className="px-3 py-3 text-left text-gray-700 font-semibold">Date</th>}
              <th className="px-3 py-3 text-left text-gray-700 font-semibold">Établissement</th>
              <th className="px-3 py-3 text-center text-gray-700 font-semibold">SF Formées</th>
              <th className="px-3 py-3 text-center text-gray-700 font-semibold">SF Présentes</th>
              <th className="px-3 py-3 text-center text-gray-700 font-semibold">FE Reçues</th>
              <th className="px-3 py-3 text-center text-gray-700 font-semibold">FE Enregistrées</th>
              <th className="px-3 py-3 text-center text-gray-700 font-semibold">Taux Enreg.</th>
              <th className="px-3 py-3 text-center text-gray-700 font-semibold">FE Connectées</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {safeData.length === 0 ? (
              <tr>
                <td colSpan={hideDate ? 7 : 8} className="px-4 py-8 text-center text-gray-500">
                  Aucune donnée disponible
                </td>
              </tr>
            ) : (
              safeData.map((row, idx) => {
                const tauxEnreg = getTauxEnregistrement(row?.femmesEnceintesRecues ?? 0, row?.femmesEnceintesEnregistrees ?? 0);
                return (
                  <tr key={row?.id ?? idx} className="hover:bg-gray-50 transition-colors">
                    {!hideDate && <td className="px-3 py-3 text-gray-600">{formatDateFR(row?.date)}</td>}
                    <td className="px-3 py-3 font-medium text-gray-800">{row?.etablissement ?? '-'}</td>
                    <td className="px-3 py-3 text-center">{row?.sageFemmesFormees ?? 0}</td>
                    <td className="px-3 py-3 text-center">{row?.sageFemmesPresentes ?? 0}</td>
                    <td className="px-3 py-3 text-center text-blue-600">{row?.femmesEnceintesRecues ?? 0}</td>
                    <td className="px-3 py-3 text-center text-orange-600 font-medium">{row?.femmesEnceintesEnregistrees ?? 0}</td>
                    <td className="px-3 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        tauxEnreg >= 80 ? 'bg-green-100 text-green-700' :
                        tauxEnreg >= 50 ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {tauxEnreg}%
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center text-green-600 font-medium">{row?.femmesEnceintesConnectees ?? 0}</td>
                  </tr>
                );
              })
            )}
            {totals && safeData.length > 0 && (
              <tr className="bg-orange-50 font-semibold">
                {!hideDate && <td className="px-3 py-3">TOTAL</td>}
                <td className="px-3 py-3">{hideDate ? 'TOTAL' : ''}</td>
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
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
