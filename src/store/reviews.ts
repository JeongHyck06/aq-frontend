import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
    Review,
    PaginatedResponse,
    CreateReviewRequest,
    UpdateReviewRequest,
} from '@/types';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

interface ReviewsState {
    // State
    reviews: Review[];
    currentReview: Review | null;
    loading: boolean;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalElements: number;
        pageSize: number;
    };
    filters: {
        searchKeyword: string;
        sortBy: 'newest' | 'oldest' | 'popular' | 'rating';
        modelId?: number;
        userId?: number;
    };

    // Actions
    setLoading: (loading: boolean) => void;
    setReviews: (reviews: Review[]) => void;
    setCurrentReview: (review: Review | null) => void;
    setPagination: (
        pagination: Partial<ReviewsState['pagination']>
    ) => void;
    setFilters: (
        filters: Partial<ReviewsState['filters']>
    ) => void;

    // API Actions
    fetchReviews: (
        page?: number,
        filters?: Partial<ReviewsState['filters']>
    ) => Promise<void>;
    fetchReview: (reviewId: number) => Promise<void>;
    createReview: (
        reviewData: CreateReviewRequest
    ) => Promise<Review | null>;
    updateReview: (
        reviewId: number,
        reviewData: UpdateReviewRequest
    ) => Promise<Review | null>;
    deleteReview: (reviewId: number) => Promise<boolean>;
    searchReviews: (
        keyword: string,
        page?: number
    ) => Promise<void>;
    getReviewsByModel: (
        modelId: number,
        page?: number
    ) => Promise<void>;
    getReviewsByUser: (
        userId: number,
        page?: number
    ) => Promise<void>;
    getPopularReviews: (page?: number) => Promise<void>;

    // Interaction Actions
    likeReview: (reviewId: number) => Promise<boolean>;
    bookmarkReview: (reviewId: number) => Promise<boolean>;

    // Utility Actions
    clearReviews: () => void;
    clearCurrentReview: () => void;
}

