import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { TemplateCard } from '@/components/TemplateCard';
import { templatesApi } from '@/services/api';
import { Template } from '@/types';

export const CreatedTemplates: React.FC = () => {
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    
    try {
      await templatesApi.delete(id);
      loadTemplates();
    } catch (error) {
      console.error('Failed to delete template:', error);
      alert('Failed to delete template. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Created Templates</h1>
          <button
            onClick={() => navigate('/templates/new')}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            New Template
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading templates...</div>
        ) : templates.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 mb-4">No templates created yet.</p>
            <button
              onClick={() => navigate('/templates/new')}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
            >
              Create Your First Template
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onAddDevice={() => navigate(`/templates/${template.id}/devices/new`)}
                onEdit={() => navigate(`/templates/${template.id}/edit`)}
                onDelete={() => handleDelete(template.id)}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
