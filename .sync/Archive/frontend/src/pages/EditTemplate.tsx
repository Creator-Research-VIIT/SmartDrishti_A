import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { FormInput } from '@/components/FormInput';
import { templatesApi } from '@/services/api';
import { Template } from '@/types';

const CONNECTION_TYPES = ['HTTP', 'MQTT', 'WebSocket'];
const HARDWARE_TYPES = ['Arduino', 'ESP32', 'ESP8266', 'Raspberry Pi', 'Raspberry Pi Pico'];

export const EditTemplate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<Partial<Template>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadTemplate();
  }, [id]);

  const loadTemplate = async () => {
    try {
      const response = await templatesApi.getById(id!);
      setTemplate(response.data as Template);
    } catch (error) {
      console.error('Failed to load template:', error);
      alert('Failed to load template. Redirecting...');
      navigate('/templates');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await templatesApi.update(id!, template);
      navigate('/templates');
    } catch (error) {
      console.error('Failed to update template:', error);
      alert('Failed to update template. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Template</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <FormInput
            label="Template Name"
            value={template.name || ''}
            onChange={(value) => setTemplate({ ...template, name: value })}
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Connection Type <span className="text-red-500">*</span>
            </label>
            <select
              value={template.connectionType || 'HTTP'}
              onChange={(e) => setTemplate({ ...template, connectionType: e.target.value as any })}
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
              value={template.hardware || 'Arduino'}
              onChange={(e) => setTemplate({ ...template, hardware: e.target.value })}
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
              value={template.description || ''}
              onChange={(e) => setTemplate({ ...template, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/templates')}
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
