import React, { useEffect, useState } from 'react';
import { Book, FileText, Video, Download } from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';

const ResourceLibrary = () => {
  const [resources, setResources] = useState<any[]>([]);
  const { getResources } = useDatabase();

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const data = await getResources();
      setResources(data);
    } catch (error) {
      console.error('Error loading resources:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf guide':
        return Book;
      case 'video':
        return Video;
      default:
        return FileText;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => {
          const IconComponent = getIcon(resource.type);
          return (
            <div key={resource.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <IconComponent className="w-8 h-8 text-indigo-600" />
                <span className="text-sm text-gray-500">{resource.type}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
              <p className="text-gray-600 mb-4">{resource.description}</p>
              <a 
                href={resource.url}
                className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Resource
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceLibrary;