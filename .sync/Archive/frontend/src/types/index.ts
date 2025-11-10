export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Template {
  id: string;
  name: string;
  connectionType: 'HTTP' | 'MQTT' | 'WebSocket';
  hardware: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

export interface Device {
  id: string;
  templateId: string;
  name: string;
  deviceType: string;
  apiKey: string;
  description?: string;
  location?: string;
  createdAt: string;
  status: 'online' | 'offline';
}

export interface DeviceData {
  deviceId: string;
  timestamp: string;
  data: Record<string, number | string>;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiKeyDisplay {
  deviceId: string;
  apiKey: string;
}