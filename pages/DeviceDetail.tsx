
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Layout, Box as BoxIcon, LineChart, List, Settings, Play,
  Thermometer, Wifi, Zap, Lock, Unlock, AlertTriangle, Sparkles, RefreshCw
} from 'lucide-react';
import { apiService } from '../services/api';
import { analyzePostomatStatus } from '../services/gemini';
import { Postomat, Cell, TelemetryPoint, DeviceEvent, Incident, DeviceStatus, CellStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { STATUS_COLORS } from '../constants';
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DeviceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'cells' | 'telemetry' | 'events' | 'config'>('overview');
  
  const [device, setDevice] = useState<Postomat | null>(null);
  const [cells, setCells] = useState<Cell[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>([]);
  const [events, setEvents] = useState<DeviceEvent[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      apiService.getDeviceById(id),
      apiService.getCells(id),
      apiService.getTelemetry(id),
      apiService.getEvents(id),
      apiService.getIncidents()
    ]).then(([d, c, t, e, inc]) => {
      setDevice(d || null);
      setCells(c);
      setTelemetry(t);
      setEvents(e);
      setIncidents(inc.filter(i => i.deviceId === id));
      setLoading(false);
    });
  }, [id]);

  const handleRunAiAnalysis = async () => {
    if (!device) return;
    setAnalyzing(true);
    const result = await analyzePostomatStatus(events, telemetry, incidents);
    setAiAnalysis(result);
    setAnalyzing(false);
  };

  if (loading || !device) {
    return <div className="p-12 text-center text-slate-500">Loading device details...</div>;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Layout size={18} /> },
    { id: 'cells', label: 'Cells', icon: <BoxIcon size={18} /> },
    { id: 'telemetry', label: 'Telemetry', icon: <LineChart size={18} /> },
    { id: 'events', label: 'Events', icon: <List size={18} /> },
    { id: 'config', label: 'Config', icon: <Settings size={18} /> },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/devices')}
          className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">{device.name}</h2>
            <StatusBadge status={device.status} colors={STATUS_COLORS} />
          </div>
          <p className="text-slate-500 text-sm">{device.id} • {device.address}</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-8 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 py-4 px-1 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                  <div className="flex items-center gap-3 text-slate-500 mb-2">
                    <Thermometer size={18} />
                    <span className="text-sm font-medium">Temperature</span>
                  </div>
                  <div className="text-2xl font-bold">{device.temperature || '--'}°C</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                  <div className="flex items-center gap-3 text-slate-500 mb-2">
                    <Wifi size={18} />
                    <span className="text-sm font-medium">Signal</span>
                  </div>
                  <div className="text-2xl font-bold">{device.rssi || '--'} dBm</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                  <div className="flex items-center gap-3 text-slate-500 mb-2">
                    <Zap size={18} />
                    <span className="text-sm font-medium">Status</span>
                  </div>
                  <div className="text-lg font-bold">Stable</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <h3 className="font-bold text-lg mb-4">Occupancy</h3>
                <div className="flex items-center gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Usage</span>
                      <span className="text-2xl font-bold">{device.occupancyPercent}%</span>
                    </div>
                    <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 transition-all duration-1000"
                        style={{ width: `${device.occupancyPercent}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-xs text-slate-400 font-bold uppercase mb-1">Occupied</div>
                        <div className="text-lg font-bold">{device.occupiedCells} cells</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-xs text-slate-400 font-bold uppercase mb-1">Available</div>
                        <div className="text-lg font-bold">{device.totalCells - device.occupiedCells} cells</div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:block w-32 h-32 rounded-full border-[12px] border-slate-50 border-t-indigo-500 flex items-center justify-center rotate-[-45deg]">
                    <div className="rotate-[45deg] font-bold text-slate-400 text-xs">LOAD</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <h3 className="font-bold text-lg mb-4">Active Incidents</h3>
                {incidents.length > 0 ? (
                  <div className="space-y-3">
                    {incidents.map(inc => (
                      <div key={inc.id} className="p-4 bg-red-50/50 border border-red-100 rounded-xl flex justify-between items-center">
                        <div>
                          <div className="font-bold text-red-900">{inc.type}</div>
                          <div className="text-sm text-red-700">{inc.description}</div>
                        </div>
                        <button className="text-xs font-bold text-red-900 underline">View Details</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center bg-emerald-50/50 border border-emerald-100 rounded-xl text-emerald-700 font-medium">
                    No active issues detected. Device is operating normally.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'cells' && (
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="font-bold">Cell Map</h3>
                <div className="flex gap-2 text-xs">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Free</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-300"></div> Occupied</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Fault</span>
                </div>
              </div>
              <div className="p-6 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {cells.map(cell => (
                  <div 
                    key={cell.id}
                    className={`
                      aspect-square rounded-xl flex flex-col items-center justify-center border-2 transition-all cursor-pointer group relative
                      ${cell.status === CellStatus.FREE ? 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100' : 
                        cell.status === CellStatus.OCCUPIED ? 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200' :
                        'bg-red-50 border-red-100 text-red-700 animate-pulse'}
                    `}
                    title={`ID: ${cell.id} | Status: ${cell.status}`}
                  >
                    <span className="text-[10px] font-bold">{cell.id.split('-C')[1]}</span>
                    {cell.type === 'Cold' && <Thermometer size={10} className="mt-1 opacity-50" />}
                    
                    <div className="absolute inset-0 bg-slate-900/90 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 z-10 text-[8px] font-bold text-white">
                       <Play size={10} />
                       TEST OPEN
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-8">
               <div>
                  <h3 className="font-bold mb-4">Temperature Graph (°C)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart data={telemetry}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="timestamp" hide />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={3} dot={false} />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </div>
               </div>
               <div>
                  <h3 className="font-bold mb-4">Connection Strength (dBm)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart data={telemetry}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="timestamp" hide />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="rssi" stroke="#4f46e5" strokeWidth={3} dot={false} />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
               <div className="p-4 bg-slate-50 border-b font-bold flex justify-between items-center">
                 <span>Device Event Log</span>
                 <button className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors">
                    <RefreshCw size={14} />
                 </button>
               </div>
               <div className="divide-y text-sm">
                 {events.map(event => (
                   <div key={event.id} className="p-4 hover:bg-slate-50 flex gap-4">
                     <div className="w-24 text-slate-400 font-medium tabular-nums shrink-0">
                       {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </div>
                     <div className="flex-1">
                       <div className="flex items-center gap-2 mb-1">
                         <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                           event.type === 'ERROR' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                         }`}>
                           {event.type}
                         </span>
                         {event.cellId && <span className="text-indigo-600 font-bold">#{event.cellId}</span>}
                       </div>
                       <p className="text-slate-600 font-medium">{event.description}</p>
                     </div>
                     {event.userId && <div className="text-[10px] text-slate-400 font-bold uppercase py-1 px-2 border rounded self-start">BY {event.userId}</div>}
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 font-bold text-indigo-300">
                <Sparkles size={18} />
                <span>Smart Insights</span>
              </div>
              <button 
                onClick={handleRunAiAnalysis}
                disabled={analyzing}
                className={`p-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-all ${analyzing ? 'animate-spin opacity-50' : ''}`}
              >
                <RefreshCw size={16} />
              </button>
            </div>

            {aiAnalysis ? (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                  <div className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider mb-1">System Risk</div>
                  <div className={`text-lg font-bold flex items-center gap-2 ${
                    aiAnalysis.riskLevel === 'High' ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {aiAnalysis.riskLevel === 'High' && <AlertTriangle size={16}/>}
                    {aiAnalysis.riskLevel}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Analysis</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{aiAnalysis.summary}</p>
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Recommendations</div>
                  <ul className="space-y-1.5">
                    {aiAnalysis.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="text-xs flex gap-2">
                        <span className="text-indigo-400 font-bold">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                  <Sparkles size={24} className="text-indigo-400/50" />
                </div>
                <p className="text-xs text-slate-400">Run AI diagnostic to get real-time health analysis and predictions.</p>
                <button 
                   onClick={handleRunAiAnalysis}
                   className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold transition-all"
                >
                  Generate Analysis
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border shadow-sm">
            <h3 className="font-bold mb-4">Quick Commands</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                    <RefreshCw size={16} />
                  </div>
                  <span className="text-sm font-semibold">Force Sync</span>
                </div>
                <Play size={14} className="text-slate-300 group-hover:text-indigo-600" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-red-200 hover:bg-red-50 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                    <Lock size={16} />
                  </div>
                  <span className="text-sm font-semibold">Maintenance Mode</span>
                </div>
                <Play size={14} className="text-slate-300 group-hover:text-red-600" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                    <Zap size={16} />
                  </div>
                  <span className="text-sm font-semibold">Reboot Application</span>
                </div>
                <Play size={14} className="text-slate-300 group-hover:text-amber-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetail;
