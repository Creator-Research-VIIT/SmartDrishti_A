import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { templatesApi } from '@/services/api';
import { Template } from '@/types';

export const Dashboard: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await templatesApi.getAll();
      setTemplates(response.data as Template[]);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/templates/new')}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
            >
              New Template
            </button>
            <button
              onClick={() => navigate('/templates')}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Created Templates
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Templates Overview</h2>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No templates yet. Create your first template to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => navigate(`/templates/${template.id}`)}
                >
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{template.connectionType}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
