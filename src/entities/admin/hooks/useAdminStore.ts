import { useStoreStore } from '../store/storeStore';
import { storeService } from '../services/storeService';
import { useCallback } from 'react';
import type { Store } from '../types/admin.types';

export function useAdminStore() {
  const { store, isLoading, setStore, updateStore, updateTheme } = useStoreStore();

  const fetchStore = useCallback(async () => {
    const data = await storeService.get();
    setStore(data);
    return data;
  }, [setStore]);

  const saveStore = useCallback(
    async (data: Partial<Store>) => {
      const updated = await storeService.update(data);
      setStore(updated);
      return updated;
    },
    [setStore]
  );

  return {
    store,
    isLoading,
    fetchStore,
    saveStore,
    updateStore,
    updateTheme,
  };
}
