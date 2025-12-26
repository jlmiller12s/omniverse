// User and Tenant Type Definitions for Multi-Tenancy

export type UserRole =
    | 'Admin'
    | 'Executive'
    | 'Manager'
    | 'Approver'
    | 'TaskOwner'
    | 'Member'
    | 'Viewer';

export type UserStatus = 'Active' | 'Invited' | 'Suspended' | 'Deactivated';

export interface Permission {
    id: string;
    name: string;
    description: string;
    resource: string;
    actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface Role {
    id: string;
    name: UserRole;
    permissions: Permission[];
}

export interface User {
    id: string;
    tenantId: string;
    email: string;
    name: string;
    avatar?: string;
    role: UserRole;
    status: UserStatus;
    department?: string;
    title?: string;
    permissions: string[];
    createdAt: string;
    lastLoginAt?: string;
}

export interface Tenant {
    id: string;
    name: string;
    domain: string;
    logo?: string;
    plan: 'starter' | 'professional' | 'enterprise';
    settings: TenantSettings;
    createdAt: string;
}

export interface TenantSettings {
    theme: 'light' | 'dark' | 'system';
    defaultRole: UserRole;
    ssoEnabled: boolean;
    ssoProvider?: 'okta' | 'auth0' | 'azure';
    mfaRequired: boolean;
    sessionTimeout: number;
    allowedDomains: string[];
}

export interface Team {
    id: string;
    tenantId: string;
    name: string;
    description?: string;
    members: string[];
    leaderId: string;
    createdAt: string;
}

export interface Invitation {
    id: string;
    tenantId: string;
    email: string;
    role: UserRole;
    expiresAt: string;
    invitedBy: string;
    status: 'pending' | 'accepted' | 'expired';
}

export interface AuthState {
    user: User | null;
    tenant: Tenant | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    accessToken: string | null;
    refreshToken: string | null;
}
