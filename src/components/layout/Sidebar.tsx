'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { useUIStore } from '@/store/ui';
import {
    Home,
    MessageSquare,
    BookOpen,
    Cpu,
    TrendingUp,
    Users,
    Settings,
    Bookmark,
    Heart,
    Star,
    X,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
    const pathname = usePathname();
    const { sidebarOpen, setSidebarOpen } = useUIStore();

    const navigation = [
        { name: '홈', href: '/', icon: Home },
        {
            name: '리뷰',
            href: '/reviews',
            icon: MessageSquare,
        },
        {
            name: '레시피',
            href: '/recipes',
            icon: BookOpen,
        },
        { name: '모델', href: '/models', icon: Cpu },
        {
            name: '인기',
            href: '/trending',
            icon: TrendingUp,
        },
        { name: '사용자', href: '/users', icon: Users },
    ];

    const userNavigation = [
        {
            name: '북마크',
            href: '/bookmarks',
            icon: Bookmark,
        },
        { name: '좋아요', href: '/likes', icon: Heart },
        {
            name: '내 리뷰',
            href: '/my-reviews',
            icon: MessageSquare,
        },
        {
            name: '내 레시피',
            href: '/my-recipes',
            icon: BookOpen,
        },
        { name: '설정', href: '/settings', icon: Settings },
    ];

    return (
        <>
            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-secondary-200 transform transition-transform duration-300 ease-in-out md:translate-x-0',
                    sidebarOpen
                        ? 'translate-x-0'
                        : '-translate-x-full'
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-secondary-200">
                        <Link
                            href="/"
                            className="flex items-center space-x-2"
                        >
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                    AI
                                </span>
                            </div>
                            <span className="text-lg font-bold text-gradient">
                                AI 모델 비교
                            </span>
                        </Link>
                        <button
                            onClick={() =>
                                setSidebarOpen(false)
                            }
                            className="md:hidden p-1 rounded-lg hover:bg-secondary-100 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4">
                        <div className="px-4 space-y-1">
                            <div className="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-3">
                                탐색
                            </div>
                            {navigation.map((item) => {
                                const isActive =
                                    pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                                            isActive
                                                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                                                : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                                        )}
                                        onClick={() =>
                                            setSidebarOpen(
                                                false
                                            )
                                        }
                                    >
                                        <item.icon className="h-5 w-5 mr-3" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="px-4 space-y-1 mt-8">
                            <div className="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-3">
                                내 활동
                            </div>
                            {userNavigation.map((item) => {
                                const isActive =
                                    pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                                            isActive
                                                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                                                : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                                        )}
                                        onClick={() =>
                                            setSidebarOpen(
                                                false
                                            )
                                        }
                                    >
                                        <item.icon className="h-5 w-5 mr-3" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-secondary-200">
                        <div className="text-xs text-secondary-500 text-center">
                            © 2024 AI 모델 비교 플랫폼
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
