import { Visibility } from '../enums';

/** FE → BE: 매직링크 요청 */
export interface MagicLinkRequestDto {
    email: string;
}

/** FE → BE: 회원가입 (초대 수락 후 신규 사용자) */
export interface RegisterDto {
    name: string;
    token: string; // 초대 토큰 또는 매직링크 토큰
}

/** BE → FE: 로그인 성공 응답 (Cookie로 토큰 전달, body에는 사용자 info) */
export interface LoginResponseDto {
    id: string;
    email: string;
    name: string;
}

/** BE → FE: 현재 사용자 정보 */
export interface MeResponseDto {
    id: string;
    email: string;
    name: string;
}
