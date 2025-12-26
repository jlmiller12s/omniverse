// Authentication Hook
import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store';
import { userService, setAuthHeader, clearAuthHeader } from '../services';
import type { LoginRequest } from '../types';

/**
 * Hook for authentication operations
 */
export function useAuth() {
    const {
        user,
        tenant,
        isAuthenticated,
        isLoading,
        login: setAuth,
        logout: clearAuth,
        setLoading,
    } = useAuthStore();

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: (credentials: LoginRequest) => userService.login(credentials),
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data) => {
            setAuth(data.user, data.tenant, data.accessToken, data.refreshToken);
            setAuthHeader(data.accessToken);
        },
        onError: () => {
            setLoading(false);
        },
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: () => userService.logout(),
        onSettled: () => {
            clearAuth();
            clearAuthHeader();
        },
    });

    // Login handler
    const login = useCallback(
        async (email: string, password: string) => {
            return loginMutation.mutateAsync({ email, password });
        },
        [loginMutation]
    );

    // Logout handler
    const logout = useCallback(async () => {
        return logoutMutation.mutateAsync();
    }, [logoutMutation]);

    // Check if user has a specific permission
    const hasPermission = useCallback(
        (permission: string) => {
            if (!user) return false;
            return user.permissions.includes(permission);
        },
        [user]
    );

    // Check if user has a specific role
    const hasRole = useCallback(
        (roles: string | string[]) => {
            if (!user) return false;
            const roleArray = Array.isArray(roles) ? roles : [roles];
            return roleArray.includes(user.role);
        },
        [user]
    );

    return {
        user,
        tenant,
        isAuthenticated,
        isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,
        login,
        logout,
        hasPermission,
        hasRole,
        loginError: loginMutation.error,
    };
}

export default useAuth;
