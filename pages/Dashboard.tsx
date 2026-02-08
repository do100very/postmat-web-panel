
import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell as ReCell 
} from 'recharts';
import { 
  Server, Signal, AlertTriangle, Users, 
  ArrowUpRight, ArrowDownRight, Activity, MapPin
} from 'lucide-react';
import { apiService } from '../services/api';
import { Postomat, DeviceStatus } from '../types';

const Dashboard: React.FC = () => {
  const [devices, setDevices] = useState<Postomat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getDevices().then(data => {
      setDevices(data);
      setLoading(false);
    });
  }, []);

  const stats = [
    { label: 'Total Postomats', value: devices.length, icon: <Server size={20}/>, color: 'bg-indigo-50 text-indigo-600', trend: '+2% from last month' },
    { label: 'Online Now', value: devices.filter(d => d.status === DeviceStatus.ONLINE).length, icon: <Signal size={20}/>, color: 'bg-green-50 text-green-600', trend: 'Healthy' },
    { label: 'Active Incidents', value: devices.reduce((acc, d) => acc + d.activeIncidents, 0), icon: <AlertTriangle size={20}/>, color: 'bg-red-50 text-red-600', trend: 'Requires attention' },
    { label: 'Avg Occupancy', value: `${Math.round(devices.reduce((acc, d) => acc + d.occupancyPercent, 0) / devices.length)}%`, icon: <Activity size={20}/>, color: 'bg-orange-50 text-orange-600', trend: 'High demand' },
  ];

  const occupancyData = devices.map(d => ({ name: d.id, val: d.occupancyPercent }));
  const COLORS = ['#4f46e5', '#10b981', '#ef4444', '#f59e0b'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Overview</h2>
          <p className="text-slate-500">Real-time monitoring of your parcel locker network.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-white px-4 py-2 border rounded-lg text-sm font-medium hover:bg-slate-50">Export Report</button>
           <button className="bg-indigo-600 px-4 py-2 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Refresh Data</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Stat</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-1">
              <span className="text-xs text-slate-400">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Occupancy Trends</h3>
            <select className="text-xs border rounded-md p-1 bg-slate-50 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={occupancyData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="val" stroke="#4f46e5" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="font-bold text-slate-800 mb-6">Device Distribution</h3>
           <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Online', value: devices.filter(d => d.status === DeviceStatus.ONLINE).length },
                      { name: 'Offline', value: devices.filter(d => d.status === DeviceStatus.OFFLINE).length },
                      { name: 'Maintenance', value: devices.filter(d => d.status === DeviceStatus.MAINTENANCE).length },
                      { name: 'Faulty', value: devices.filter(d => d.status === DeviceStatus.FAULT).length },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {occupancyData.map((entry, index) => (
                      <ReCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="mt-4 grid grid-cols-2 gap-2">
             <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
               <div className="w-2 h-2 rounded-full bg-indigo-600"></div> Online
             </div>
             <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
               <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Stable
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
