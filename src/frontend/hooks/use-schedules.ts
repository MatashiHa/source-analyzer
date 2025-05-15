// hooks/useTemplates.ts
import { useState, useEffect } from 'react';
import api from '@/lib/api'; // предполагается, что у вас есть настроенный api-клиент

interface Schedule {
    id: string;
    name: string;
    description: string;
    status: string;
    frequency: string;
    lastRun: string;
    nextRun: string;
    sources: number;
    newSources: number;
  }

export function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await api.get<{schedules: Schedule[]}>('/analysis/monitoring');
        setSchedules(response.data.schedules);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  return { schedules, loading, error };
}