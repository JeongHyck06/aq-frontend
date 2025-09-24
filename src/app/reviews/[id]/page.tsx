'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Review } from '@/types';
import { useReviewsStore } from '@/store/reviews';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FadeIn } from '@/components/animations/FadeIn';
import {
    Star,
    Eye,
    Heart,
    MessageCircle,
    Bookmark,
    Share2,
    Edit,
    Trash2,
    ArrowLeft,
    User,
    Calendar,
    Tag,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ReviewDetailPage() {
    const router = useRouter();
    const params = useParams();
    const reviewId = params.id as string;

    const {
        currentReview: review,
        loading,
        fetchReview,
        deleteReview,
        likeReview,
        bookmarkReview,
    } = useReviewsStore();

    useEffect(() => {
        if (reviewId) {
            fetchReview(parseInt(reviewId));
        }
    }, [reviewId]);

    const handleLike = async () => {
        if (review) {
            await likeReview(review.id);
        }
    };

    const handleBookmark = async () => {
        if (review) {
            await bookmarkReview(review.id);
        }
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(
                window.location.href
            );
            toast.success(
                '링크가 클립보드에 복사되었습니다'
            );
        } catch (error) {
            console.error('링크 복사 실패:', error);
            toast.error('링크 복사에 실패했습니다');
        }
    };

    const handleEdit = () => {
        router.push(`/reviews/${reviewId}/edit`);
    };

    const handleDelete = async () => {
        if (
            !confirm('정말로 이 리뷰를 삭제하시겠습니까?')
        ) {
            return;
        }

        const success = await deleteReview(
            parseInt(reviewId)
        );
        if (success) {
            router.push('/reviews');
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-5 h-5 ${
                    i < rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                }`}
            />
        ));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(
            'ko-KR',
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!review) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        리뷰를 찾을 수 없습니다
                    </h2>
                    <Button
                        onClick={() =>
                            router.push('/reviews')
                        }
                    >
                        리뷰 목록으로 돌아가기
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <FadeIn>
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-6">
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    router.back()
                                }
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                뒤로가기
                            </Button>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {review.title}
                                </h1>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                    <span>
                                        {review.modelName}
                                    </span>
                                    <span className="text-gray-300">
                                        •
                                    </span>
                                    <span>
                                        {
                                            review.modelProvider
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Review Content */}
                            <Card className="p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                            <span className="text-lg font-medium text-gray-600">
                                                {review.authorNickname.charAt(
                                                    0
                                                )}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {
                                                    review.authorNickname
                                                }
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(
                                                    review.createdAt
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={
                                                handleLike
                                            }
                                            className={
                                                review.isLiked
                                                    ? 'text-red-500'
                                                    : 'text-gray-500'
                                            }
                                        >
                                            <Heart
                                                className={`w-4 h-4 ${
                                                    review.isLiked
                                                        ? 'fill-current'
                                                        : ''
                                                }`}
                                            />
                                            {
                                                review.likeCount
                                            }
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={
                                                handleBookmark
                                            }
                                            className={
                                                review.isBookmarked
                                                    ? 'text-blue-500'
                                                    : 'text-gray-500'
                                            }
                                        >
                                            <Bookmark
                                                className={`w-4 h-4 ${
                                                    review.isBookmarked
                                                        ? 'fill-current'
                                                        : ''
                                                }`}
                                            />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={
                                                handleShare
                                            }
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-6">
                                    {renderStars(
                                        review.rating
                                    )}
                                    <span className="text-lg font-medium text-gray-900">
                                        {review.rating}/5
                                    </span>
                                </div>

                                <div className="prose max-w-none">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {review.content}
                                    </p>
                                </div>

                                {review.tags &&
                                    review.tags.length >
                                        0 && (
                                        <div className="mt-6 pt-6 border-t">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Tag className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm font-medium text-gray-700">
                                                    태그
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {review.tags.map(
                                                    (
                                                        tag
                                                    ) => (
                                                        <Badge
                                                            key={
                                                                tag
                                                            }
                                                            variant="secondary"
                                                        >
                                                            {
                                                                tag
                                                            }
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </Card>

                            {/* Use Case */}
                            {review.useCase && (
                                <Card className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        사용 사례
                                    </h3>
                                    <p className="text-gray-700">
                                        {review.useCase}
                                    </p>
                                </Card>
                            )}

                            {/* Examples */}
                            {(review.inputExample ||
                                review.outputExample) && (
                                <Card className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        사용 예시
                                    </h3>
                                    <div className="space-y-4">
                                        {review.inputExample && (
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                    입력
                                                    예시
                                                </h4>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                                                        {
                                                            review.inputExample
                                                        }
                                                    </pre>
                                                </div>
                                            </div>
                                        )}
                                        {review.outputExample && (
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                    출력
                                                    예시
                                                </h4>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                                                        {
                                                            review.outputExample
                                                        }
                                                    </pre>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            )}

                            {/* Comments Section */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    댓글 (
                                    {review.commentCount})
                                </h3>
                                <div className="text-center py-8 text-gray-500">
                                    댓글 기능은 준비
                                    중입니다
                                </div>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Stats */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    통계
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Eye className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-600">
                                                조회수
                                            </span>
                                        </div>
                                        <span className="font-medium">
                                            {
                                                review.viewCount
                                            }
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Heart className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-600">
                                                좋아요
                                            </span>
                                        </div>
                                        <span className="font-medium">
                                            {
                                                review.likeCount
                                            }
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <MessageCircle className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-600">
                                                댓글
                                            </span>
                                        </div>
                                        <span className="font-medium">
                                            {
                                                review.commentCount
                                            }
                                        </span>
                                    </div>
                                </div>
                            </Card>

                            {/* Model Info */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    모델 정보
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-gray-600">
                                            모델명
                                        </span>
                                        <p className="font-medium">
                                            {
                                                review.modelName
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">
                                            제공업체
                                        </span>
                                        <p className="font-medium">
                                            {
                                                review.modelProvider
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">
                                            평점
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {renderStars(
                                                review.rating
                                            )}
                                            <span className="text-sm text-gray-600">
                                                {
                                                    review.rating
                                                }
                                                /5
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link
                                        href={`/models/${review.modelId}`}
                                    >
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                        >
                                            모델 상세보기
                                        </Button>
                                    </Link>
                                </div>
                            </Card>

                            {/* Actions */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    액션
                                </h3>
                                <div className="space-y-2">
                                    <Button
                                        onClick={handleLike}
                                        variant={
                                            review.isLiked
                                                ? 'default'
                                                : 'outline'
                                        }
                                        className="w-full flex items-center gap-2"
                                    >
                                        <Heart
                                            className={`w-4 h-4 ${
                                                review.isLiked
                                                    ? 'fill-current'
                                                    : ''
                                            }`}
                                        />
                                        {review.isLiked
                                            ? '좋아요 취소'
                                            : '좋아요'}
                                    </Button>
                                    <Button
                                        onClick={
                                            handleBookmark
                                        }
                                        variant={
                                            review.isBookmarked
                                                ? 'default'
                                                : 'outline'
                                        }
                                        className="w-full flex items-center gap-2"
                                    >
                                        <Bookmark
                                            className={`w-4 h-4 ${
                                                review.isBookmarked
                                                    ? 'fill-current'
                                                    : ''
                                            }`}
                                        />
                                        {review.isBookmarked
                                            ? '북마크 해제'
                                            : '북마크'}
                                    </Button>
                                    <Button
                                        onClick={
                                            handleShare
                                        }
                                        variant="outline"
                                        className="w-full flex items-center gap-2"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        공유하기
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
