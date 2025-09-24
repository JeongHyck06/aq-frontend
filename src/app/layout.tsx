import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'AI 모델 비교 및 프롬프트 공유 플랫폼',
    description:
        'AI 모델 리뷰, 프롬프트 레시피 공유, 모델 비교 기능을 제공하는 플랫폼',
    keywords: [
        'AI',
        '모델',
        '프롬프트',
        '리뷰',
        '비교',
        '공유',
    ],
    authors: [{ name: 'SKHU AQ Project Team' }],
    creator: 'SKHU AQ Project Team',
    publisher: 'SKHU AQ Project',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_APP_URL ||
            'http://localhost:3000'
    ),
    openGraph: {
        type: 'website',
        locale: 'ko_KR',
        url: '/',
        title: 'AI 모델 비교 및 프롬프트 공유 플랫폼',
        description:
            'AI 모델 리뷰, 프롬프트 레시피 공유, 모델 비교 기능을 제공하는 플랫폼',
        siteName: 'AI 모델 비교 플랫폼',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AI 모델 비교 및 프롬프트 공유 플랫폼',
        description:
            'AI 모델 리뷰, 프롬프트 레시피 공유, 모델 비교 기능을 제공하는 플랫폼',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'your-google-verification-code',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko" suppressHydrationWarning>
            <body className={inter.className}>
                <Providers>
                    {children}
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#fff',
                                color: '#374151',
                                boxShadow:
                                    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                borderRadius: '0.5rem',
                                border: '1px solid #e5e7eb',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#10b981',
                                    secondary: '#fff',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />
                </Providers>
            </body>
        </html>
    );
}
