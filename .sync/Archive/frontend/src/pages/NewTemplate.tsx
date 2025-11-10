import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { FormInput } from '@/components/FormInput';
import { templatesApi } from '@/services/api';

const CONNECTION_TYPES = ['HTTP', 'MQTT', 'WebSocket'];
const HARDWARE_TYPES = ['Arduino', 'ESP32', 'ESP8266', 'Raspberry Pi', 'Raspberry Pi Pico'];

export const NewTemplate: React.FC = () => {
  const [name, setName] = useState('');
  const [connectionType, setConnectionType] = useState('HTTP');
  const [hardware, setHardware] = useState('Arduino');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await templatesApi.create({ name, connectionType, hardware, description });
      navigate('/templates');
    } catch (error) {
      console.error('Failed to create template:', error);
      alert('Failed to create template. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">New Template</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <FormInput
            label="Template Name"
            value={name}
            onChange={setName}
            placeholder="e.g., Temperature Monitoring"
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Connection Type <span className="text-red-500">*</span>
            </label>
            <select
              value={connectionType}
              onChange={(e) => setConnectionType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              required
            >
              {CONNECTION_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hardware <span className="text-red-500">*</span>
            </label>
            <select
              value={hardware}
              onChange={(e) => setHardware(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              required
            >
              {HARDWARE_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your template..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Template'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
