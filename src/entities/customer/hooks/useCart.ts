import { useCartStore } from '../../../entities/customer/store/cartStore';
import type { Product } from '../types/product.types';

export function useCart() {
  const store = useCartStore();

  return {
    items: store.items,
    addItem: (product: Product, quantity?: number, storeId?: string, storeName?: string) =>
      store.addItem(product, quantity, storeId, storeName),
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    total: store.total(),
    itemCount: store.itemCount(),
    hasItem: store.hasItem,
    isEmpty: store.items.length === 0,
  };
}
