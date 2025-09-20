'use client';

import { useCallback, useEffect } from 'react';
import { getUserManager } from '@/lib/oidc-client';
import Image from 'next/image';

export default function LoginPage() {
    const mgr = getUserManager();

    // 페이지 로드 시 환경 감지 로그 출력
    useEffect(() => {
        console.log('로그인 페이지가 로드되었습니다.');
        // getUserManager 호출로 OIDC 설정이 초기화되고 환경 감지 로그가 출력됩니다.
    }, []);

    const handleLogin = useCallback(() => {
        mgr.signinRedirect();
    }, [mgr]);

    return (
        <div
            className="flex items-center justify-center"
            style={{ minHeight: 'calc(100vh - 200px)' }}
        >
            <div className="w-full max-w-md p-10 space-y-8 bg-white border border-gray-200 rounded-2xl shadow-lg text-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        AQ
                    </h1>
                    <p className="text-gray-600">
                        카카오 계정으로 간편하게
                        로그인하세요
                    </p>
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full transition-transform transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-yellow-200 rounded-xl"
                    style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                    }}
                >
                    <Image
                        src="/kakao_login_medium_narrow.png"
                        alt="카카오 로그인"
                        width={183}
                        height={45}
                        priority
                        className="mx-auto rounded-lg"
                    />
                </button>

                <p className="text-sm text-gray-500">
                    로그인하면 서비스 이용약관 및
                    개인정보처리방침에 동의하게 됩니다.
                </p>
            </div>
        </div>
    );
}
