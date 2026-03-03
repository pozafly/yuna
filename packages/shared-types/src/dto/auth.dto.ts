export interface MagicLinkRequestDto {
  email: string;
}

export interface RegisterDto {
  name: string;
  token: string;
}

export interface LoginResponseDto {
  id: string;
  email: string;
  name: string;
}
