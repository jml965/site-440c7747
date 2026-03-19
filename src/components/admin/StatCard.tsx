import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  change: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'teal';
  subtitle?: string;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    border: 'border-blue-200'
  },
  green: {
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    border: 'border-green-200'
  },
  purple: {
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    border: 'border-purple-200'
  },
  red: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    border: 'border-red-200'
  },
  orange: {
    bg: 'bg-orange-50',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    border: 'border-orange-200'
  },
  teal: {
    bg: 'bg-teal-50',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    border: 'border-teal-200'
  }
};

export function StatCard({ title, value, change, icon: Icon, color, subtitle }: StatCardProps) {
  const isPositive = change >= 0;
  const colorClass = colorClasses[color];

  const formatValue = (val: number | string): string => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}م`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}ك`;
      }
      return val.toLocaleString('ar-SA');
    }
    return val;
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg border ${colorClass.border} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${colorClass.iconBg}`}>
            <Icon className={`w-6 h-6 ${colorClass.iconColor}`} />
          </div>
          <div className="text-left">
            <div className={`flex items-center gap-1 text-sm ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-medium">
                {isPositive ? '+' : ''}{change.toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">من الأسبوع الماضي</p>
          </div>
        </div>
        
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {formatValue(value)}
            </span>
            {subtitle && (
              <span className="text-sm text-gray-500">{subtitle}</span>
            )}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className={`w-full h-2 ${colorClass.bg} rounded-full overflow-hidden`}>
            <div
              className={`h-full bg-gradient-to-r ${colorClass.iconColor.replace('text-', 'from-').replace('-600', '-400')} ${colorClass.iconColor.replace('text-', 'to-')} transition-all duration-1000 ease-out`}
              style={{ width: `${Math.min(Math.abs(change) * 10, 100)}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Decorative element */}
      <div className={`h-1 ${colorClass.bg}`}>
        <div className={`h-full bg-gradient-to-r ${colorClass.iconColor.replace('text-', 'from-').replace('-600', '-400')} ${colorClass.iconColor.replace('text-', 'to-')} w-full`} />
      </div>
    </div>
  );
}