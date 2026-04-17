import { useCartStore } from '../../../entities/customer/store/cartStore';
import type { Product } from '../types/product.types';

export function useCart() {
  const store = useCartStore();

  return {
    cartId: store.cartId,
    items: store.items,
    addItem: (product: Product, quantity?: number, storeId?: string, storeName?: string, colorId?: number, tallaId?: number) =>
      store.addItem(product, quantity, storeId, storeName, colorId, tallaId),
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    syncWithServer: store.syncWithServer,
    total: store.total(),
    itemCount: store.itemCount(),
    hasItem: store.hasItem,
    isEmpty: store.items.length === 0,
  };
}
