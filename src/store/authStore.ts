// Authentication State Store with Zustand
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, Tenant, AuthState } from '../types';

interface AuthActions {
    login: (user: User, tenant: Tenant, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
    setLoading: (isLoading: boolean) => void;
    refreshAccessToken: (accessToken: string) => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
    user: null,
    tenant: null,
    isAuthenticated: false,
    isLoading: false,
    accessToken: null,
    refreshToken: null,
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            ...initialState,

            login: (user, tenant, accessToken, refreshToken) =>
                set({
                    user,
                    tenant,
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                    isLoading: false,
                }),

            logout: () =>
                set({
                    ...initialState,
                }),

            updateUser: (userData) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null,
                })),

            setLoading: (isLoading) =>
                set({ isLoading }),

            refreshAccessToken: (accessToken) =>
                set({ accessToken }),
        }),
        {
            name: 'omniverse-auth',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                tenant: state.tenant,
                isAuthenticated: state.isAuthenticated,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
            }),
        }
    )
);

// Selectors for optimized re-renders
export const selectUser = (state: AuthStore) => state.user;
export const selectTenant = (state: AuthStore) => state.tenant;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectAccessToken = (state: AuthStore) => state.accessToken;
