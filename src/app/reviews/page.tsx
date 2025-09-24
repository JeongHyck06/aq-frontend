'use client';

import { useState, useEffect } from 'react';
import { Review } from '@/types';
import { useReviewsStore } from '@/store/reviews';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FadeIn } from '@/components/animations/FadeIn';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Search,
    Plus,
    Star,
    Eye,
    Heart,
    MessageCircle,
    Bookmark,
    Filter,
} from 'lucide-react';

type SortOption =
    | 'newest'
    | 'oldest'
    | 'popular'
    | 'rating';

export default function ReviewsPage() {
    const router = useRouter();
    const {
        reviews,
        loading,
        pagination,
        filters,
        fetchReviews,
        setFilters,
        likeReview,
        bookmarkReview,
    } = useReviewsStore();

    const [searchKeyword, setSearchKeyword] = useState(
        filters.searchKeyword
    );

    const sortOptions = [
        { value: 'newest', label: '최신순' },
        { value: 'oldest', label: '오래된순' },
        { value: 'popular', label: '인기순' },
        { value: 'rating', label: '평점순' },
    ];

    useEffect(() => {
        fetchReviews(0, {
            searchKeyword,
            sortBy: filters.sortBy,
        });
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters({ searchKeyword });
        fetchReviews(0, {
            searchKeyword,
            sortBy: filters.sortBy,
        });
    };

    const handleSortChange = (value: string) => {
        setFilters({ sortBy: value as SortOption });
        fetchReviews(0, {
            searchKeyword,
            sortBy: value as SortOption,
        });
    };

    const handlePageChange = (page: number) => {
        fetchReviews(page, {
            searchKeyword,
            sortBy: filters.sortBy,
        });
    };

    const handleLike = async (reviewId: number) => {
        await likeReview(reviewId);
    };

    const handleBookmark = async (reviewId: number) => {
        await bookmarkReview(reviewId);
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${
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
                month: 'short',
                day: 'numeric',
            }
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <FadeIn>
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    AI 모델 리뷰
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    다양한 AI 모델에 대한
                                    실제 사용자 리뷰를
                                    확인해보세요
                                </p>
                            </div>
                            <Button
                                onClick={() =>
                                    router.push(
                                        '/reviews/create'
                                    )
                                }
                                className="flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                리뷰 작성
                            </Button>
                        </div>

                        {/* Search and Filter */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <form
                                onSubmit={handleSearch}
                                className="flex-1"
                            >
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        type="text"
                                        placeholder="리뷰 검색..."
                                        value={
                                            searchKeyword
                                        }
                                        onChange={(e) =>
                                            setSearchKeyword(
                                                e.target
                                                    .value
                                            )
                                        }
                                        className="pl-10"
                                    />
                                </div>
                            </form>
                            <div className="flex gap-2">
                                <Select
                                    value={filters.sortBy}
                                    onChange={
                                        handleSortChange
                                    }
                                    options={sortOptions}
                                    className="w-32 [&>div>button]:py-1.5 [&>div>button]:text-sm"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                >
                                    <Filter className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* Results Info */}
                <div className="mb-6">
                    <p className="text-sm text-gray-600">
                        총{' '}
                        {pagination.totalElements.toLocaleString()}
                        개의 리뷰
                    </p>
                </div>

                {/* Reviews Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <MessageCircle className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            리뷰가 없습니다
                        </h3>
                        <p className="text-gray-600 mb-6">
                            첫 번째 리뷰를 작성해보세요!
                        </p>
                        <Button
                            onClick={() =>
                                router.push(
                                    '/reviews/create'
                                )
                            }
                        >
                            리뷰 작성하기
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((review, index) => (
                            <FadeIn
                                key={review.id}
                                delay={index * 100}
                            >
                                <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <Link
                                                href={`/reviews/${review.id}`}
                                                className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                                            >
                                                {
                                                    review.title
                                                }
                                            </Link>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-sm text-gray-500">
                                                    {
                                                        review.modelName
                                                    }
                                                </span>
                                                <span className="text-gray-300">
                                                    •
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {
                                                        review.modelProvider
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {renderStars(
                                                review.rating
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                        {review.content}
                                    </p>

                                    {review.tags &&
                                        review.tags.length >
                                            0 && (
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {review.tags
                                                    .slice(
                                                        0,
                                                        3
                                                    )
                                                    .map(
                                                        (
                                                            tag
                                                        ) => (
                                                            <Badge
                                                                key={
                                                                    tag
                                                                }
                                                                variant="secondary"
                                                                className="text-xs"
                                                            >
                                                                {
                                                                    tag
                                                                }
                                                            </Badge>
                                                        )
                                                    )}
                                                {review.tags
                                                    .length >
                                                    3 && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        +
                                                        {review
                                                            .tags
                                                            .length -
                                                            3}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}

                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                {
                                                    review.viewCount
                                                }
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Heart className="w-4 h-4" />
                                                {
                                                    review.likeCount
                                                }
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageCircle className="w-4 h-4" />
                                                {
                                                    review.commentCount
                                                }
                                            </div>
                                        </div>
                                        <span>
                                            {formatDate(
                                                review.createdAt
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                <span className="text-xs font-medium text-gray-600">
                                                    {review.authorNickname.charAt(
                                                        0
                                                    )}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-600">
                                                {
                                                    review.authorNickname
                                                }
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleBookmark(
                                                    review.id
                                                )
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
                                    </div>
                                </Card>
                            </FadeIn>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    handlePageChange(
                                        pagination.currentPage -
                                            1
                                    )
                                }
                                disabled={
                                    pagination.currentPage ===
                                    0
                                }
                            >
                                이전
                            </Button>

                            {Array.from(
                                {
                                    length: Math.min(
                                        5,
                                        pagination.totalPages
                                    ),
                                },
                                (_, i) => {
                                    const pageNum =
                                        Math.max(
                                            0,
                                            Math.min(
                                                pagination.totalPages -
                                                    5,
                                                pagination.currentPage -
                                                    2
                                            )
                                        ) + i;
                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={
                                                pageNum ===
                                                pagination.currentPage
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            onClick={() =>
                                                handlePageChange(
                                                    pageNum
                                                )
                                            }
                                        >
                                            {pageNum + 1}
                                        </Button>
                                    );
                                }
                            )}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    handlePageChange(
                                        pagination.currentPage +
                                            1
                                    )
                                }
                                disabled={
                                    pagination.currentPage >=
                                    pagination.totalPages -
                                        1
                                }
                            >
                                다음
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
