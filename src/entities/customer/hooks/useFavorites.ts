import { useFavoritesStore } from '../../../entities/customer/store/favoritesStore';

export function useFavorites() {
  return useFavoritesStore();
}
