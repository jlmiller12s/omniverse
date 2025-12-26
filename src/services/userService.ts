// User API Service
import apiClient from './apiClient';
import type {
    User,
    Team,
    Invitation,
    UserRole,
    ApiResponse,
    PaginatedResult,
    LoginRequest,
    LoginResponse,
} from '../types';

const USERS_ENDPOINT = '/users';
const AUTH_ENDPOINT = '/auth';
const TEAMS_ENDPOINT = '/teams';

export const userService = {
    // ============ Authentication ============

    /**
     * Login with email and password
     */
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await apiClient.post<ApiResponse<LoginResponse>>(
            `${AUTH_ENDPOINT}/login`,
            credentials
        );
        return response.data.data;
    },

    /**
     * Logout current user
     */
    async logout(): Promise<void> {
        await apiClient.post(`${AUTH_ENDPOINT}/logout`);
    },

    /**
     * Get current user profile
     */
    async getCurrentUser(): Promise<User> {
        const response = await apiClient.get<ApiResponse<User>>(`${USERS_ENDPOINT}/me`);
        return response.data.data;
    },

    /**
     * Update current user profile
     */
    async updateProfile(data: Partial<User>): Promise<User> {
        const response = await apiClient.patch<ApiResponse<User>>(
            `${USERS_ENDPOINT}/me`,
            data
        );
        return response.data.data;
    },

    // ============ User Management ============

    /**
     * Get all users in tenant (admin only)
     */
    async getAll(page = 1, limit = 20): Promise<PaginatedResult<User>> {
        const response = await apiClient.get<ApiResponse<PaginatedResult<User>>>(
            `${USERS_ENDPOINT}?page=${page}&limit=${limit}`
        );
        return response.data.data;
    },

    /**
     * Get user by ID
     */
    async getById(id: string): Promise<User> {
        const response = await apiClient.get<ApiResponse<User>>(`${USERS_ENDPOINT}/${id}`);
        return response.data.data;
    },

    /**
     * Update user role (admin only)
     */
    async updateRole(userId: string, role: UserRole): Promise<User> {
        const response = await apiClient.patch<ApiResponse<User>>(
            `${USERS_ENDPOINT}/${userId}/role`,
            { role }
        );
        return response.data.data;
    },

    /**
     * Deactivate user (admin only)
     */
    async deactivate(userId: string): Promise<void> {
        await apiClient.patch(`${USERS_ENDPOINT}/${userId}/deactivate`);
    },

    // ============ Invitations ============

    /**
     * Invite new user to tenant
     */
    async invite(email: string, role: UserRole): Promise<Invitation> {
        const response = await apiClient.post<ApiResponse<Invitation>>(
            `${USERS_ENDPOINT}/invite`,
            { email, role }
        );
        return response.data.data;
    },

    /**
     * Resend invitation email
     */
    async resendInvitation(invitationId: string): Promise<void> {
        await apiClient.post(`${USERS_ENDPOINT}/invitations/${invitationId}/resend`);
    },

    /**
     * Cancel pending invitation
     */
    async cancelInvitation(invitationId: string): Promise<void> {
        await apiClient.delete(`${USERS_ENDPOINT}/invitations/${invitationId}`);
    },

    // ============ Teams ============

    /**
     * Get all teams
     */
    async getTeams(): Promise<Team[]> {
        const response = await apiClient.get<ApiResponse<Team[]>>(TEAMS_ENDPOINT);
        return response.data.data;
    },

    /**
     * Create a new team
     */
    async createTeam(name: string, memberIds: string[]): Promise<Team> {
        const response = await apiClient.post<ApiResponse<Team>>(TEAMS_ENDPOINT, {
            name,
            memberIds,
        });
        return response.data.data;
    },

    /**
     * Add member to team
     */
    async addTeamMember(teamId: string, userId: string): Promise<Team> {
        const response = await apiClient.post<ApiResponse<Team>>(
            `${TEAMS_ENDPOINT}/${teamId}/members`,
            { userId }
        );
        return response.data.data;
    },

    /**
     * Remove member from team
     */
    async removeTeamMember(teamId: string, userId: string): Promise<void> {
        await apiClient.delete(`${TEAMS_ENDPOINT}/${teamId}/members/${userId}`);
    },
};

export default userService;
