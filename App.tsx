
import React, { Suspense, lazy } from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Bell, Search, User } from 'lucide-react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const DeviceList = lazy(() => import('./pages/DeviceList'));
const DeviceDetail = lazy(() => import('./pages/DeviceDetail'));

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4 text-slate-400">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
          <input 
            type="text" 
            placeholder="Search resources..."
            className="bg-slate-100 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500/20 w-64 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-slate-100 rounded-xl relative text-slate-500">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
        <div className="flex items-center gap-3 pl-2">
           <div className="text-right hidden sm:block">
             <div className="text-sm font-bold leading-none">System Admin</div>
             <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Super User</div>
           </div>
           <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold">
             SA
           </div>
        </div>
      </div>
    </header>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col min-w-0">
        <Header />
        <div className="p-8">
          <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 py-20 font-medium">Loading component...</div>}>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/devices" element={<DeviceList />} />
          <Route path="/devices/:id" element={<DeviceDetail />} />
          <Route path="/incidents" element={<div className="p-12 text-center text-slate-400">Incident Management Page Placeholder</div>} />
          <Route path="/reports" element={<div className="p-12 text-center text-slate-400">Advanced Reports Page Placeholder</div>} />
          <Route path="/users" element={<div className="p-12 text-center text-slate-400">RBAC User Management Placeholder</div>} />
          <Route path="/audit" element={<div className="p-12 text-center text-slate-400">Audit Logs Page Placeholder</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
