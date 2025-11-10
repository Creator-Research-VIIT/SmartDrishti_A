import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { FormInput } from '@/components/FormInput';
import { Modal } from '@/components/Modal';
import { devicesApi, templatesApi } from '@/services/api';
import { Template, Device } from '@/types';
import { generateApiKey } from '@/utils';

const DEVICE_TYPES = ['Arduino', 'ESP32', 'ESP8266', 'Raspberry Pi', 'Raspberry Pi Pico', 'Other'];

export const AddDevice: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [name, setName] = useState('');
  const [deviceType, setDeviceType] = useState('ESP32');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState<Template | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyData, setApiKeyData] = useState<{ apiKey: string; deviceId: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadTemplate();
  }, [templateId]);

  const loadTemplate = async () => {
    try {
      const response = await templatesApi.getById(templateId!);
      setTemplate(response.data as Template);
    } catch (error) {
      console.error('Failed to load template:', error);
      navigate('/templates');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiKey = generateApiKey();
      const response = await devicesApi.create({
        templateId: templateId!,
        name,
        deviceType,
        description: description || undefined,
        location: location || undefined,
      });
      
      const device = response.data as Device;
      setApiKeyData({ apiKey, deviceId: device.id });
      setShowApiKey(true);
    } catch (error) {
      console.error('Failed to create device:', error);
      alert('Failed to create device. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyApiKey = () => {
    if (apiKeyData) {
      navigator.clipboard.writeText(apiKeyData.apiKey);
      alert('API Key copied to clipboard!');
    }
  };

  if (!template) {
    return (
      <Layout>
        <div className="text-center py-12">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Device</h1>
        <p className="text-gray-600 mb-6">Template: {template.name}</p>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <FormInput
            label="Device Name"
            value={name}
            onChange={setName}
            placeholder="e.g., Office Sensor 01"
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Device Type <span className="text-red-500">*</span>
            </label>
            <select
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              required
            >
              {DEVICE_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <FormInput
            label="Description"
            value={description}
            onChange={setDescription}
            placeholder="Optional device description"
          />

          <FormInput
            label="Location"
            value={location}
            onChange={setLocation}
            placeholder="e.g., Room 101, Warehouse A"
          />

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Device'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/templates/${templateId}`)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={showApiKey}
        onClose={() => {
          setShowApiKey(false);
          navigate(`/templates/${templateId}`);
        }}
        title="API Key Generated"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 font-medium">
              ⚠️ Save this API key now! You will not be able to see it again.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Device API Key
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={apiKeyData?.apiKey || ''}
                readOnly
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
              />
              <button
                onClick={copyApiKey}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Use this API key in your Arduino code to send data to your device. This key authenticates your device with the server.
            </p>
          </div>
          <button
            onClick={() => {
              setShowApiKey(false);
              navigate(`/templates/${templateId}`);
            }}
            className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            I've Saved the API Key
          </button>
        </div>
      </Modal>
    </Layout>
  );
};

