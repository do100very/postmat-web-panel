
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MoreVertical, ExternalLink, Thermometer, Wifi } from 'lucide-react';
import { apiService } from '../services/api';
import { Postomat, DeviceStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { STATUS_COLORS } from '../constants';

const DeviceList: React.FC = () => {
  const [devices, setDevices] = useState<Postomat[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<DeviceStatus | 'ALL'>('ALL');

  useEffect(() => {
    apiService.getDevices().then(setDevices);
  }, []);

  const filtered = devices.filter(d => {
    const matchesSearch = d.id.toLowerCase().includes(search.toLowerCase()) || 
                         d.name.toLowerCase().includes(search.toLowerCase()) ||
                         d.address.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || d.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Postomats</h2>
          <p className="text-slate-500">Manage and monitor {devices.length} devices in your network.</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID or address..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center border rounded-xl bg-white px-3 gap-2">
            <Filter size={16} className="text-slate-400" />
            <select 
              className="text-sm bg-transparent outline-none pr-2 font-medium py-2"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="ALL">All Statuses</option>
              {Object.values(DeviceStatus).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Device Info</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Occupancy</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Metrics</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Alerts</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((device) => (
              <tr key={device.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{device.id}</span>
                    <span className="text-sm text-slate-500 truncate max-w-[200px]">{device.name}</span>
                    <span className="text-xs text-slate-400 mt-0.5">{device.address}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={device.status} colors={STATUS_COLORS} />
                  <div className="text-[10px] text-slate-400 mt-1 uppercase font-medium">Last seen: {new Date(device.lastHeartbeat).toLocaleTimeString()}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col w-32 gap-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{device.occupancyPercent}%</span>
                      <span className="text-slate-400">{device.occupiedCells}/{device.totalCells}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${device.occupancyPercent > 80 ? 'bg-orange-500' : 'bg-indigo-500'}`}
                        style={{ width: `${device.occupancyPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {device.temperature !== undefined && (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                        <Thermometer size={14} className="text-slate-400" />
                        {device.temperature}°C
                      </div>
                    )}
                    {device.rssi !== undefined && (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                        <Wifi size={14} className="text-slate-400" />
                        {device.rssi} dBm
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {device.activeIncidents > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-50 text-red-700 text-xs font-bold border border-red-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
                      {device.activeIncidents} Active
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">No alerts</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link 
                    to={`/devices/${device.id}`}
                    className="p-2 hover:bg-white hover:shadow-sm hover:border border-transparent rounded-lg inline-flex text-indigo-600 transition-all"
                  >
                    <ExternalLink size={18} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            No postomats found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceList;
