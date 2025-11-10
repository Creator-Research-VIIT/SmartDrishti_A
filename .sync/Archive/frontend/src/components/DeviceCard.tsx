import React from 'react';
import { Device } from '@/types';

interface DeviceCardProps {
  device: Device;
  onClick?: () => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onClick }) => {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-5 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{device.name}</h3>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${statusColors[device.status]}`} />
          <span className="text-sm text-gray-600 capitalize">{device.status}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Type:</span> {device.deviceType}
        </p>
        {device.location && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Location:</span> {device.location}
          </p>
        )}
        {device.description && (
          <p className="text-sm text-gray-600">{device.description}</p>
        )}
      </div>
    </div>
  );
};
