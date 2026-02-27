import { BabyResponseDto, PostResponseDto } from '@yuna/shared-types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const DEMO_USER_ID = process.env.NEXT_PUBLIC_DEMO_USER_ID ?? 'user_owner';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  // 데모 단계에서는 x-user-id를 통해 역할 시뮬레이션을 수행합니다.
  // 실제 운영 전환 시 쿠키 세션 기반 호출로 교체해야 합니다.
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': DEMO_USER_ID,
      ...(init?.headers ?? {})
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('인증 또는 권한이 없습니다. 로그인/초대 상태를 확인해 주세요.');
    }
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  const payload = (await response.json()) as ApiEnvelope<T>;
  return payload.data;
}

export async function getBabies(): Promise<BabyResponseDto[]> {
  return apiFetch<BabyResponseDto[]>('/babies');
}

export async function getBabyPosts(babyId: string): Promise<PostResponseDto[]> {
  const response = await fetch(`${API_BASE_URL}/babies/${babyId}/posts`, {
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': DEMO_USER_ID
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('인증 또는 권한이 없습니다. 로그인/초대 상태를 확인해 주세요.');
    }
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  const payload = (await response.json()) as {
    success: boolean;
    data: PostResponseDto[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
    };
  };

  return payload.data;
}
