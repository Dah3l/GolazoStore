import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BusinessSettings } from '../types';
import { supabase } from '../lib/supabase';

interface BusinessContextType {
  settings: BusinessSettings;
  loading: boolean;
}

const defaultSettings: BusinessSettings = {
  business_name: 'Golazo Store',
  whatsapp_number: '5351234567',
  email: 'contacto@golazostore.com',
  address: 'La Habana, Cuba',
  description: 'Las mejores camisetas de fútbol al mejor precio. Envíos a toda Cuba. ⚽',
  instagram: '',
  facebook: '',
  telegram: '',
};

const BusinessContext = createContext<BusinessContextType>({ settings: defaultSettings, loading: true });

export const BusinessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<BusinessSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .single();
      if (!error && data) {
        setSettings(data);
      }
    } catch (e) {
      console.log('Using default settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BusinessContext.Provider value={{ settings, loading }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => useContext(BusinessContext);
