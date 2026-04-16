import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppNotification } from '../types';

interface NotificationsState {
  items: AppNotification[];
  unreadCount: () => number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  pushNotification: (notification: Omit<AppNotification, 'read'>) => void;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Nuevo pedido listo para revisar',
    description: 'ORD-01025 acaba de entrar y requiere validación de pago.',
    time: 'Hace 5 min',
    href: '/orders',
    read: false,
    kind: 'order',
  },
  {
    id: 'notif-2',
    title: 'Stock bajo detectado',
    description: 'Monitor Curvo 27" está por agotarse. Considera reabastecer.',
    time: 'Hace 18 min',
    href: '/products',
    read: false,
    kind: 'system',
  },
  {
    id: 'notif-3',
    title: 'Tu tienda recibió una nueva reseña',
    description: 'Los clientes están valorando mejor los productos destacados.',
    time: 'Hace 1 hora',
    href: '/dashboard',
    read: true,
    kind: 'customer',
  },
  {
    id: 'notif-4',
    title: 'Comparativa financiera actualizada',
    description: 'Ya puedes revisar el análisis financiero y el punto de equilibrio.',
    time: 'Hoy',
    href: '/financial',
    read: true,
    kind: 'insight',
  },
];

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      items: INITIAL_NOTIFICATIONS,
      unreadCount: () => get().items.filter((item) => !item.read).length,
      markAsRead: (id) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, read: true } : item
          ),
        });
      },
      markAllAsRead: () => {
        set({
          items: get().items.map((item) => ({ ...item, read: true })),
        });
      },
      pushNotification: (notification) => {
        set({
          items: [{ ...notification, read: false }, ...get().items].slice(0, 10),
        });
      },
    }),
    { name: 'emarketpro-notifications' }
  )
);
