import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  trend?: {
    value: number;
    label?: string;
  };
  sparklineData?: number[];
  accentColor?: string;
  className?: string;
  onClick?: () => void;
}

function MiniSparkline({ data, color = '#18181b' }: { data: number[]; color?: string }) {
  if (!data || data.length < 2) return null;

  const width = 72;
  const height = 28;
  const padding = 2;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width - padding},${height} L ${padding},${height} Z`;
  const gradientId = `spark-${color.replace('#', '')}`;

  return (
    <svg width={width} height={height} className="flex-shrink-0 opacity-60" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.1} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradientId})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'bg-zinc-100',
  trend,
  sparklineData,
  accentColor = '#18181b',
  className = '',
  onClick,
}: StatCardProps) {
  const trendIsPositive = trend && trend.value > 0;
  const trendIsNegative = trend && trend.value < 0;
  const trendIsNeutral = trend && trend.value === 0;

  return (
    <div
      className={`
        bg-white rounded-xl p-5
        shadow-[var(--shadow-card)]
        hover:shadow-[var(--shadow-card-hover)]
        transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Header: Title + Icon */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] font-medium text-zinc-500 uppercase tracking-wide">{title}</span>
        {icon && (
          <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
            {icon}
          </div>
        )}
      </div>

      {/* Value + Sparkline */}
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="text-2xl font-semibold text-zinc-900 tabular-nums tracking-tight truncate">{value}</div>

          {/* Trend indicator */}
          {trend && (
            <div className="flex items-center gap-1.5 mt-1.5">
              {trendIsPositive && (
                <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md ring-1 ring-inset ring-emerald-600/10">
                  <TrendingUp className="w-3 h-3" />
                  +{trend.value.toFixed(1)}%
                </span>
              )}
              {trendIsNegative && (
                <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-red-700 bg-red-50 px-1.5 py-0.5 rounded-md ring-1 ring-inset ring-red-600/10">
                  <TrendingDown className="w-3 h-3" />
                  {trend.value.toFixed(1)}%
                </span>
              )}
              {trendIsNeutral && (
                <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-zinc-500 bg-zinc-50 px-1.5 py-0.5 rounded-md ring-1 ring-inset ring-zinc-500/10">
                  <Minus className="w-3 h-3" />
                  0%
                </span>
              )}
              {trend.label && <span className="text-[11px] text-zinc-400">{trend.label}</span>}
            </div>
          )}

          {/* Subtitle */}
          {subtitle && !trend && (
            <p className="text-[11px] text-zinc-400 mt-1.5">{subtitle}</p>
          )}
        </div>

        {/* Sparkline */}
        {sparklineData && sparklineData.length > 1 && (
          <MiniSparkline data={sparklineData} color={accentColor} />
        )}
      </div>
    </div>
  );
}
