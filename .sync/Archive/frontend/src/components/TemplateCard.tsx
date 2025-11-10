import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Template } from '@/types';

interface TemplateCardProps {
  template: Template;
  onAddDevice?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onAddDevice,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const navigate = useNavigate();
  
  const connectionColors = {
    HTTP: 'bg-green-100 text-green-800',
    MQTT: 'bg-blue-100 text-blue-800',
    WebSocket: 'bg-purple-100 text-purple-800',
  };

  const handleClick = () => {
    navigate(`/templates/${template.id}`);
  };

  const handleActionClick = (e: React.MouseEvent, action?: () => void) => {
    e.stopPropagation();
    action?.();
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{template.name}</h3>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${connectionColors[template.connectionType]}`}>
            {template.connectionType}
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Hardware:</span> {template.hardware}
        </p>
        {template.description && (
          <p className="text-sm text-gray-600 mb-2">{template.description}</p>
        )}
        <p className="text-xs text-gray-400">
          Created: {new Date(template.createdAt).toLocaleDateString()}
        </p>
      </div>

      {showActions && (
        <div className="flex gap-2 flex-wrap">
          {onAddDevice && (
            <button
              onClick={(e) => handleActionClick(e, onAddDevice)}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium text-sm"
            >
              Add Device
            </button>
          )}
          {onEdit && (
            <button
              onClick={(e) => handleActionClick(e, onEdit)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium text-sm"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => handleActionClick(e, onDelete)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};
