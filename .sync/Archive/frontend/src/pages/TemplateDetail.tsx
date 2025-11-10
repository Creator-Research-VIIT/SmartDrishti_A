import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { DeviceCard } from '@/components/DeviceCard';
import { Modal } from '@/components/Modal';
import { templatesApi, devicesApi } from '@/services/api';
import { Template, Device } from '@/types';

export const TemplateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<Template | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadTemplate();
    loadDevices();
  }, [id]);

  const loadTemplate = async () => {
    try {
      const response = await templatesApi.getById(id!);
      setTemplate(response.data as Template);
    } catch (error) {
      console.error('Failed to load template:', error);
      navigate('/templates');
    } finally {
      setLoading(false);
    }
  };

  const loadDevices = async () => {
    try {
      const response = await devicesApi.getByTemplate(id!);
      setDevices(response.data as Device[]);
    } catch (error) {
      console.error('Failed to load devices:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await templatesApi.delete(id!);
      setShowDeleteModal(false);
      navigate('/templates');
    } catch (error) {
      console.error('Failed to delete template:', error);
      alert('Failed to delete template. Please try again.');
    }
  };

  const handleDeviceClick = (deviceId: string) => {
    navigate(`/devices/${deviceId}`);
  };

  if (loading || !template) {
    return (
      <Layout>
        <div className="text-center py-12">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{template.name}</h1>
            <p className="text-gray-600 mt-2">{template.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/templates/${id}/devices/new`)}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
            >
              Add Device
            </button>
            <button
              onClick={() => navigate(`/templates/${id}/edit`)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Template Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Connection Type</p>
              <p className="font-medium">{template.connectionType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Hardware</p>
              <p className="font-medium">{template.hardware}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Devices ({devices.length})
          </h2>
          {devices.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 mb-4">No devices added yet.</p>
              <button
                onClick={() => navigate(`/templates/${id}/devices/new`)}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
              >
                Add Your First Device
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onClick={() => handleDeviceClick(device.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Template"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this template? This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};
