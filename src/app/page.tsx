'use client';

import React, {
    useEffect,
    useState,
    useCallback,
} from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import {
    FadeIn,
    StaggerContainer,
} from '@/components/animations';
import {
    ContentGrid,
    StatsCard,
    ContentTabs,
} from '@/components/content';
import { useContentStore } from '@/store/content';
import { useAuthStore } from '@/store/auth';
import { MessageSquare, BookOpen } from 'lucide-react';
import { formatNumber } from '@/utils/format';
import Link from 'next/link';

export default function HomePage() {
    const {
        reviews,
        recipes,
        models,
        fetchReviews,
        fetchRecipes,
        fetchModels,
        reviewsLoading,
        recipesLoading,
        modelsLoading,
    } = useContentStore();

    const { isAuthenticated } = useAuthStore();
    const [activeTab, setActiveTab] = useState<
        'reviews' | 'recipes' | 'models'
    >('reviews');

    const loadData = useCallback(async () => {
        try {
            await Promise.all([
                fetchReviews({
                    size: 6,
                    sort: 'createdAt,desc',
                }),
                fetchRecipes({
                    size: 6,
                    sort: 'createdAt,desc',
                }),
                fetchModels({ size: 6 }),
            ]);
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    }, [fetchReviews, fetchRecipes, fetchModels]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleTabChange = useCallback(
        (tab: 'reviews' | 'recipes' | 'models') => {
            setActiveTab(tab);
        },
        []
    );

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-animated opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50"></div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-float"></div>
                <div
                    className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-float"
                    style={{ animationDelay: '2s' }}
                ></div>
                <div
                    className="absolute bottom-40 left-20 w-24 h-24 bg-cyan-200 rounded-full opacity-20 animate-float"
                    style={{ animationDelay: '4s' }}
                ></div>

                <div className="container relative z-10">
                    <FadeIn direction="up" delay={0.2}>
                        <div className="text-center max-w-5xl mx-auto">
                            {/* Badge */}
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 mb-8 shadow-lg">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                <span className="text-sm font-medium text-gray-700">
                                    실시간 AI 모델 비교
                                    플랫폼
                                </span>
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                                <span className="text-gradient block">
                                    AI 모델
                                </span>
                                <span className="text-gray-900 block">
                                    비교 & 공유
                                </span>
                            </h1>

                            {/* Subtitle */}
                            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                                다양한 AI 모델의{' '}
                                <span className="font-semibold text-purple-600">
                                    실제 성능
                                </span>
                                을 확인하고,
                                <span className="font-semibold text-blue-600">
                                    프롬프트 레시피
                                </span>
                                를 공유하며, 당신에게 최적의
                                AI 모델을 찾아보세요.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                                <Link href="/reviews">
                                    <Button
                                        size="lg"
                                        className="btn-modern btn-primary px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                                    >
                                        <MessageSquare className="h-6 w-6 mr-3" />
                                        리뷰 둘러보기
                                    </Button>
                                </Link>
                                <Link href="/recipes">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="btn-modern btn-secondary px-8 py-4 text-lg font-semibold border-2 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300"
                                    >
                                        <BookOpen className="h-6 w-6 mr-3" />
                                        레시피 탐색
                                    </Button>
                                </Link>
                            </div>

                            {/* Stats Preview */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                                <div className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                                        1,234+
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        AI 모델 리뷰
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                                        567+
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        프롬프트 레시피
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                                        89+
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        AI 모델
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                                        2,345+
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        활성 사용자
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="container">
                    <FadeIn direction="up" delay={0.3}>
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                왜 우리 플랫폼을 선택해야
                                할까요?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                실제 사용자들의 경험을
                                바탕으로 한 신뢰할 수 있는
                                AI 모델 비교 정보를
                                제공합니다.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FadeIn direction="up" delay={0.4}>
                            <div className="card-modern p-8 text-center group hover:shadow-2xl transition-all duration-300">
                                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <MessageSquare className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    실제 사용자 리뷰
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    실제 프로젝트에서 사용한
                                    경험을 바탕으로 한
                                    상세한 AI 모델 리뷰를
                                    확인하세요.
                                </p>
                            </div>
                        </FadeIn>

                        <FadeIn direction="up" delay={0.5}>
                            <div className="card-modern p-8 text-center group hover:shadow-2xl transition-all duration-300">
                                <div className="w-16 h-16 gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <BookOpen className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    프롬프트 레시피
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    검증된 프롬프트 레시피를
                                    공유하고, 다른
                                    사용자들의 창의적인
                                    아이디어를 발견하세요.
                                </p>
                            </div>
                        </FadeIn>

                        <FadeIn direction="up" delay={0.6}>
                            <div className="card-modern p-8 text-center group hover:shadow-2xl transition-all duration-300">
                                <div className="w-16 h-16 gradient-success rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg
                                        className="h-8 w-8 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    성능 비교
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    다양한 AI 모델의 성능을
                                    객관적인 지표로
                                    비교하고, 최적의 선택을
                                    도와드립니다.
                                </p>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Content Showcase Section */}
            <section className="py-24 bg-gray-50">
                <div className="container">
                    <FadeIn direction="up" delay={0.7}>
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                최신 콘텐츠 둘러보기
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                커뮤니티에서 가장 인기 있는
                                리뷰, 레시피, 모델을
                                확인해보세요.
                            </p>
                        </div>
                    </FadeIn>

                    {/* Modern Tab Navigation */}
                    <div className="flex justify-center mb-12">
                        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
                            {[
                                {
                                    id: 'reviews',
                                    label: '리뷰',
                                    icon: MessageSquare,
                                },
                                {
                                    id: 'recipes',
                                    label: '레시피',
                                    icon: BookOpen,
                                },
                                {
                                    id: 'models',
                                    label: '모델',
                                    icon: '📊',
                                },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() =>
                                        handleTabChange(
                                            tab.id as any
                                        )
                                    }
                                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                                        activeTab === tab.id
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                >
                                    {typeof tab.icon ===
                                    'string' ? (
                                        <span className="text-lg">
                                            {tab.icon}
                                        </span>
                                    ) : (
                                        <tab.icon className="h-5 w-5" />
                                    )}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <ContentGrid
                        reviews={reviews}
                        recipes={recipes}
                        models={models}
                        reviewsLoading={reviewsLoading}
                        recipesLoading={recipesLoading}
                        modelsLoading={modelsLoading}
                        type={activeTab}
                        limit={6}
                    />
                </div>
            </section>

            {/* CTA Section */}
            {!isAuthenticated && (
                <section className="py-24 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 relative overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-0 left-0 w-full h-full">
                        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/5 rounded-full blur-2xl"></div>
                    </div>

                    <div className="container relative z-10">
                        <FadeIn direction="up" delay={0.8}>
                            <div className="text-center max-w-4xl mx-auto">
                                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
                                    지금 시작해보세요
                                </h2>
                                <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
                                    AI 모델 리뷰를 작성하고,
                                    프롬프트 레시피를
                                    공유하며,
                                    <br />
                                    <span className="font-semibold">
                                        전 세계 AI 커뮤니티
                                    </span>
                                    에 참여해보세요.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                                    <Link href="/register">
                                        <Button
                                            size="lg"
                                            className="btn-modern bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                                        >
                                            무료로 시작하기
                                        </Button>
                                    </Link>
                                    <Link href="/login">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="btn-modern border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold transition-all duration-300"
                                        >
                                            로그인
                                        </Button>
                                    </Link>
                                </div>

                                {/* Trust Indicators */}
                                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-white/80">
                                    <div className="flex items-center space-x-2">
                                        <svg
                                            className="h-5 w-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span>
                                            무료 회원가입
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <svg
                                            className="h-5 w-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span>
                                            즉시 사용 가능
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <svg
                                            className="h-5 w-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span>
                                            커뮤니티 참여
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </section>
            )}
        </Layout>
    );
}
