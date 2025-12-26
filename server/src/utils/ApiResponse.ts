// API Response Helper
export class ApiResponse {
    static success<T>(data: T, message?: string) {
        return {
            success: true,
            data,
            message,
            timestamp: new Date().toISOString(),
        };
    }

    static error(message: string, code: string, details?: Record<string, string[]>) {
        return {
            success: false,
            error: {
                code,
                message,
                details,
            },
            timestamp: new Date().toISOString(),
        };
    }

    static paginated<T>(items: T[], page: number, limit: number, totalItems: number) {
        const totalPages = Math.ceil(totalItems / limit);
        return {
            success: true,
            data: {
                items,
                pagination: {
                    page,
                    limit,
                    totalItems,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                },
            },
            timestamp: new Date().toISOString(),
        };
    }
}
