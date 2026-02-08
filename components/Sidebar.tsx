
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';
import { Package } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Package className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">Admin Pro</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all
              ${isActive 
                ? 'bg-slate-800 text-white shadow-sm' 
                : 'hover:bg-slate-800/50 hover:text-white'
              }
            `}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">Alex Admin</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Administrator</span>
          </div>
        </div>
      </div>
    </div>
  );
};
