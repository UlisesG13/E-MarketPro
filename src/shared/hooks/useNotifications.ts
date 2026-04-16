import { useNotificationsStore } from '../store/notificationsStore';

export function useNotifications() {
  return useNotificationsStore();
}
