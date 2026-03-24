import { create } from 'zustand';
import { Reservation } from '@/services/lab.service';

interface NotificationState {
    notifications: Reservation[];
    unreadCount: number;
    addNotifications: (newReservations: Reservation[]) => void;
    removeNotification: (id: number) => void;
    clearAllNotifications: () => void;
    clearUnread: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    unreadCount: 0,
    addNotifications: (newReservations) => set((state) => {
        // Prevent duplicates by checking IDs
        const uniqueNew = newReservations.filter(
            (newRes) => !state.notifications.some((existing) => existing.id === newRes.id)
        );

        if (uniqueNew.length === 0) return state;

        return {
            notifications: [...uniqueNew, ...state.notifications],
            unreadCount: state.unreadCount + uniqueNew.length,
        };
    }),
    removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
    })),
    clearAllNotifications: () => set({ notifications: [] }),
    clearUnread: () => set({ unreadCount: 0 }),
}));
