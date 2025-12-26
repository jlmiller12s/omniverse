// API Response Type Definitions

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    timestamp: string;
}

export interface ApiError {
    success: false;
    error: {
        code: string;
        message: string;
        details?: Record<string, string[]>;
    };
    timestamp: string;
}

export interface PaginatedResult<T> {
    items: T[];
    pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface QueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    [key: string]: string | number | boolean | undefined;
}

export interface MutationResult<T> {
    data: T | null;
    isLoading: boolean;
    error: ApiError | null;
    reset: () => void;
}

// Request/Response types for specific endpoints
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: import('./user.types').User;
    tenant: import('./user.types').Tenant;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    expiresIn: number;
}
