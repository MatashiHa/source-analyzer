// hooks/useTemplates.ts
import { useState, useEffect } from 'react';
import api from '@/lib/api'; // предполагается, что у вас есть настроенный api-клиент

interface Template {
  id: string;
  name: string;
  description: string;
  categories: string[];
  isDefault: boolean;
}

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.get<{templates: Template[]}>('/analysis/templates');
        setTemplates(response.data.templates);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return { templates, loading, error };
}