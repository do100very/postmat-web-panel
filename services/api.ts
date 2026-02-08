
import { MOCK_DEVICES } from '../constants';
import { Postomat, Cell, TelemetryPoint, DeviceEvent, Incident, IncidentPriority, IncidentStatus, CellType, CellStatus } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  async getDevices(): Promise<Postomat[]> {
    await sleep(500);
    return MOCK_DEVICES;
  },

  async getDeviceById(id: string): Promise<Postomat | undefined> {
    await sleep(300);
    return MOCK_DEVICES.find(d => d.id === id);
  },

  async getCells(deviceId: string): Promise<Cell[]> {
    await sleep(400);
    const cells: Cell[] = [];
    const count = 24;
    for (let i = 1; i <= count; i++) {
      cells.push({
        id: `${deviceId}-C${i.toString().padStart(3, '0')}`,
        type: i <= 8 ? CellType.COLD : CellType.NORMAL,
        size: i % 4 === 0 ? 'L' : i % 3 === 0 ? 'M' : 'S',
        status: i % 7 === 0 ? CellStatus.FAULT : i % 3 === 0 ? CellStatus.OCCUPIED : CellStatus.FREE,
        doorSensor: true
      });
    }
    return cells;
  },

  async getTelemetry(deviceId: string): Promise<TelemetryPoint[]> {
    const points: TelemetryPoint[] = [];
    const now = new Date();
    for (let i = 24; i >= 0; i--) {
      points.push({
        timestamp: new Date(now.getTime() - i * 3600000).toISOString(),
        temperature: 4 + Math.random() * 2,
        rssi: -60 - Math.random() * 20,
        powerVoltage: 220 + Math.random() * 5
      });
    }
    return points;
  },

  async getEvents(deviceId: string): Promise<DeviceEvent[]> {
    return [
      { id: '1', timestamp: new Date(Date.now() - 100000).toISOString(), type: 'PLACEMENT', description: 'Package placed in cell C003', cellId: 'C003' },
      { id: '2', timestamp: new Date(Date.now() - 200000).toISOString(), type: 'PICKUP', description: 'Package collected from cell C008', cellId: 'C008' },
      { id: '3', timestamp: new Date(Date.now() - 500000).toISOString(), type: 'OPEN_COMMAND', description: 'Manual open command issued by Admin', userId: 'USR-001' },
      { id: '4', timestamp: new Date(Date.now() - 1000000).toISOString(), type: 'ERROR', description: 'Door sensor malfunction detected' },
    ];
  },

  async getIncidents(): Promise<Incident[]> {
    return [
      {
        id: 'INC-001',
        deviceId: 'PST-002',
        type: 'Connectivity Loss',
        priority: IncidentPriority.HIGH,
        status: IncidentStatus.NEW,
        description: 'Device has been offline for more than 15 minutes.',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'INC-002',
        deviceId: 'PST-003',
        type: 'Temperature Spike',
        priority: IncidentPriority.CRITICAL,
        status: IncidentStatus.IN_PROGRESS,
        description: 'Cold storage unit reported 18.5°C (Threshold 6°C).',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        updatedAt: new Date(Date.now() - 1800000).toISOString(),
        assignee: 'Mark Stevenson'
      }
    ];
  }
};
