
import React from 'react';
import { 
  LayoutDashboard, 
  Box, 
  AlertCircle, 
  BarChart3, 
  Users, 
  History, 
  Settings,
  Circle,
  Thermometer,
  Wifi,
  Package,
  CheckCircle2,
  XCircle,
  Wrench,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { DeviceStatus, Postomat, IncidentPriority, IncidentStatus, CellType, CellStatus, UserRole } from './types';

export const NAV_ITEMS = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
  { label: 'Postomats', icon: <Box size={20} />, path: '/devices' },
  { label: 'Incidents', icon: <AlertCircle size={20} />, path: '/incidents' },
  { label: 'Reports', icon: <BarChart3 size={20} />, path: '/reports' },
  { label: 'Users', icon: <Users size={20} />, path: '/users' },
  { label: 'Audit Log', icon: <History size={20} />, path: '/audit' },
];

export const MOCK_DEVICES: Postomat[] = [
  {
    id: 'PST-001',
    name: 'Main Square Hub',
    address: '123 Central Ave, NY',
    coords: [40.7128, -74.0060],
    status: DeviceStatus.ONLINE,
    lastHeartbeat: new Date().toISOString(),
    hasFridge: true,
    totalCells: 48,
    occupiedCells: 12,
    occupancyPercent: 25,
    activeIncidents: 0,
    temperature: 4.2,
    rssi: -65
  },
  {
    id: 'PST-002',
    name: 'Railway Station North',
    address: 'Station Plaza, NY',
    coords: [40.7580, -73.9855],
    status: DeviceStatus.OFFLINE,
    lastHeartbeat: new Date(Date.now() - 15 * 60000).toISOString(),
    hasFridge: false,
    totalCells: 24,
    occupiedCells: 22,
    occupancyPercent: 91,
    activeIncidents: 1,
    rssi: -82
  },
  {
    id: 'PST-003',
    name: 'Shopping Mall "Solar"',
    address: '5th Ave & 23rd St, NY',
    coords: [40.7411, -73.9897],
    status: DeviceStatus.MAINTENANCE,
    lastHeartbeat: new Date().toISOString(),
    hasFridge: true,
    totalCells: 64,
    occupiedCells: 45,
    occupancyPercent: 70,
    activeIncidents: 2,
    temperature: 18.5
  },
  {
    id: 'PST-004',
    name: 'Business Center "Helix"',
    address: 'Broadway & Wall St, NY',
    coords: [40.7061, -74.0113],
    status: DeviceStatus.ONLINE,
    lastHeartbeat: new Date().toISOString(),
    hasFridge: false,
    totalCells: 32,
    occupiedCells: 5,
    occupancyPercent: 15,
    activeIncidents: 0,
    rssi: -55
  }
];

export const STATUS_COLORS = {
  [DeviceStatus.ONLINE]: 'bg-green-100 text-green-700 border-green-200',
  [DeviceStatus.OFFLINE]: 'bg-slate-100 text-slate-700 border-slate-200',
  [DeviceStatus.MAINTENANCE]: 'bg-blue-100 text-blue-700 border-blue-200',
  [DeviceStatus.FAULT]: 'bg-red-100 text-red-700 border-red-200',
};

export const PRIORITY_COLORS = {
  [IncidentPriority.LOW]: 'bg-slate-100 text-slate-700',
  [IncidentPriority.MEDIUM]: 'bg-blue-100 text-blue-700',
  [IncidentPriority.HIGH]: 'bg-orange-100 text-orange-700',
  [IncidentPriority.CRITICAL]: 'bg-red-100 text-red-700',
};
