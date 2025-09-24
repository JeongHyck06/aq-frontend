import { create } from 'zustand';
import {
    Review,
    PromptRecipe,
    AIModel,
    Comment,
} from '@/types';
import apiClient from '@/lib/api';

interface ContentState {
    // Reviews
    reviews: Review[];
    currentReview: Review | null;
    reviewsLoading: boolean;
    fetchReviews: (params?: any) => Promise<void>;
    fetchReview: (id: number) => Promise<void>;
    createReview: (data: any) => Promise<Review>;
    updateReview: (
        id: number,
        data: any
    ) => Promise<Review>;
    deleteReview: (id: number) => Promise<void>;
    likeReview: (id: number) => Promise<void>;
    bookmarkReview: (id: number) => Promise<void>;

    // Recipes
    recipes: PromptRecipe[];
    currentRecipe: PromptRecipe | null;
    recipesLoading: boolean;
    fetchRecipes: (params?: any) => Promise<void>;
    fetchRecipe: (id: number) => Promise<void>;
    createRecipe: (data: any) => Promise<PromptRecipe>;
    updateRecipe: (
        id: number,
        data: any
    ) => Promise<PromptRecipe>;
    deleteRecipe: (id: number) => Promise<void>;
    likeRecipe: (id: number) => Promise<void>;
    bookmarkRecipe: (id: number) => Promise<void>;
    useRecipe: (id: number) => Promise<void>;

    // Models
    models: AIModel[];
    currentModel: AIModel | null;
    modelsLoading: boolean;
    fetchModels: (params?: any) => Promise<void>;
    fetchModel: (id: number) => Promise<void>;
    searchModels: (query: string) => Promise<void>;
    bookmarkModel: (id: number) => Promise<void>;

    // Comments
    comments: Comment[];
    commentsLoading: boolean;
    fetchComments: (
        type: string,
        targetId: number
    ) => Promise<void>;
    createComment: (data: any) => Promise<Comment>;
    updateComment: (
        id: number,
        data: any
    ) => Promise<Comment>;
    deleteComment: (id: number) => Promise<void>;
    likeComment: (id: number) => Promise<void>;

    // Clear state
    clearContent: () => void;
    clearCurrentReview: () => void;
    clearCurrentRecipe: () => void;
    clearCurrentModel: () => void;
}

