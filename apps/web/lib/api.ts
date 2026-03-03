/**
 * API 통신 래퍼 모듈
 *
 * - 모든 요청에 credentials: 'include'를 붙여 HttpOnly Cookie를 전송한다.
 * - 401 응답 시 /auth/refresh를 시도하고, 실패 시 로그인 페이지로 이동한다.
 * - 응답은 자동으로 JSON으로 파싱된다.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

// API 에러를 구체적으로 표현하기 위한 커스텀 에러 클래스
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 토큰 갱신 중복 요청 방지를 위한 플래그
let isRefreshing = false;

/**
 * 토큰 갱신을 시도한다.
 * 갱신 실패 시 로그인 페이지로 리다이렉트한다.
 */
async function refreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * 기본 fetch 래퍼
 * @param path API 경로 (예: '/auth/me')
 * @param init RequestInit 옵션
 * @param retry 401 시 재시도 여부 (내부 재귀 호출 방지용)
 */
async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  retry = true,
): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const response = await fetch(url, {
    ...init,
    // 모든 요청에 Cookie를 포함시켜 세션 인증을 유지한다
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  // 401 Unauthorized: 토큰 갱신 시도
  if (response.status === 401 && retry && !isRefreshing) {
    isRefreshing = true;
    const refreshed = await refreshToken();
    isRefreshing = false;

    if (refreshed) {
      // 갱신 성공 시 원래 요청을 한 번 더 시도 (재시도 플래그 false)
      return apiFetch<T>(path, init, false);
    } else {
      // 갱신 실패 시 로그인 페이지로 이동 (클라이언트 사이드에서만)
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new ApiError(401, '인증이 필요합니다. 다시 로그인해 주세요.');
    }
  }

  // 응답이 성공이 아닌 경우 에러 throw
  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const errorBody = await response.json();
      message = errorBody.message ?? message;
    } catch {
      // JSON 파싱 실패 시 기본 메시지 사용
    }
    throw new ApiError(response.status, message);
  }

  // 204 No Content 등 응답 바디가 없는 경우 처리
  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ─── HTTP 메서드 단축 함수 ───────────────────────────────────────────────────

export const api = {
  /** GET 요청 */
  get<T>(path: string, init?: RequestInit): Promise<T> {
    return apiFetch<T>(path, { ...init, method: 'GET' });
  },

  /** POST 요청 */
  post<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return apiFetch<T>(path, {
      ...init,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  /** PATCH 요청 */
  patch<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return apiFetch<T>(path, {
      ...init,
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  /** PUT 요청 */
  put<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return apiFetch<T>(path, {
      ...init,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  /** DELETE 요청 */
  delete<T>(path: string, init?: RequestInit): Promise<T> {
    return apiFetch<T>(path, { ...init, method: 'DELETE' });
  },

  /**
   * multipart/form-data 업로드 (Content-Type 헤더를 브라우저가 자동 설정하도록
   * 수동으로 지정하지 않는다)
   */
  upload<T>(path: string, formData: FormData): Promise<T> {
    return apiFetch<T>(
      path,
      {
        method: 'POST',
        body: formData,
        // Content-Type을 명시하지 않아야 브라우저가 boundary를 자동으로 추가한다
        headers: {},
      },
      true,
    );
  },
};
