import React from 'react';
import Link from 'next/link';
import {
    Github,
    Twitter,
    Mail,
    Heart,
    ExternalLink,
} from 'lucide-react';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { name: '리뷰', href: '/reviews' },
            { name: '레시피', href: '/recipes' },
            { name: '모델', href: '/models' },
            { name: '가격 비교', href: '/pricing' },
        ],
        community: [
            { name: '이벤트', href: '/events' },
            { name: '블로그', href: '/blog' },
            { name: '포럼', href: '/forum' },
            { name: '뉴스레터', href: '/newsletter' },
        ],
        support: [
            { name: '도움말', href: '/help' },
            { name: '문의하기', href: '/contact' },
            { name: '상태', href: '/status' },
            { name: 'API 문서', href: '/docs' },
        ],
        legal: [
            { name: '개인정보처리방침', href: '/privacy' },
            { name: '이용약관', href: '/terms' },
            { name: '쿠키 정책', href: '/cookies' },
            { name: '라이선스', href: '/license' },
        ],
    };

    const socialLinks = [
        {
            name: 'GitHub',
            href: 'https://github.com',
            icon: Github,
        },
        {
            name: 'Twitter',
            href: 'https://twitter.com',
            icon: Twitter,
        },
        {
            name: 'Email',
            href: 'mailto:contact@example.com',
            icon: Mail,
        },
    ];

    return (
        <footer className="bg-gray-50 border-t border-gray-200">
            <div className="container py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link
                            href="/"
                            className="flex items-center space-x-3 mb-6 group"
                        >
                            <div className="h-10 w-10 rounded-2xl gradient-primary flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                <span className="text-white font-bold text-lg">
                                    AI
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-gradient">
                                    AI 모델 비교
                                </span>
                                <span className="text-xs text-gray-500 -mt-1">
                                    AI Model Comparison
                                </span>
                            </div>
                        </Link>
                        <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
                            AI 모델 리뷰, 프롬프트 레시피
                            공유, 모델 비교 기능을 제공하는
                            <span className="font-semibold text-purple-600">
                                {' '}
                                커뮤니티 플랫폼
                            </span>
                            입니다.
                        </p>
                        <div className="flex space-x-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-2xl bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                                >
                                    <social.icon className="h-5 w-5 text-gray-600 hover:text-purple-600 transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="text-base font-bold text-gray-900 mb-6">
                            제품
                        </h3>
                        <ul className="space-y-4">
                            {footerLinks.product.map(
                                (link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-600 hover:text-purple-600 transition-colors duration-200 hover:translate-x-1 inline-block"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    {/* Community */}
                    <div>
                        <h3 className="text-base font-bold text-gray-900 mb-6">
                            커뮤니티
                        </h3>
                        <ul className="space-y-4">
                            {footerLinks.community.map(
                                (link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-600 hover:text-purple-600 transition-colors duration-200 hover:translate-x-1 inline-block"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-base font-bold text-gray-900 mb-6">
                            지원
                        </h3>
                        <ul className="space-y-4">
                            {footerLinks.support.map(
                                (link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-600 hover:text-purple-600 transition-colors duration-200 hover:translate-x-1 inline-block"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-base font-bold text-gray-900 mb-6">
                            법적 고지
                        </h3>
                        <ul className="space-y-4">
                            {footerLinks.legal.map(
                                (link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-600 hover:text-purple-600 transition-colors duration-200 hover:translate-x-1 inline-block"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-16 pt-8 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-600">
                            <span className="flex items-center">
                                © {currentYear} AI 모델 비교
                                플랫폼. All rights reserved.
                            </span>
                            <span className="hidden md:inline text-gray-400">
                                •
                            </span>
                            <span className="flex items-center">
                                Made with{' '}
                                <Heart className="h-4 w-4 mx-1 text-red-500 animate-pulse" />{' '}
                                in Korea
                            </span>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200 hover:scale-105"
                            >
                                <Github className="h-4 w-4" />
                                <span>GitHub</span>
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
