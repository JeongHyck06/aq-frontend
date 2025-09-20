'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserManager } from '@/lib/oidc-client';
import type { User } from 'oidc-client-ts';

export default function OidcCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const processCallback = async () => {
            try {
                const mgr = getUserManager();
                const user: User | null =
                    await mgr.signinRedirectCallback();

                if (!user || !user.id_token) {
                    throw new Error(
                        'OIDC 유저 정보 또는 id_token을 받지 못했습니다.'
                    );
                }

                // 백엔드 URL 설정 (단순화)
                const backendUrl =
                    process.env.NEXT_PUBLIC_BACKEND_URL ||
                    'http://localhost:8080';

                console.log('🚀 백엔드 로그인 요청 시작:', {
                    url: `${backendUrl}/auth/login`,
                    hasIdToken: !!user.id_token,
                    idTokenLength:
                        user.id_token?.length || 0,
                });

                const res = await fetch(
                    `${backendUrl}/auth/login`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type':
                                'application/json',
                            id_token: user.id_token,
                        },
                        mode: 'cors', // CORS 모드 명시
                    }
                );

                console.log('📡 백엔드 응답 상태:', {
                    status: res.status,
                    statusText: res.statusText,
                    ok: res.ok,
                    headers: Object.fromEntries(
                        res.headers.entries()
                    ),
                });

                if (!res.ok) {
                    const errorBody = await res.text();
                    console.error('백엔드 오류 응답:', {
                        status: res.status,
                        statusText: res.statusText,
                        errorBody,
                    });
                    throw new Error(
                        `백엔드 로그인 실패: ${res.status} - ${errorBody}`
                    );
                }

                const responseData = await res.json();

                if (
                    responseData.success &&
                    responseData.data
                ) {
                    const { accessToken, refreshToken } =
                        responseData.data;
                    if (typeof window !== 'undefined') {
                        localStorage.setItem(
                            'accessToken',
                            accessToken
                        );
                        localStorage.setItem(
                            'refreshToken',
                            refreshToken
                        );
                    }

                    window.location.href = '/';
                } else {
                    throw new Error(
                        responseData.message ||
                            '서버에서 토큰을 받아오지 못했습니다.'
                    );
                }
            } catch (error) {
                console.error(
                    'OIDC 콜백 처리 중 오류 발생:',
                    {
                        error:
                            error instanceof Error
                                ? error.message
                                : error,
                        stack:
                            error instanceof Error
                                ? error.stack
                                : undefined,
                        backendUrl:
                            process.env
                                .NEXT_PUBLIC_BACKEND_URL ||
                            'http://localhost:8080',
                        currentUrl: window.location.href,
                        userAgent: navigator.userAgent,
                    }
                );

                // Mixed Content 오류 특별 처리
                if (
                    error instanceof Error &&
                    (error.message.includes(
                        'Mixed Content'
                    ) ||
                        error.message.includes(
                            'Failed to fetch'
                        ))
                ) {
                    console.error(
                        '🔒 Mixed Content 오류 감지 - HTTPS 백엔드 필요'
                    );
                }

                router.replace(
                    '/login?error=callback_failed'
                );
            }
        };

        processCallback();
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center p-8 bg-white border border-gray-200 rounded-2xl shadow-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-xl text-gray-900 font-medium mb-2">
                    로그인 처리 중입니다...
                </p>
                <p className="text-gray-600">
                    잠시만 기다려주세요.
                </p>
            </div>
        </div>
    );
}
