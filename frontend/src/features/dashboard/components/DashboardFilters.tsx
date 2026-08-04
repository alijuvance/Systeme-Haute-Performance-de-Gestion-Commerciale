import React from 'react';
import { Calendar } from 'lucide-react';
import { Input } from '@/components/shared/Input';
import { Card } from '@/components/shared/Card';

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
    <Card padding="sm" className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Calendar className="w-4 h-4 text-zinc-400 mx-2" />
        <div className="flex flex-wrap items-center gap-1 bg-zinc-50 p-1 rounded-lg">
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors duration-150 ${
                period === p.id
                  ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/50'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {period === 'custom' && (
        <div className="flex items-center gap-2 px-2">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-36 h-8 text-[12px]"
          />
          <span className="text-zinc-400 text-[12px]">-</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-36 h-8 text-[12px]"
          />
        </div>
      )}
    </Card>
  );
};
