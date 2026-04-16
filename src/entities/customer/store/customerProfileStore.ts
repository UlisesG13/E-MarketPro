import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CustomerProfile,
  CustomerAddress,
  CustomerPreferences,
} from '../types/customer.types';

interface CustomerProfileState {
  profile: CustomerProfile;
  addresses: CustomerAddress[];
  preferences: CustomerPreferences;
  updateProfile: (data: Partial<CustomerProfile>) => void;
  savePreferences: (data: Partial<CustomerPreferences>) => void;
  addAddress: (address: Omit<CustomerAddress, 'id'>) => void;
  updateAddress: (id: string, data: Partial<CustomerAddress>) => void;
  removeAddress: (id: string) => void;
  getDefaultAddress: () => CustomerAddress | undefined;
  resetProfile: () => void;
}

const DEFAULT_PROFILE: CustomerProfile = {
  fullName: '',
  email: '',
  phone: '',
};

const DEFAULT_PREFERENCES: CustomerPreferences = {
  marketingEmails: true,
  orderUpdates: true,
  savedCards: false,
};

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export const useCustomerProfileStore = create<CustomerProfileState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      addresses: [],
      preferences: DEFAULT_PREFERENCES,

      updateProfile: (data) => {
        set({ profile: { ...get().profile, ...data } });
      },

      savePreferences: (data) => {
        set({ preferences: { ...get().preferences, ...data } });
      },

      addAddress: (address) => {
        const newAddress: CustomerAddress = { ...address, id: generateId('addr') };
        const hasDefault = get().addresses.some((a) => a.isDefault);
        const finalAddress =
          newAddress.isDefault || !hasDefault ? { ...newAddress, isDefault: true } : newAddress;

        set({
          addresses: get()
            .addresses.map((a) => (finalAddress.isDefault ? { ...a, isDefault: false } : a))
            .concat(finalAddress),
        });
      },

      updateAddress: (id, data) => {
        set({
          addresses: get().addresses.map((address) => {
            if (address.id === id) return { ...address, ...data };
            if (data.isDefault) return { ...address, isDefault: false };
            return address;
          }),
        });
      },

      removeAddress: (id) => {
        const remaining = get().addresses.filter((a) => a.id !== id);
        if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
          remaining[0] = { ...remaining[0], isDefault: true };
        }
        set({ addresses: remaining });
      },

      getDefaultAddress: () => get().addresses.find((a) => a.isDefault),

      resetProfile: () =>
        set({ profile: DEFAULT_PROFILE, addresses: [], preferences: DEFAULT_PREFERENCES }),
    }),
    { name: 'emarketpro-customer-profile' }
  )
);

// Backward compatibility alias
export { useCustomerProfileStore as useCustomerStore };
