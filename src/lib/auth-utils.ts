// 인증 관련 유틸리티 함수들

import {
    getBackendUrl,
    getAccessToken,
    getRefreshToken,
    saveTokens,
    clearTokens,
    getAuthHeaders,
} from './api-config';

interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    code: string;
}

/**
 * 토큰 재발급 함수
 */
export async function reissueTokens(): Promise<boolean> {
    try {
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();

        if (!accessToken || !refreshToken) {
            console.warn(
                '토큰이 없어 재발급할 수 없습니다.'
            );
            return false;
        }

        const response = await fetch(
            `${getBackendUrl()}/auth/reissue`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    RefreshToken: refreshToken,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            console.error(
                '토큰 재발급 실패:',
                response.status,
                response.statusText
            );
            return false;
        }

        const result: ApiResponse<TokenResponse> =
            await response.json();

        if (result.success && result.data) {
            saveTokens(
                result.data.accessToken,
                result.data.refreshToken
            );
            console.log('토큰 재발급 성공');
            return true;
        } else {
            console.error(
                '토큰 재발급 응답 오류:',
                result.message
            );
            return false;
        }
    } catch (error) {
        console.error('토큰 재발급 중 오류:', error);
        return false;
    }
}

/**
 * 인증이 필요한 API 요청을 위한 래퍼 함수
 * 401 오류 시 자동으로 토큰 재발급 시도
 */
export async function authenticatedFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const token = getAccessToken();

    if (!token) {
        throw new Error('인증 토큰이 없습니다.');
    }

    // 첫 번째 요청
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            ...getAuthHeaders(token),
        },
    });

    // 401 오류이고 토큰 재발급이 가능한 경우
    if (response.status === 401 && getRefreshToken()) {
        console.log('401 오류 발생, 토큰 재발급 시도...');

        const reissueSuccess = await reissueTokens();

        if (reissueSuccess) {
            // 새 토큰으로 재요청
            const newToken = getAccessToken();
            return fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    ...getAuthHeaders(newToken!),
                },
            });
        } else {
            // 토큰 재발급 실패 시 로그아웃 처리
            clearTokens();
            throw new Error(
                '인증이 만료되었습니다. 다시 로그인해주세요.'
            );
        }
    }

    return response;
}

/**
 * 로그인 상태 확인
 */
export function isLoggedIn(): boolean {
    return !!getAccessToken();
}

/**
 * 사용자 정보 가져오기 (토큰 재발급 포함)
 */
export async function fetchUserInfo(): Promise<any> {
    const response = await authenticatedFetch(
        `${getBackendUrl()}/auth/me`
    );

    if (!response.ok) {
        throw new Error(
            `사용자 정보 조회 실패: ${response.status}`
        );
    }

    const result: ApiResponse<any> = await response.json();

    if (result.success && result.data) {
        return result.data;
    } else {
        throw new Error(
            result.message ||
                '사용자 정보를 가져올 수 없습니다.'
        );
    }
}

