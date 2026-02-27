export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers,
        // credentials: 'include'는 Next.js (서버 컴포넌트) 환경이 아닌 클라이언트(브라우저) 환경에서 
        // 쿠키를 포함해 요청하기 위해 주로 필요하며, App Router의 Server Actions/Components 에서는
        // next/headers의 cookies()를 명시적으로 넘겨줘야 함
    });

    if (!response.ok) {
        let errorMsg = 'API request failed';
        try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
        } catch (e) {
            // JSON 파싱 실패 무시
        }
        throw new Error(errorMsg);
    }

    const data = await response.json();
    return data.data || data; // 백엔드 응답이 { success: boolean, data: T } 포맷이므로 .data를 추출
};