export const useContentStore = create<ContentState>(
    (set, get) => ({
        // Reviews
        reviews: [],
        currentReview: null,
        reviewsLoading: false,

        fetchReviews: async (params = {}) => {
            set({ reviewsLoading: true });
            try {
                const response = await apiClient.get(
                    '/api/reviews',
                    { params }
                );
                set({
                    reviews: response.content || response,
                    reviewsLoading: false,
                });
            } catch (error) {
                console.warn(
                    'Failed to fetch reviews, using dummy data:',
                    error
                );
                // 백엔드가 실행되지 않았을 때 더미 데이터 사용
                const dummyReviews = [
                    {
                        id: 1,
                        modelId: 1,
                        modelName: 'GPT-4',
                        modelProvider: 'OpenAI',
                        authorId: 1,
                        authorNickname: '사용자1',
                        title: 'GPT-4로 코드 리뷰하기',
                        content:
                            'GPT-4를 사용해서 코드 리뷰를 해봤는데 정말 유용했습니다. 특히 복잡한 로직에 대한 설명이 정확하고 이해하기 쉬웠어요.',
                        rating: 5,
                        viewCount: 1234,
                        likeCount: 89,
                        commentCount: 12,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        isLiked: false,
                        isBookmarked: false,
                    },
                    {
                        id: 2,
                        modelId: 2,
                        modelName: 'Claude-3',
                        modelProvider: 'Anthropic',
                        authorId: 2,
                        authorNickname: '사용자2',
                        title: 'Claude-3로 문서 작성하기',
                        content:
                            'Claude-3를 사용해서 기술 문서를 작성해봤습니다. 구조화된 문서 작성에 특화되어 있어서 매우 만족스러웠습니다.',
                        rating: 4,
                        viewCount: 856,
                        likeCount: 67,
                        commentCount: 8,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        isLiked: false,
                        isBookmarked: false,
                    },
                ];
                set({
                    reviews: dummyReviews,
                    reviewsLoading: false,
                });
            }
        },

        fetchReview: async (id: number) => {
            try {
                const response = await apiClient.get(
                    `/api/reviews/${id}`
                );
                set({ currentReview: response });
            } catch (error) {
                throw error;
            }
        },

        createReview: async (data: any) => {
            try {
                const response = await apiClient.post(
                    '/api/reviews',
                    data
                );
                set((state) => ({
                    reviews: [response, ...state.reviews],
                }));
                return response;
            } catch (error) {
                throw error;
            }
        },

        updateReview: async (id: number, data: any) => {
            try {
                const response = await apiClient.put(
                    `/api/reviews/${id}`,
                    data
                );
                set((state) => ({
                    reviews: state.reviews.map((review) =>
                        review.id === id ? response : review
                    ),
                    currentReview:
                        state.currentReview?.id === id
                            ? response
                            : state.currentReview,
                }));
                return response;
            } catch (error) {
                throw error;
            }
        },

        deleteReview: async (id: number) => {
            try {
                await apiClient.delete(
                    `/api/reviews/${id}`
                );
                set((state) => ({
                    reviews: state.reviews.filter(
                        (review) => review.id !== id
                    ),
                    currentReview:
                        state.currentReview?.id === id
                            ? null
                            : state.currentReview,
                }));
            } catch (error) {
                throw error;
            }
        },

        likeReview: async (id: number) => {
            try {
                await apiClient.post(
                    '/api/interactions/like',
                    null,
                    {
                        params: {
                            type: 'REVIEW',
                            targetId: id,
                        },
                    }
                );
                set((state) => ({
                    reviews: state.reviews.map((review) =>
                        review.id === id
                            ? {
                                  ...review,
                                  isLiked: !review.isLiked,
                                  likeCount: review.isLiked
                                      ? review.likeCount - 1
                                      : review.likeCount +
                                        1,
                              }
                            : review
                    ),
                    currentReview:
                        state.currentReview?.id === id
                            ? {
                                  ...state.currentReview,
                                  isLiked:
                                      !state.currentReview
                                          .isLiked,
                                  likeCount: state
                                      .currentReview.isLiked
                                      ? state.currentReview
                                            .likeCount - 1
                                      : state.currentReview
                                            .likeCount + 1,
                              }
                            : state.currentReview,
                }));
            } catch (error) {
                throw error;
            }
        },

        bookmarkReview: async (id: number) => {
            try {
                await apiClient.post(
                    '/api/interactions/bookmark',
                    null,
                    {
                        params: {
                            type: 'REVIEW',
                            targetId: id,
                        },
                    }
                );
                set((state) => ({
                    reviews: state.reviews.map((review) =>
                        review.id === id
                            ? {
                                  ...review,
                                  isBookmarked:
                                      !review.isBookmarked,
                              }
                            : review
                    ),
                    currentReview:
                        state.currentReview?.id === id
                            ? {
                                  ...state.currentReview,
                                  isBookmarked:
                                      !state.currentReview
                                          .isBookmarked,
                              }
                            : state.currentReview,
                }));
            } catch (error) {
                throw error;
            }
        },

        // Recipes
        recipes: [],
        currentRecipe: null,
        recipesLoading: false,

        fetchRecipes: async (params = {}) => {
            set({ recipesLoading: true });
            try {
                const response = await apiClient.get(
                    '/api/recipes',
                    { params }
                );
                set({
                    recipes: response.content || response,
                    recipesLoading: false,
                });
            } catch (error) {
                console.warn(
                    'Failed to fetch recipes, using dummy data:',
                    error
                );
                const dummyRecipes = [
                    {
                        id: 1,
                        authorId: 1,
                        authorNickname: '사용자1',
                        recommendedModelId: 1,
                        recommendedModelName: 'GPT-4',
                        recommendedModelProvider: 'OpenAI',
                        title: '효과적인 코드 리뷰 프롬프트',
                        description:
                            '코드의 품질을 높이는 리뷰를 받을 수 있는 프롬프트입니다.',
                        promptTemplate:
                            '다음 코드를 리뷰해주세요. 성능, 가독성, 보안 측면에서 개선점을 제안해주세요:\n\n{code}',
                        category: 'CODE_GENERATION',
                        tags: ['코드리뷰', '개발', '품질'],
                        viewCount: 2345,
                        likeCount: 156,
                        commentCount: 23,
                        usageCount: 89,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        isLiked: false,
                        isBookmarked: false,
                    },
                ];
                set({
                    recipes: dummyRecipes,
                    recipesLoading: false,
                });
            }
        },

        fetchRecipe: async (id: number) => {
            try {
                const response = await apiClient.get(
                    `/api/recipes/${id}`
                );
                set({ currentRecipe: response });
            } catch (error) {
                throw error;
            }
        },

        createRecipe: async (data: any) => {
            try {
                const response = await apiClient.post(
                    '/api/recipes',
                    data
                );
                set((state) => ({
                    recipes: [response, ...state.recipes],
                }));
                return response;
            } catch (error) {
                throw error;
            }
        },

        updateRecipe: async (id: number, data: any) => {
            try {
                const response = await apiClient.put(
                    `/api/recipes/${id}`,
                    data
                );
                set((state) => ({
                    recipes: state.recipes.map((recipe) =>
                        recipe.id === id ? response : recipe
                    ),
                    currentRecipe:
                        state.currentRecipe?.id === id
                            ? response
                            : state.currentRecipe,
                }));
                return response;
            } catch (error) {
                throw error;
            }
        },

        deleteRecipe: async (id: number) => {
            try {
                await apiClient.delete(
                    `/api/recipes/${id}`
                );
                set((state) => ({
                    recipes: state.recipes.filter(
                        (recipe) => recipe.id !== id
                    ),
                    currentRecipe:
                        state.currentRecipe?.id === id
                            ? null
                            : state.currentRecipe,
                }));
            } catch (error) {
                throw error;
            }
        },

        likeRecipe: async (id: number) => {
            try {
                await apiClient.post(
                    '/api/interactions/like',
                    null,
                    {
                        params: {
                            type: 'RECIPE',
                            targetId: id,
                        },
                    }
                );
                set((state) => ({
                    recipes: state.recipes.map((recipe) =>
                        recipe.id === id
                            ? {
                                  ...recipe,
                                  isLiked: !recipe.isLiked,
                                  likeCount: recipe.isLiked
                                      ? recipe.likeCount - 1
                                      : recipe.likeCount +
                                        1,
                              }
                            : recipe
                    ),
                    currentRecipe:
                        state.currentRecipe?.id === id
                            ? {
                                  ...state.currentRecipe,
                                  isLiked:
                                      !state.currentRecipe
                                          .isLiked,
                                  likeCount: state
                                      .currentRecipe.isLiked
                                      ? state.currentRecipe
                                            .likeCount - 1
                                      : state.currentRecipe
                                            .likeCount + 1,
                              }
                            : state.currentRecipe,
                }));
            } catch (error) {
                throw error;
            }
        },

        bookmarkRecipe: async (id: number) => {
            try {
                await apiClient.post(
                    '/api/interactions/bookmark',
                    null,
                    {
                        params: {
                            type: 'RECIPE',
                            targetId: id,
                        },
                    }
                );
                set((state) => ({
                    recipes: state.recipes.map((recipe) =>
                        recipe.id === id
                            ? {
                                  ...recipe,
                                  isBookmarked:
                                      !recipe.isBookmarked,
                              }
                            : recipe
                    ),
                    currentRecipe:
                        state.currentRecipe?.id === id
                            ? {
                                  ...state.currentRecipe,
                                  isBookmarked:
                                      !state.currentRecipe
                                          .isBookmarked,
                              }
                            : state.currentRecipe,
                }));
            } catch (error) {
                throw error;
            }
        },

        useRecipe: async (id: number) => {
            try {
                await apiClient.post(
                    `/api/recipes/${id}/use`
                );
                set((state) => ({
                    recipes: state.recipes.map((recipe) =>
                        recipe.id === id
                            ? {
                                  ...recipe,
                                  usageCount:
                                      recipe.usageCount + 1,
                              }
                            : recipe
                    ),
                    currentRecipe:
                        state.currentRecipe?.id === id
                            ? {
                                  ...state.currentRecipe,
                                  usageCount:
                                      state.currentRecipe
                                          .usageCount + 1,
                              }
                            : state.currentRecipe,
                }));
            } catch (error) {
                throw error;
            }
        },

        // Models
        models: [],
        currentModel: null,
        modelsLoading: false,

        fetchModels: async (params = {}) => {
            set({ modelsLoading: true });
            try {
                const response = await apiClient.get(
                    '/api/models',
                    { params }
                );
                set({
                    models: response.content || response,
                    modelsLoading: false,
                });
            } catch (error) {
                console.warn(
                    'Failed to fetch models, using dummy data:',
                    error
                );
                const dummyModels = [
                    {
                        id: 1,
                        name: 'GPT-4',
                        provider: 'OpenAI',
                        description:
                            '가장 강력한 언어 모델 중 하나로, 복잡한 추론과 창의적 작업에 뛰어납니다.',
                        category: 'TEXT_GENERATION',
                        capabilities: [
                            '텍스트 생성',
                            '코드 작성',
                            '번역',
                            '요약',
                        ],
                        hasFreeTier: false,
                        averageRating: 4.8,
                        reviewCount: 1234,
                        isBookmarked: false,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    },
                    {
                        id: 2,
                        name: 'Claude-3',
                        provider: 'Anthropic',
                        description:
                            '안전하고 유용한 AI 어시스턴트로, 대화와 문서 작성에 특화되어 있습니다.',
                        category: 'TEXT_GENERATION',
                        capabilities: [
                            '대화',
                            '문서 작성',
                            '분석',
                            '요약',
                        ],
                        hasFreeTier: true,
                        averageRating: 4.6,
                        reviewCount: 856,
                        isBookmarked: false,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    },
                ];
                set({
                    models: dummyModels,
                    modelsLoading: false,
                });
            }
        },

        fetchModel: async (id: number) => {
            try {
                const response = await apiClient.get(
                    `/api/models/${id}`
                );
                set({ currentModel: response });
            } catch (error) {
                throw error;
            }
        },

        searchModels: async (query: string) => {
            set({ modelsLoading: true });
            try {
                const response = await apiClient.get(
                    '/api/models/search',
                    {
                        params: { keyword: query },
                    }
                );
                set({
                    models: response.content || response,
                    modelsLoading: false,
                });
            } catch (error) {
                set({ modelsLoading: false });
                throw error;
            }
        },

        bookmarkModel: async (id: number) => {
            try {
                await apiClient.post(
                    '/api/interactions/bookmark',
                    null,
                    {
                        params: {
                            type: 'MODEL',
                            targetId: id,
                        },
                    }
                );
                set((state) => ({
                    models: state.models.map((model) =>
                        model.id === id
                            ? {
                                  ...model,
                                  isBookmarked:
                                      !model.isBookmarked,
                              }
                            : model
                    ),
                    currentModel:
                        state.currentModel?.id === id
                            ? {
                                  ...state.currentModel,
                                  isBookmarked:
                                      !state.currentModel
                                          .isBookmarked,
                              }
                            : state.currentModel,
                }));
            } catch (error) {
                throw error;
            }
        },

        // Comments
        comments: [],
        commentsLoading: false,

        fetchComments: async (
            type: string,
            targetId: number
        ) => {
            set({ commentsLoading: true });
            try {
                const response = await apiClient.get(
                    '/api/comments',
                    {
                        params: { type, targetId },
                    }
                );
                set({
                    comments: response.content || response,
                    commentsLoading: false,
                });
            } catch (error) {
                set({ commentsLoading: false });
                throw error;
            }
        },

        createComment: async (data: any) => {
            try {
                const response = await apiClient.post(
                    '/api/comments',
                    data
                );
                set((state) => ({
                    comments: [response, ...state.comments],
                }));
                return response;
            } catch (error) {
                throw error;
            }
        },

        updateComment: async (id: number, data: any) => {
            try {
                const response = await apiClient.put(
                    `/api/comments/${id}`,
                    data
                );
                set((state) => ({
                    comments: state.comments.map(
                        (comment) =>
                            comment.id === id
                                ? response
                                : comment
                    ),
                }));
                return response;
            } catch (error) {
                throw error;
            }
        },

        deleteComment: async (id: number) => {
            try {
                await apiClient.delete(
                    `/api/comments/${id}`
                );
                set((state) => ({
                    comments: state.comments.filter(
                        (comment) => comment.id !== id
                    ),
                }));
            } catch (error) {
                throw error;
            }
        },

        likeComment: async (id: number) => {
            try {
                await apiClient.post(
                    '/api/interactions/like',
                    null,
                    {
                        params: {
                            type: 'COMMENT',
                            targetId: id,
                        },
                    }
                );
                set((state) => ({
                    comments: state.comments.map(
                        (comment) =>
                            comment.id === id
                                ? {
                                      ...comment,
                                      likeCount:
                                          comment.likeCount +
                                          1,
                                  }
                                : comment
                    ),
                }));
            } catch (error) {
                throw error;
            }
        },

        // Clear state
        clearContent: () => {
            set({
                reviews: [],
                recipes: [],
                models: [],
                comments: [],
                currentReview: null,
                currentRecipe: null,
                currentModel: null,
            });
        },

        clearCurrentReview: () =>
            set({ currentReview: null }),
        clearCurrentRecipe: () =>
            set({ currentRecipe: null }),
        clearCurrentModel: () =>
            set({ currentModel: null }),
    })
);
