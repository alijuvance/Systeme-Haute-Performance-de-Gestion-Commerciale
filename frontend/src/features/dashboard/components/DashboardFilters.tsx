import React from 'react';
import { Calendar } from 'lucide-react';
import { Input } from '@/components/shared/Input';

interface DashboardFiltersProps {
  period: string;
  setPeriod: (period: string) => void;
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  period,
  setPeriod,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  const periods = [
    { id: 'all', label: 'Tout' },
    { id: 'today', label: "Aujourd'hui" },
    { id: 'week', label: 'Cette Semaine' },
    { id: 'month', label: 'Ce Mois' },
    { id: 'year', label: 'Cette Année' },
    { id: 'custom', label: 'Personnalisé' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Calendar className="w-5 h-5 text-gray-400 mr-2" />
        {periods.map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              period === p.id
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {period === 'custom' && (
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-40"
          />
          <span className="text-gray-400">-</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-40"
          />
        </div>
      )}
    </div>
  );
};
