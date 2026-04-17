import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types/cart.types';
import type { Product } from '../types/product.types';
import { useCustomerAuthStore } from './customerAuthStore';
import { cartService, type CarritoResponse } from '../services/cartService';
import { storeSearchService } from '../services/storeSearchService';

interface CartState {
  cartId: string | null;
  items: CartItem[];
  syncWithServer: () => Promise<void>;
  addItem: (product: Product, quantity?: number, storeId?: string, storeName?: string, colorId?: number, tallaId?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: () => number;
  itemCount: () => number;
  hasItem: (productId: string) => boolean;
}

function buildFallbackProduct(item: { producto_id: string; precio_unitario: number }): Product {
  return {
    id: item.producto_id,
    name: `Producto ${item.producto_id}`,
    description: 'Producto agregado al carrito',
    price: item.precio_unitario,
    category: 'Sin categoría',
    stock: 0,
    image: '',
    status: 'active',
    sku: item.producto_id,
    rating: 0,
    reviews: 0,
    createdAt: new Date().toISOString(),
  };
}

function mapServerCartToItems(serverCart: CarritoResponse, products: Product[]): CartItem[] {
  const productMap = new Map(products.map((product) => [product.id, product]));

  return serverCart.items.map((item) => {
    const product = productMap.get(item.producto_id) ?? buildFallbackProduct(item);

    return {
      cartItemId: item.carrito_item_id,
      storeId: 'default',
      storeName: 'Golazo Store',
      product: { ...product, price: item.precio_unitario },
      quantity: item.cantidad,
      colorId: item.color_id,
      tallaId: item.talla_id,
      unitPrice: item.precio_unitario,
      subtotal: item.subtotal,
    };
  });
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      items: [],

      syncWithServer: async () => {
        const { isAuthenticated } = useCustomerAuthStore.getState();
        if (!isAuthenticated) return;

        try {
          const [serverCart, products] = await Promise.all([
            cartService.getCart(),
            storeSearchService.getStoreProducts('default').catch(() => []),
          ]);

          set({
            cartId: serverCart.carrito_id,
            items: mapServerCartToItems(serverCart, products),
          });
        } catch {
          set({ cartId: null, items: [] });
        }
      },

      addItem: async (product, quantity = 1, storeId = '', storeName = '', colorId = 1, tallaId = 1) => {
        const safeQuantity = Math.max(1, quantity);
        const items = get().items;
        const existing = items.find((item) => item.product.id === product.id);

        if (existing) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + safeQuantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, { product, quantity: safeQuantity, storeId, storeName, colorId, tallaId }] });
        }

        const { isAuthenticated } = useCustomerAuthStore.getState();
        if (!isAuthenticated) return;

        try {
          await cartService.addItem({
            producto_id: product.id,
            color_id: colorId,
            talla_id: tallaId,
            cantidad: safeQuantity,
          });
          await get().syncWithServer();
        } catch {
          // Keep optimistic state; user can retry from cart view.
        }
      },

      removeItem: async (productId) => {
        const currentItems = get().items;
        const target = currentItems.find((item) => item.product.id === productId);
        set({ items: currentItems.filter((item) => item.product.id !== productId) });

        const { isAuthenticated } = useCustomerAuthStore.getState();
        if (!isAuthenticated || !target?.cartItemId) return;

        try {
          await cartService.removeItem(target.cartItemId);
          await get().syncWithServer();
        } catch {
          await get().syncWithServer();
        }
      },

      updateQuantity: async (productId, quantity) => {
        const target = get().items.find((item) => item.product.id === productId);
        if (quantity <= 0) {
          await get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        });

        const { isAuthenticated } = useCustomerAuthStore.getState();
        if (!isAuthenticated || !target?.cartItemId) return;

        try {
          await cartService.updateItemQuantity(target.cartItemId, { cantidad: quantity });
          await get().syncWithServer();
        } catch {
          await get().syncWithServer();
        }
      },

      clearCart: async () => {
        const { isAuthenticated } = useCustomerAuthStore.getState();
        const cartId = get().cartId;

        if (isAuthenticated && cartId) {
          try {
            await cartService.deleteCart(cartId);
          } catch {
            // Ignore delete failures and still clear local cart.
          }
        }

        set({ items: [], cartId: null });
      },

      total: () =>
        get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),

      itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      hasItem: (productId) => get().items.some((item) => item.product.id === productId),
    }),
    {
      name: 'emarketpro-cart',
      partialize: (state) => ({
        cartId: state.cartId,
        items: state.items,
      }),
    }
  )
);