export const useReviewsStore = create<ReviewsState>()(
    devtools(
        (set, get) => ({
            // Initial State
            reviews: [],
            currentReview: null,
            loading: false,
            pagination: {
                currentPage: 0,
                totalPages: 0,
                totalElements: 0,
                pageSize: 20,
            },
            filters: {
                searchKeyword: '',
                sortBy: 'newest',
            },

            // Basic Actions
            setLoading: (loading) => set({ loading }),
            setReviews: (reviews) => set({ reviews }),
            setCurrentReview: (currentReview) =>
                set({ currentReview }),
            setPagination: (pagination) =>
                set((state) => ({
                    pagination: {
                        ...state.pagination,
                        ...pagination,
                    },
                })),
            setFilters: (filters) =>
                set((state) => ({
                    filters: {
                        ...state.filters,
                        ...filters,
                    },
                })),

            // API Actions
            fetchReviews: async (
                page = 0,
                filters = {}
            ) => {
                try {
                    set({ loading: true });
                    const currentFilters = {
                        ...get().filters,
                        ...filters,
                    };

                    let response: PaginatedResponse<Review>;

                    if (
                        currentFilters.searchKeyword.trim()
                    ) {
                        response =
                            await apiClient.searchReviews(
                                currentFilters.searchKeyword,
                                page,
                                get().pagination.pageSize
                            );
                    } else if (
                        currentFilters.sortBy === 'popular'
                    ) {
                        response =
                            await apiClient.getPopularReviews(
                                page,
                                get().pagination.pageSize
                            );
                    } else {
                        response =
                            await apiClient.getReviews(
                                page,
                                get().pagination.pageSize
                            );
                    }

                    set({
                        reviews: response.content,
                        pagination: {
                            currentPage: response.number,
                            totalPages: response.totalPages,
                            totalElements:
                                response.totalElements,
                            pageSize: response.size,
                        },
                        filters: currentFilters,
                    });
                } catch (error) {
                    console.error(
                        '리뷰 목록 조회 실패:',
                        error
                    );
                    toast.error(
                        '리뷰 목록을 불러오는데 실패했습니다'
                    );
                } finally {
                    set({ loading: false });
                }
            },

            fetchReview: async (reviewId) => {
                try {
                    set({ loading: true });
                    const response =
                        await apiClient.getReview(reviewId);
                    set({ currentReview: response });
                } catch (error) {
                    console.error('리뷰 조회 실패:', error);
                    toast.error(
                        '리뷰를 불러오는데 실패했습니다'
                    );
                    set({ currentReview: null });
                } finally {
                    set({ loading: false });
                }
            },

            createReview: async (reviewData) => {
                try {
                    set({ loading: true });
                    const response =
                        await apiClient.createReview(
                            reviewData
                        );
                    toast.success(
                        '리뷰가 성공적으로 작성되었습니다'
                    );

                    // 새 리뷰를 목록에 추가
                    set((state) => ({
                        reviews: [
                            response,
                            ...state.reviews,
                        ],
                        pagination: {
                            ...state.pagination,
                            totalElements:
                                state.pagination
                                    .totalElements + 1,
                        },
                    }));

                    return response;
                } catch (error) {
                    console.error('리뷰 작성 실패:', error);
                    toast.error('리뷰 작성에 실패했습니다');
                    return null;
                } finally {
                    set({ loading: false });
                }
            },

            updateReview: async (reviewId, reviewData) => {
                try {
                    set({ loading: true });
                    const response =
                        await apiClient.updateReview(
                            reviewId,
                            reviewData
                        );
                    toast.success(
                        '리뷰가 성공적으로 수정되었습니다'
                    );

                    // 목록에서 해당 리뷰 업데이트
                    set((state) => ({
                        reviews: state.reviews.map(
                            (review) =>
                                review.id === reviewId
                                    ? response
                                    : review
                        ),
                        currentReview:
                            state.currentReview?.id ===
                            reviewId
                                ? response
                                : state.currentReview,
                    }));

                    return response;
                } catch (error) {
                    console.error('리뷰 수정 실패:', error);
                    toast.error('리뷰 수정에 실패했습니다');
                    return null;
                } finally {
                    set({ loading: false });
                }
            },

            deleteReview: async (reviewId) => {
                try {
                    set({ loading: true });
                    await apiClient.deleteReview(reviewId);
                    toast.success('리뷰가 삭제되었습니다');

                    // 목록에서 해당 리뷰 제거
                    set((state) => ({
                        reviews: state.reviews.filter(
                            (review) =>
                                review.id !== reviewId
                        ),
                        pagination: {
                            ...state.pagination,
                            totalElements: Math.max(
                                0,
                                state.pagination
                                    .totalElements - 1
                            ),
                        },
                        currentReview:
                            state.currentReview?.id ===
                            reviewId
                                ? null
                                : state.currentReview,
                    }));

                    return true;
                } catch (error) {
                    console.error('리뷰 삭제 실패:', error);
                    toast.error('리뷰 삭제에 실패했습니다');
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            searchReviews: async (keyword, page = 0) => {
                try {
                    set({ loading: true });
                    const response =
                        await apiClient.searchReviews(
                            keyword,
                            page,
                            get().pagination.pageSize
                        );

                    set({
                        reviews: response.content,
                        pagination: {
                            currentPage: response.number,
                            totalPages: response.totalPages,
                            totalElements:
                                response.totalElements,
                            pageSize: response.size,
                        },
                        filters: {
                            ...get().filters,
                            searchKeyword: keyword,
                        },
                    });
                } catch (error) {
                    console.error('리뷰 검색 실패:', error);
                    toast.error('리뷰 검색에 실패했습니다');
                } finally {
                    set({ loading: false });
                }
            },

            getReviewsByModel: async (
                modelId,
                page = 0
            ) => {
                try {
                    set({ loading: true });
                    const response =
                        await apiClient.getReviewsByModel(
                            modelId,
                            page,
                            get().pagination.pageSize
                        );

                    set({
                        reviews: response.content,
                        pagination: {
                            currentPage: response.number,
                            totalPages: response.totalPages,
                            totalElements:
                                response.totalElements,
                            pageSize: response.size,
                        },
                        filters: {
                            ...get().filters,
                            modelId,
                        },
                    });
                } catch (error) {
                    console.error(
                        '모델별 리뷰 조회 실패:',
                        error
                    );
                    toast.error(
                        '모델별 리뷰를 불러오는데 실패했습니다'
                    );
                } finally {
                    set({ loading: false });
                }
            },

            getReviewsByUser: async (userId, page = 0) => {
                try {
                    set({ loading: true });
                    const response =
                        await apiClient.getReviewsByUser(
                            userId,
                            page,
                            get().pagination.pageSize
                        );

                    set({
                        reviews: response.content,
                        pagination: {
                            currentPage: response.number,
                            totalPages: response.totalPages,
                            totalElements:
                                response.totalElements,
                            pageSize: response.size,
                        },
                        filters: {
                            ...get().filters,
                            userId,
                        },
                    });
                } catch (error) {
                    console.error(
                        '사용자별 리뷰 조회 실패:',
                        error
                    );
                    toast.error(
                        '사용자별 리뷰를 불러오는데 실패했습니다'
                    );
                } finally {
                    set({ loading: false });
                }
            },

            getPopularReviews: async (page = 0) => {
                try {
                    set({ loading: true });
                    const response =
                        await apiClient.getPopularReviews(
                            page,
                            get().pagination.pageSize
                        );

                    set({
                        reviews: response.content,
                        pagination: {
                            currentPage: response.number,
                            totalPages: response.totalPages,
                            totalElements:
                                response.totalElements,
                            pageSize: response.size,
                        },
                        filters: {
                            ...get().filters,
                            sortBy: 'popular',
                        },
                    });
                } catch (error) {
                    console.error(
                        '인기 리뷰 조회 실패:',
                        error
                    );
                    toast.error(
                        '인기 리뷰를 불러오는데 실패했습니다'
                    );
                } finally {
                    set({ loading: false });
                }
            },

            // Interaction Actions
            likeReview: async (reviewId) => {
                try {
                    // TODO: 좋아요 API 호출
                    // await apiClient.likeReview(reviewId);

                    // 임시로 로컬 상태 업데이트
                    set((state) => ({
                        reviews: state.reviews.map(
                            (review) =>
                                review.id === reviewId
                                    ? {
                                          ...review,
                                          isLiked:
                                              !review.isLiked,
                                          likeCount:
                                              review.isLiked
                                                  ? review.likeCount -
                                                    1
                                                  : review.likeCount +
                                                    1,
                                      }
                                    : review
                        ),
                        currentReview:
                            state.currentReview?.id ===
                            reviewId
                                ? {
                                      ...state.currentReview,
                                      isLiked:
                                          !state
                                              .currentReview
                                              .isLiked,
                                      likeCount: state
                                          .currentReview
                                          .isLiked
                                          ? state
                                                .currentReview
                                                .likeCount -
                                            1
                                          : state
                                                .currentReview
                                                .likeCount +
                                            1,
                                  }
                                : state.currentReview,
                    }));

                    return true;
                } catch (error) {
                    console.error(
                        '좋아요 처리 실패:',
                        error
                    );
                    toast.error(
                        '좋아요 처리에 실패했습니다'
                    );
                    return false;
                }
            },

            bookmarkReview: async (reviewId) => {
                try {
                    // TODO: 북마크 API 호출
                    // await apiClient.bookmarkReview(reviewId);

                    // 임시로 로컬 상태 업데이트
                    set((state) => ({
                        reviews: state.reviews.map(
                            (review) =>
                                review.id === reviewId
                                    ? {
                                          ...review,
                                          isBookmarked:
                                              !review.isBookmarked,
                                      }
                                    : review
                        ),
                        currentReview:
                            state.currentReview?.id ===
                            reviewId
                                ? {
                                      ...state.currentReview,
                                      isBookmarked:
                                          !state
                                              .currentReview
                                              .isBookmarked,
                                  }
                                : state.currentReview,
                    }));

                    return true;
                } catch (error) {
                    console.error(
                        '북마크 처리 실패:',
                        error
                    );
                    toast.error(
                        '북마크 처리에 실패했습니다'
                    );
                    return false;
                }
            },

            // Utility Actions
            clearReviews: () => set({ reviews: [] }),
            clearCurrentReview: () =>
                set({ currentReview: null }),
        }),
        {
            name: 'reviews-store',
        }
    )
);
