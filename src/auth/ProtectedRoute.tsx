// Protected Route Component for Role-Based Access Control
import React from 'react';
import { useAuthStore } from '../store';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: UserRole[];
    requiredPermissions?: string[];
    fallback?: React.ReactNode;
}

/**
 * Component that protects routes based on authentication and authorization
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRoles,
    requiredPermissions,
    fallback,
}) => {
    const { user, isAuthenticated } = useAuthStore();

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
        return fallback ? <>{fallback}</> : <LoginRedirect />;
    }

    // Check role requirements
    if (requiredRoles && requiredRoles.length > 0) {
        if (!requiredRoles.includes(user.role)) {
            return fallback ? <>{fallback}</> : <AccessDenied />;
        }
    }

    // Check permission requirements
    if (requiredPermissions && requiredPermissions.length > 0) {
        const hasAllPermissions = requiredPermissions.every((perm) =>
            user.permissions.includes(perm)
        );
        if (!hasAllPermissions) {
            return fallback ? <>{fallback}</> : <AccessDenied />;
        }
    }

    return <>{children}</>;
};

// Login redirect component
const LoginRedirect: React.FC = () => (
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#050505',
            color: 'white',
        }}
    >
        <div style={{ textAlign: 'center' }}>
            <h2>Please log in to continue</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                You need to be authenticated to access this page.
            </p>
        </div>
    </div>
);

// Access denied component
const AccessDenied: React.FC = () => (
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#050505',
            color: 'white',
        }}
    >
        <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'var(--omnicom-coral)' }}>Access Denied</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                You don't have permission to access this page.
            </p>
        </div>
    </div>
);

export default ProtectedRoute;
