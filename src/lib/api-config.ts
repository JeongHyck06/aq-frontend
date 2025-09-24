// API 설정 유틸리티

/**
 * 환경에 따라 백엔드 URL을 결정하는 함수
 * Mixed Content 오류 방지를 위해 프로덕션에서는 HTTPS 강제 사용
 */
export function getBackendUrl(): string {
    // 서버 사이드 렌더링 시 기본값
    if (typeof window === 'undefined') {
        return (
            process.env.NEXT_PUBLIC_BACKEND_URL ||
            'http://localhost:8080'
        );
    }

    const currentOrigin = window.location.origin;
    const isLocalhost =
        currentOrigin.includes('localhost') ||
        currentOrigin.includes('127.0.0.1');

    // 환경변수가 설정된 경우 우선 사용
    if (process.env.NEXT_PUBLIC_BACKEND_URL) {
        let backendUrl =
            process.env.NEXT_PUBLIC_BACKEND_URL;

        // 프로토콜이 없는 경우 적절한 프로토콜 추가
        if (backendUrl.startsWith('//')) {
            backendUrl = `https:${backendUrl}`;
        } else if (!backendUrl.startsWith('http')) {
            // 로컬호스트가 아닌 경우 HTTPS 강제
            const protocol = isLocalhost ? 'http' : 'https';
            backendUrl = `${protocol}://${backendUrl}`;
        }

        return backendUrl;
    }

    // 환경별 기본 URL
    if (isLocalhost) {
        return 'http://localhost:8080';
    } else {
        // 프로덕션 환경: Mixed Content 오류 방지를 위해 HTTPS 사용
        return 'https://aq-project.duckdns.org:8443';
    }
}

/**
 * 인증된 API 요청을 위한 공통 헤더 생성
 */
export function getAuthHeaders(
    token?: string
): HeadersInit {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

/**
 * 로컬 스토리지에서 액세스 토큰 가져오기
 */
export function getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
}

/**
 * 로컬 스토리지에서 리프레시 토큰 가져오기
 */
export function getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
}

/**
 * 토큰을 로컬 스토리지에 저장
 */
export function saveTokens(
    accessToken: string,
    refreshToken: string
): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
}

/**
 * 로컬 스토리지에서 토큰 제거
 */
export function clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}
