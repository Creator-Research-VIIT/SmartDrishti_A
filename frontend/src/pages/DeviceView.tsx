import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Chart } from '@/components/Chart';
import { Table } from '@/components/Table';
import { devicesApi } from '@/services/api';
import { Device, DeviceData } from '@/types';
import socketService from '@/services/socket';

export const DeviceView: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const [device, setDevice] = useState<Device | null>(null);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [realtimeData, setRealtimeData] = useState<DeviceData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDevice();

    return () => {
      socketService.disconnect();
    };
  }, [deviceId]);

  useEffect(() => {
    if (device) {
      // Connect to socket for real-time updates
      const socket = socketService.connect(deviceId!);
      
      socket.on('connect', () => {
        console.log('Socket connected');
      });

      socket.on('data', (data: DeviceData) => {
        setRealtimeData(data);
        // Add to chart data
        setDeviceData((prev) => [...prev.slice(-49), data]);
      });

      return () => {
        socketService.disconnect();
      };
    }
  }, [device]);

  const loadDevice = async () => {
    try {
      const response = await devicesApi.getById(deviceId!);
      setDevice(response.data as Device);
    } catch (error) {
      console.error('Failed to load device:', error);
      alert('Failed to load device. Redirecting...');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !device) {
    return (
      <Layout>
        <div className="text-center py-12">Loading...</div>
      </Layout>
    );
  }

  const chartData = deviceData.map((item) => ({
    timestamp: item.timestamp,
    value: typeof item.data === 'object' ? Object.values(item.data)[0] as number : 0,
  }));

  const tableColumns = [
    { header: 'Timestamp', accessor: (row: DeviceData) => new Date(row.timestamp).toLocaleString() },
    { header: 'Data', accessor: (row: DeviceData) => JSON.stringify(row.data) },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{device.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-3 h-3 rounded-full ${device.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-sm text-gray-600 capitalize">{device.status}</span>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Chart data={chartData} title="Live Data Stream" />
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Device Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Device Name</p>
                <p className="font-medium">{device.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Device Type</p>
                <p className="font-medium">{device.deviceType}</p>
              </div>
              {device.location && (
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{device.location}</p>
                </div>
              )}
              {device.description && (
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-medium">{device.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {realtimeData && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Latest Data</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(realtimeData.data).map(([key, value]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">{key}</p>
                  <p className="text-2xl font-bold text-primary-600">{String(value)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Recent Data</h3>
          </div>
          <Table data={deviceData.slice(-10).reverse()} columns={tableColumns} />
        </div>
      </div>
    </Layout>
  );
};

