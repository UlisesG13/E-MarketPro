import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Package, Sparkles, Users, Workflow } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNotificationsStore } from '../../store/notificationsStore';
import type { AppNotification } from '../../types/common.types';

const iconMap: Record<AppNotification['kind'], React.ReactNode> = {
  order: <Package className="h-4 w-4" />,
  system: <Workflow className="h-4 w-4" />,
  insight: <Sparkles className="h-4 w-4" />,
  customer: <Users className="h-4 w-4" />,
};

const NotificationMenu: React.FC = () => {
  const navigate = useNavigate();
  const items = useNotificationsStore((state) => state.items);
  const unread = useNotificationsStore((state) => state.unreadCount());
  const markAsRead = useNotificationsStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationsStore((state) => state.markAllAsRead);
  const [open, setOpen] = useState(false);

  const handleOpenNotification = (notification: AppNotification) => {
    markAsRead(notification.id);
    setOpen(false);
    if (notification.href) navigate(notification.href);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="app-icon-button relative"
        aria-label="Notificaciones"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[var(--app-primary)] px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 cursor-default"
            aria-label="Cerrar notificaciones"
          />
          <div className="app-surface absolute right-0 z-40 mt-3 w-[340px] rounded-[24px] border p-3 shadow-[var(--app-shadow)]">
            <div className="flex items-center justify-between px-2 py-2">
              <div>
                <p className="text-sm font-semibold text-[var(--app-text)]">Notificaciones</p>
                <p className="text-xs text-[var(--app-text-muted)]">
                  {unread} sin leer
                </p>
              </div>
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-[var(--app-primary)] transition-colors hover:bg-[var(--app-primary-soft)]"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Marcar todo
              </button>
            </div>

            <div className="mt-1 space-y-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleOpenNotification(item)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition-colors',
                    item.read
                      ? 'hover:bg-[var(--app-surface-soft)]'
                      : 'bg-[var(--app-primary-soft)] hover:opacity-90'
                  )}
                >
                  <div className="mt-0.5 rounded-xl bg-[var(--app-surface-soft)] p-2 text-[var(--app-primary)]">
                    {iconMap[item.kind]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-[var(--app-text)]">{item.title}</p>
                      {!item.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--app-primary)]" />}
                    </div>
                    <p className="mt-1 text-xs leading-5 text-[var(--app-text-muted)]">
                      {item.description}
                    </p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[var(--app-text-soft)]">
                      {item.time}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationMenu;
