import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  productIds: string[];
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
  hasFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      productIds: [],

      addFavorite: (productId) => {
        if (get().productIds.includes(productId)) return;
        set({ productIds: [...get().productIds, productId] });
      },

      removeFavorite: (productId) => {
        set({ productIds: get().productIds.filter((id) => id !== productId) });
      },

      toggleFavorite: (productId) => {
        if (get().productIds.includes(productId)) {
          get().removeFavorite(productId);
          return;
        }
        get().addFavorite(productId);
      },

      hasFavorite: (productId) => get().productIds.includes(productId),

      clearFavorites: () => set({ productIds: [] }),
    }),
    { name: 'emarketpro-favorites' }
  )
);
