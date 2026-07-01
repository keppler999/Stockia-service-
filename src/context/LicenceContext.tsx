import React, { createContext, useContext, useState, useEffect } from 'react';
import LicenceService from '../services/LicenceService';
import type { LicenceStatus } from '../types';

interface LicenceContextType {
  status: LicenceStatus | null;
  loading: boolean;
  refreshLicence: () => Promise<void>;
  activate: (code: string) => Promise<boolean>;
  startTrial: () => Promise<void>;
}

const LicenceContext = createContext<LicenceContextType | undefined>(undefined);

export function LicenceProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<LicenceStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshLicence();
  }, []);

  const refreshLicence = async () => {
    try {
      const licenceStatus = await LicenceService.checkLicence();
      setStatus(licenceStatus);
    } catch (error) {
      console.error('Erreur chargement licence:', error);
    } finally {
      setLoading(false);
    }
  };

  const activate = async (code: string): Promise<boolean> => {
    const success = await LicenceService.activateLicence(code);
    if (success) {
      await refreshLicence();
    }
    return success;
  };

  const startTrial = async () => {
    await LicenceService.startTrial();
    await refreshLicence();
  };

  return (
    <LicenceContext.Provider value={{
      status,
      loading,
      refreshLicence,
      activate,
      startTrial,
    }}>
      {children}
    </LicenceContext.Provider>
  );
}

export function useLicence() {
  const context = useContext(LicenceContext);
  if (context === undefined) {
    throw new Error('useLicence doit être utilisé dans un LicenceProvider');
  }
  return context;
}
