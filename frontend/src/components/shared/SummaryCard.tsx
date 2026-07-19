'use client';
import React from 'react';
import { Card } from './Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number; // Percentage
    isPositive: boolean;
    label?: string;
  };
  className?: string;
}

export function SummaryCard({ title, value, icon, trend, className = '' }: SummaryCardProps) {
  return (
    <Card 
      className={`relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-gray-100 ${className}`}
      padding="lg"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
        </div>
        
        {icon && (
          <div className="p-3 bg-gray-50 text-gray-600 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors duration-300">
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <div className={`flex items-center font-medium ${
            trend.isPositive ? 'text-emerald-600' : trend.value === 0 ? 'text-gray-500' : 'text-rose-600'
          }`}>
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : trend.value === 0 ? (
              <Minus className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {Math.abs(trend.value)}%
          </div>
          <span className="ml-2 text-gray-500">{trend.label || 'vs mois dernier'}</span>
        </div>
      )}
      
      {/* Decorative background accent */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full opacity-50 blur-2xl pointer-events-none group-hover:bg-indigo-50 transition-colors duration-500" />
    </Card>
  );
}
