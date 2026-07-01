import { useState, useEffect } from 'react';
import DatabaseService from '../services/DatabaseService';

export function useDatabase() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      await DatabaseService.init();
      setIsReady(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur base de données');
    }
  };

  return { isReady, error };
}
