import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Measurements {
  chest?: number;
  waist?: number;
  inseam?: number;
  neck?: number;
  sleeve?: number;
}

interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface ProfileStore {
  measurements: Measurements;
  shippingAddresses: ShippingAddress[];
  preferences: {
    sizePreferences: Record<string, string>;
    colorPreferences: string[];
    stylePreferences: string[];
  };
  updateMeasurements: (measurements: Partial<Measurements>) => void;
  addShippingAddress: (address: ShippingAddress) => void;
  removeShippingAddress: (index: number) => void;
  updatePreferences: (preferences: Partial<ProfileStore['preferences']>) => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      measurements: {},
      shippingAddresses: [],
      preferences: {
        sizePreferences: {},
        colorPreferences: [],
        stylePreferences: [],
      },

      updateMeasurements: (measurements) => {
        set((state) => ({
          measurements: { ...state.measurements, ...measurements },
        }));
      },

      addShippingAddress: (address) => {
        set((state) => ({
          shippingAddresses: [...state.shippingAddresses, address],
        }));
      },

      removeShippingAddress: (index) => {
        set((state) => ({
          shippingAddresses: state.shippingAddresses.filter((_, i) => i !== index),
        }));
      },

      updatePreferences: (preferences) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...preferences,
          },
        }));
      },
    }),
    {
      name: 'kct-profile-storage',
    }
  )
);