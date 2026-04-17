import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CustomerProfile,
  CustomerAddress,
  CustomerPreferences,
} from '../types/customer.types';
import { useCustomerAuthStore } from './customerAuthStore';
import { addressService } from '../services/addressService';

interface CustomerProfileState {
  profile: CustomerProfile;
  addresses: CustomerAddress[];
  preferences: CustomerPreferences;
  isLoadingAddresses: boolean;
  fetchAddresses: () => Promise<void>;
  updateProfile: (data: Partial<CustomerProfile>) => void;
  savePreferences: (data: Partial<CustomerPreferences>) => void;
  addAddress: (address: Omit<CustomerAddress, 'id'>) => Promise<CustomerAddress | null>;
  updateAddress: (id: string, data: Partial<CustomerAddress>) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
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
      isLoadingAddresses: false,

      fetchAddresses: async () => {
        const { isAuthenticated } = useCustomerAuthStore.getState();
        if (!isAuthenticated) return;

        set({ isLoadingAddresses: true });
        try {
          const addresses = await addressService.list();
          set({ addresses, isLoadingAddresses: false });
        } catch {
          set({ isLoadingAddresses: false });
        }
      },

      updateProfile: (data) => {
        set({ profile: { ...get().profile, ...data } });
      },

      savePreferences: (data) => {
        set({ preferences: { ...get().preferences, ...data } });
      },

      addAddress: async (address) => {
        const { isAuthenticated } = useCustomerAuthStore.getState();

        if (isAuthenticated) {
          try {
            const created = await addressService.create(address);
            const hasDefault = get().addresses.some((a) => a.isDefault);
            const finalAddress =
              created.isDefault || !hasDefault ? { ...created, isDefault: true } : created;

            set({
              addresses: get()
                .addresses.map((a) => (finalAddress.isDefault ? { ...a, isDefault: false } : a))
                .concat(finalAddress),
            });

            if (finalAddress.isDefault && finalAddress.backendAddressId) {
              await addressService.setPrimary(finalAddress.backendAddressId);
            }

            return finalAddress;
          } catch {
            return null;
          }
        }

        const newAddress: CustomerAddress = { ...address, id: generateId('addr') };
        const hasDefault = get().addresses.some((a) => a.isDefault);
        const finalAddress =
          newAddress.isDefault || !hasDefault ? { ...newAddress, isDefault: true } : newAddress;

        set({
          addresses: get()
            .addresses.map((a) => (finalAddress.isDefault ? { ...a, isDefault: false } : a))
            .concat(finalAddress),
        });

        return finalAddress;
      },

      updateAddress: async (id, data) => {
        const current = get().addresses.find((address) => address.id === id);
        if (!current) return;

        const nextAddress = { ...current, ...data };

        set({
          addresses: get().addresses.map((address) => {
            if (address.id === id) return nextAddress;
            if (data.isDefault) return { ...address, isDefault: false };
            return address;
          }),
        });

        const { isAuthenticated } = useCustomerAuthStore.getState();
        if (!isAuthenticated) return;

        const backendId = current.backendAddressId ?? Number(id);
        if (!Number.isFinite(backendId) || backendId <= 0) return;

        try {
          await addressService.update(backendId, {
            ...nextAddress,
          });

          if (data.isDefault) {
            await addressService.setPrimary(backendId);
          }

          await get().fetchAddresses();
        } catch {
          // keep optimistic local state
        }
      },

      removeAddress: async (id) => {
        const target = get().addresses.find((address) => address.id === id);

        const remaining = get().addresses.filter((a) => a.id !== id);
        if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
          remaining[0] = { ...remaining[0], isDefault: true };
        }
        set({ addresses: remaining });

        const { isAuthenticated } = useCustomerAuthStore.getState();
        if (!isAuthenticated) return;

        const backendId = target?.backendAddressId ?? Number(id);
        if (!Number.isFinite(backendId) || backendId <= 0) return;

        try {
          await addressService.remove(backendId);
          await get().fetchAddresses();
        } catch {
          // keep optimistic local state
        }
      },

      getDefaultAddress: () => get().addresses.find((a) => a.isDefault),

      resetProfile: () =>
        set({ profile: DEFAULT_PROFILE, addresses: [], preferences: DEFAULT_PREFERENCES, isLoadingAddresses: false }),
    }),
    { name: 'emarketpro-customer-profile' }
  )
);

// Backward compatibility alias
export { useCustomerProfileStore as useCustomerStore };
