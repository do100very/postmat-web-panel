
import React from 'react';

interface StatusBadgeProps {
  status: string;
  colors: Record<string, string>;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, colors }) => {
  const colorClass = colors[status] || 'bg-slate-100 text-slate-700';
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
      {status}
    </span>
  );
};
