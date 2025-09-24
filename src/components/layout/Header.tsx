'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';
import {
    Search,
    Menu,
    X,
    User,
    Settings,
    LogOut,
    Plus,
    Bookmark,
    Heart,
    MessageSquare,
} from 'lucide-react';

export const Header: React.FC = () => {
    const router = useRouter();
    const { user, isAuthenticated, logout } =
        useAuthStore();
    const { sidebarOpen, setSidebarOpen } = useUIStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(
                `/search?q=${encodeURIComponent(
                    searchQuery.trim()
                )}`
            );
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/');
        setUserMenuOpen(false);
    };

    const navigation = [
        { name: '홈', href: '/' },
        { name: '리뷰', href: '/reviews' },
        { name: '레시피', href: '/recipes' },
        { name: '모델', href: '/models' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 shadow-sm">
            <div className="container">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="flex items-center space-x-3 group"
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
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 relative group"
                            >
                                {item.name}
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Search Bar */}
                    <div className="hidden lg:flex flex-1 max-w-lg mx-8">
                        <form
                            onSubmit={handleSearch}
                            className="w-full"
                        >
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="리뷰, 레시피, 모델 검색..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(
                                            e.target.value
                                        )
                                    }
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-200 placeholder-gray-400"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-lg">
                                        ⌘K
                                    </kbd>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                {/* Create Button */}
                                <Button
                                    onClick={() =>
                                        router.push(
                                            '/create'
                                        )
                                    }
                                    className="hidden sm:flex items-center space-x-2 btn-modern btn-primary px-6 py-2.5"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>작성하기</span>
                                </Button>

                                {/* User Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            setUserMenuOpen(
                                                !userMenuOpen
                                            )
                                        }
                                        className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-gray-50 transition-all duration-200 group"
                                    >
                                        <div className="relative">
                                            <Avatar
                                                src={
                                                    user?.profileImage
                                                }
                                                fallback={
                                                    user?.nickname
                                                }
                                                size="sm"
                                            />
                                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                        </div>
                                        <div className="hidden sm:block text-left">
                                            <span className="text-sm font-medium text-gray-900 block">
                                                {
                                                    user?.nickname
                                                }
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                온라인
                                            </span>
                                        </div>
                                    </button>

                                    {/* User Dropdown */}
                                    {userMenuOpen && (
                                        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-in slide-down duration-200">
                                            {/* User Info */}
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <div className="flex items-center space-x-3">
                                                    <Avatar
                                                        src={
                                                            user?.profileImage
                                                        }
                                                        fallback={
                                                            user?.nickname
                                                        }
                                                        size="md"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {
                                                                user?.nickname
                                                            }
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {
                                                                user?.email
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-2">
                                                <Link
                                                    href={`/profile/${user?.id}`}
                                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() =>
                                                        setUserMenuOpen(
                                                            false
                                                        )
                                                    }
                                                >
                                                    <User className="h-5 w-5 mr-3 text-gray-400" />
                                                    프로필
                                                </Link>
                                                <Link
                                                    href="/bookmarks"
                                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() =>
                                                        setUserMenuOpen(
                                                            false
                                                        )
                                                    }
                                                >
                                                    <Bookmark className="h-5 w-5 mr-3 text-gray-400" />
                                                    북마크
                                                </Link>
                                                <Link
                                                    href="/settings"
                                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() =>
                                                        setUserMenuOpen(
                                                            false
                                                        )
                                                    }
                                                >
                                                    <Settings className="h-5 w-5 mr-3 text-gray-400" />
                                                    설정
                                                </Link>
                                            </div>

                                            {/* Logout */}
                                            <div className="border-t border-gray-100 pt-2">
                                                <button
                                                    onClick={
                                                        handleLogout
                                                    }
                                                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut className="h-5 w-5 mr-3" />
                                                    로그아웃
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        router.push(
                                            '/login'
                                        )
                                    }
                                    className="btn-modern btn-ghost px-6 py-2.5"
                                >
                                    로그인
                                </Button>
                                <Button
                                    onClick={() =>
                                        router.push(
                                            '/register'
                                        )
                                    }
                                    className="btn-modern btn-primary px-6 py-2.5"
                                >
                                    회원가입
                                </Button>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() =>
                                setSidebarOpen(!sidebarOpen)
                            }
                            className="md:hidden p-3 rounded-2xl hover:bg-gray-100 transition-all duration-200 group"
                        >
                            <div className="relative w-6 h-6">
                                <span
                                    className={`absolute top-1 left-0 w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
                                        sidebarOpen
                                            ? 'rotate-45 translate-y-2'
                                            : ''
                                    }`}
                                ></span>
                                <span
                                    className={`absolute top-3 left-0 w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
                                        sidebarOpen
                                            ? 'opacity-0'
                                            : ''
                                    }`}
                                ></span>
                                <span
                                    className={`absolute top-5 left-0 w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
                                        sidebarOpen
                                            ? '-rotate-45 -translate-y-2'
                                            : ''
                                    }`}
                                ></span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Search */}
            <div className="lg:hidden border-t border-gray-200/50 px-4 py-4 bg-gray-50/50">
                <form onSubmit={handleSearch}>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="리뷰, 레시피, 모델 검색..."
                            value={searchQuery}
                            onChange={(e) =>
                                setSearchQuery(
                                    e.target.value
                                )
                            }
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 shadow-sm"
                        />
                    </div>
                </form>
            </div>
        </header>
    );
};
