/**
 * 공통 API 응답 래퍼 — 단일 데이터 응답
 */
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

/**
 * 공통 API 응답 래퍼 — 페이지네이션 응답
 */
export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        totalCount: number;
        totalPages: number;
    };
}
