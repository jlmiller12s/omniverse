// UI State Store with Zustand
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type View = 'dashboard' | 'forge' | 'registry' | 'teams' | 'projects' | 'tasks';
type Persona = 'Executive' | 'Manager' | 'Approver' | 'Task Owner';
type Theme = 'light' | 'dark' | 'system';

interface UIState {
    currentView: View;
    currentPersona: Persona;
    sidebarOpen: boolean;
    theme: Theme;
    showTutorial: boolean;
    isNotificationMenuOpen: boolean;
    isPersonaMenuOpen: boolean;
    toast: { message: string; type: 'success' | 'error' | 'info' } | null;
}

interface UIActions {
    setView: (view: View) => void;
    setPersona: (persona: Persona) => void;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    setTheme: (theme: Theme) => void;
    setShowTutorial: (show: boolean) => void;
    toggleNotificationMenu: () => void;
    closeNotificationMenu: () => void;
    togglePersonaMenu: () => void;
    closePersonaMenu: () => void;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    hideToast: () => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
    persist(
        (set) => ({
            currentView: 'dashboard',
            currentPersona: 'Manager',
            sidebarOpen: true,
            theme: 'dark',
            showTutorial: false,
            isNotificationMenuOpen: false,
            isPersonaMenuOpen: false,
            toast: null,

            setView: (view) =>
                set({ currentView: view, isNotificationMenuOpen: false, isPersonaMenuOpen: false }),

            setPersona: (persona) =>
                set({ currentPersona: persona, isPersonaMenuOpen: false }),

            toggleSidebar: () =>
                set((state) => ({ sidebarOpen: !state.sidebarOpen })),

            setSidebarOpen: (open) =>
                set({ sidebarOpen: open }),

            setTheme: (theme) =>
                set({ theme }),

            setShowTutorial: (show) =>
                set({ showTutorial: show }),

            toggleNotificationMenu: () =>
                set((state) => ({
                    isNotificationMenuOpen: !state.isNotificationMenuOpen,
                    isPersonaMenuOpen: false,
                })),

            closeNotificationMenu: () =>
                set({ isNotificationMenuOpen: false }),

            togglePersonaMenu: () =>
                set((state) => ({
                    isPersonaMenuOpen: !state.isPersonaMenuOpen,
                    isNotificationMenuOpen: false,
                })),

            closePersonaMenu: () =>
                set({ isPersonaMenuOpen: false }),

            showToast: (message, type = 'success') =>
                set({ toast: { message, type } }),

            hideToast: () =>
                set({ toast: null }),
        }),
        {
            name: 'omniverse-ui',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                sidebarOpen: state.sidebarOpen,
                theme: state.theme,
                currentPersona: state.currentPersona,
            }),
        }
    )
);

// Selectors
export const selectCurrentView = (state: UIStore) => state.currentView;
export const selectCurrentPersona = (state: UIStore) => state.currentPersona;
export const selectSidebarOpen = (state: UIStore) => state.sidebarOpen;
export const selectTheme = (state: UIStore) => state.theme;
