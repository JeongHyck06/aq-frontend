'use client';

import { useState } from 'react';
import Link from 'next/link';

interface UserData {
    email: string;
    nickname: string;
    [key: string]: unknown;
}

export default function HomePage() {
    const [me, setMe] = useState<UserData | null>(null);
    const [err, setErr] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchMe = async () => {
        setIsLoading(true);
        setErr(null);

        try {
            const token = typeof window !== 'undefined' 
                ? localStorage.getItem('accessToken')
                : null;
            if (!token) {
                setErr(
                    '로그인 토큰이 없습니다. 먼저 로그인해주세요.'
                );
                setIsLoading(false);
                return;
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(
                    `서버 오류: ${res.status} - ${errorText}`
                );
            }

            const body = await res.json();
            setMe(body);
        } catch (e: unknown) {
            setErr(
                e instanceof Error
                    ? e.message
                    : '알 수 없는 오류가 발생했습니다.'
            );
            setMe(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-200px)]">
            <div className="w-full max-w-lg p-8 space-y-8 bg-white border border-gray-200 rounded-2xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        환영합니다
                    </h1>
                    <p className="text-gray-600">
                        AQ에서 다양한 서비스를 이용해보세요
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={fetchMe}
                        disabled={isLoading}
                        className="w-full px-6 py-3 font-medium text-white bg-blue-500 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all disabled:bg-gray-400"
                    >
                        {isLoading
                            ? '로딩 중...'
                            : '내 정보 가져오기'}
                    </button>

                    <Link
                        href="/login"
                        className="w-full px-6 py-3 font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all text-center"
                    >
                        로그인하기
                    </Link>
                </div>

                {err && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-600 text-center text-sm">
                            {err}
                        </p>
                    </div>
                )}

                {me && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                            내 정보
                        </h2>

                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                            <pre className="text-gray-700 text-left text-sm overflow-x-auto">
                                {JSON.stringify(
                                    me,
                                    null,
                                    2
                                )}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
