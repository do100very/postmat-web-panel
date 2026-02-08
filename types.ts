
export enum UserRole {
  ADMIN = 'Admin',
  OPERATOR = 'Operator',
  SUPPORT = 'Support',
  SERVICE = 'Service'
}

export enum DeviceStatus {
  ONLINE = 'Online',
  OFFLINE = 'Offline',
  MAINTENANCE = 'Maintenance',
  FAULT = 'Fault'
}

export enum CellStatus {
  FREE = 'Free',
  OCCUPIED = 'Occupied',
  FAULT = 'Fault',
  DISABLED = 'Disabled'
}

export enum CellType {
  NORMAL = 'Normal',
  COLD = 'Cold'
}

export enum IncidentStatus {
  NEW = 'New',
  IN_PROGRESS = 'InProgress',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed'
}

export enum IncidentPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface Postomat {
  id: string;
  name: string;
  address: string;
  coords: [number, number];
  status: DeviceStatus;
  lastHeartbeat: string;
  hasFridge: boolean;
  totalCells: number;
  occupiedCells: number;
  occupancyPercent: number;
  activeIncidents: number;
  temperature?: number;
  rssi?: number;
}

export interface Cell {
  id: string;
  type: CellType;
  size: 'S' | 'M' | 'L' | 'XL';
  status: CellStatus;
  doorSensor: boolean;
}

export interface TelemetryPoint {
  timestamp: string;
  temperature: number;
  rssi: number;
  powerVoltage: number;
}

export interface DeviceEvent {
  id: string;
  timestamp: string;
  type: 'OPEN_COMMAND' | 'PICKUP' | 'PLACEMENT' | 'REBOOT' | 'OFFLINE' | 'ONLINE' | 'ERROR';
  description: string;
  cellId?: string;
  userId?: string;
}

export interface Incident {
  id: string;
  deviceId: string;
  cellId?: string;
  type: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
  assignee?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  details: string;
}
