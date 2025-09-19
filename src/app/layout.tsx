'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

interface UserInfo {
    email: string;
    nickname: string;
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [userInfo, setUserInfo] =
        useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMyInfo = async () => {
            const accessToken =
                localStorage.getItem('accessToken');
            if (!accessToken) {
                setIsLoading(false);
                return;
            }

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (res.ok) {
                    const data = await res.json();
                    setUserInfo(data);
                } else {
                    setUserInfo(null);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
            } catch (error) {
                console.error('내 정보 조회 실패:', error);
                setUserInfo(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyInfo();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUserInfo(null);
        window.location.href = '/';
    };

    return (
        <html lang="ko">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 min-h-screen`}
            >
                <header className="bg-white border-b border-gray-200 shadow-sm">
                    <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                        <Link
                            href="/"
                            className="text-2xl font-bold text-blue-600 hover:text-blue-700"
                        >
                            AQ
                        </Link>

                        <div>
                            {isLoading ? (
                                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                            ) : userInfo ? (
                                <div className="flex items-center space-x-4">
                                    <span className="font-medium text-gray-700">
                                        👋{' '}
                                        {userInfo.nickname}
                                        님
                                    </span>
                                    <button
                                        onClick={
                                            handleLogout
                                        }
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                                    >
                                        로그아웃
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                                >
                                    로그인
                                </Link>
                            )}
                        </div>
                    </nav>
                </header>

                <main className="container mx-auto px-6 py-8">
                    {children}
                </main>
            </body>
        </html>
    );
}
