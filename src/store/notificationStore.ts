// Notification State Store with Zustand
import { create } from 'zustand';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    timestamp: string;
    actionUrl?: string;
    actionLabel?: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
}

interface NotificationActions {
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
}

type NotificationStore = NotificationState & NotificationActions;

export const useNotificationStore = create<NotificationStore>((set) => ({
    notifications: [],
    unreadCount: 0,

    addNotification: (notification) =>
        set((state) => {
            const newNotification: Notification = {
                ...notification,
                id: crypto.randomUUID(),
                timestamp: new Date().toISOString(),
                read: false,
            };
            return {
                notifications: [newNotification, ...state.notifications],
                unreadCount: state.unreadCount + 1,
            };
        }),

    markAsRead: (id) =>
        set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            const wasUnread = notification && !notification.read;
            return {
                notifications: state.notifications.map((n) =>
                    n.id === id ? { ...n, read: true } : n
                ),
                unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
            };
        }),

    markAllAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
        })),

    removeNotification: (id) =>
        set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            const wasUnread = notification && !notification.read;
            return {
                notifications: state.notifications.filter((n) => n.id !== id),
                unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
            };
        }),

    clearAll: () =>
        set({ notifications: [], unreadCount: 0 }),
}));

// Selectors
export const selectNotifications = (state: NotificationStore) => state.notifications;
export const selectUnreadCount = (state: NotificationStore) => state.unreadCount;
export const selectUnreadNotifications = (state: NotificationStore) =>
    state.notifications.filter((n) => !n.read);
