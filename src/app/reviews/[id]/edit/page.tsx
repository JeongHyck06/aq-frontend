'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    Review,
    UpdateReviewRequest,
    AIModel,
} from '@/types';
import { useReviewsStore } from '@/store/reviews';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FadeIn } from '@/components/animations/FadeIn';
import { Star, ArrowLeft, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditReviewPage() {
    const router = useRouter();
    const params = useParams();
    const reviewId = params.id as string;

    const {
        currentReview: review,
        loading,
        fetchReview,
        updateReview,
    } = useReviewsStore();
    const [models, setModels] = useState<AIModel[]>([]);
    const [formData, setFormData] =
        useState<UpdateReviewRequest>({
            title: '',
            content: '',
            rating: 5,
            useCase: '',
            inputExample: '',
            outputExample: '',
            tags: [],
            screenshotUrl: '',
        });
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        if (reviewId) {
            Promise.all([
                fetchReview(parseInt(reviewId)),
                fetchModels(),
            ]);
        }
    }, [reviewId]);

    useEffect(() => {
        if (review) {
            setFormData({
                title: review.title,
                content: review.content,
                rating: review.rating,
                useCase: review.useCase || '',
                inputExample: review.inputExample || '',
                outputExample: review.outputExample || '',
                tags: review.tags || [],
                screenshotUrl: review.screenshotUrl || '',
            });
        }
    }, [review]);

    const fetchModels = async () => {
        try {
            // TODO: 모델 목록 API 호출
            // const response = await apiClient.getModels();
            // setModels(response);

            // 임시 데이터
            setModels([
                {
                    id: 1,
                    name: 'GPT-4',
                    provider: 'OpenAI',
                    description: 'Advanced language model',
                    category: 'TEXT_GENERATION' as any,
                    capabilities: [],
                    hasFreeTier: false,
                    createdAt: '',
                    updatedAt: '',
                    reviewCount: 0,
                    isBookmarked: false,
                },
                {
                    id: 2,
                    name: 'Claude-3',
                    provider: 'Anthropic',
                    description: 'AI assistant',
                    category: 'TEXT_GENERATION' as any,
                    capabilities: [],
                    hasFreeTier: false,
                    createdAt: '',
                    updatedAt: '',
                    reviewCount: 0,
                    isBookmarked: false,
                },
            ]);
        } catch (error) {
            console.error('모델 목록 조회 실패:', error);
            toast.error(
                '모델 목록을 불러오는데 실패했습니다'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (
        field: keyof UpdateReviewRequest,
        value: any
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleRatingChange = (rating: number) => {
        handleInputChange('rating', rating);
    };

    const handleTagAdd = () => {
        if (
            tagInput.trim() &&
            !formData.tags?.includes(tagInput.trim())
        ) {
            handleInputChange('tags', [
                ...(formData.tags || []),
                tagInput.trim(),
            ]);
            setTagInput('');
        }
    };

    const handleTagRemove = (tagToRemove: string) => {
        handleInputChange(
            'tags',
            formData.tags?.filter(
                (tag) => tag !== tagToRemove
            ) || []
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleTagAdd();
        }
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            toast.error('제목을 입력해주세요');
            return false;
        }
        if (!formData.content.trim()) {
            toast.error('내용을 입력해주세요');
            return false;
        }
        if (formData.rating < 1 || formData.rating > 5) {
            toast.error('평점을 선택해주세요');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const result = await updateReview(
            parseInt(reviewId),
            formData
        );
        if (result) {
            router.push(`/reviews/${reviewId}`);
        }
    };

    const renderStars = (
        rating: number,
        interactive = false
    ) => {
        return Array.from({ length: 5 }, (_, i) => (
            <button
                key={i}
                type="button"
                onClick={() =>
                    interactive && handleRatingChange(i + 1)
                }
                className={`w-8 h-8 ${
                    interactive
                        ? 'cursor-pointer hover:scale-110'
                        : 'cursor-default'
                } transition-transform`}
            >
                <Star
                    className={`w-full h-full ${
                        i < rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                    }`}
                />
            </button>
        ));
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
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    리뷰 수정
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    리뷰 내용을 수정해주세요
                                </p>
                            </div>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-8"
                    >
                        {/* Model Info (Read-only) */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                모델 정보
                            </h2>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-medium text-gray-900">
                                    {review.modelName}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {review.modelProvider}
                                </p>
                            </div>
                        </Card>

                        {/* Basic Information */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                기본 정보
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        제목 *
                                    </label>
                                    <Input
                                        value={
                                            formData.title
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                'title',
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="리뷰 제목을 입력하세요"
                                        maxLength={200}
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {
                                            formData.title
                                                .length
                                        }
                                        /200
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        평점 *
                                    </label>
                                    <div className="flex items-center gap-2">
                                        {renderStars(
                                            formData.rating,
                                            true
                                        )}
                                        <span className="text-sm text-gray-600 ml-2">
                                            {
                                                formData.rating
                                            }
                                            /5
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        리뷰 내용 *
                                    </label>
                                    <Textarea
                                        value={
                                            formData.content
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                'content',
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="모델 사용 경험을 자세히 작성해주세요"
                                        rows={6}
                                        maxLength={5000}
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {
                                            formData.content
                                                .length
                                        }
                                        /5000
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Use Case */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                사용 사례
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    사용 목적
                                </label>
                                <Input
                                    value={
                                        formData.useCase ||
                                        ''
                                    }
                                    onChange={(e) =>
                                        handleInputChange(
                                            'useCase',
                                            e.target.value
                                        )
                                    }
                                    placeholder="어떤 용도로 사용했나요? (예: 번역, 요약, 코딩 등)"
                                />
                            </div>
                        </Card>

                        {/* Examples */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                사용 예시
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        입력 예시
                                    </label>
                                    <Textarea
                                        value={
                                            formData.inputExample ||
                                            ''
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                'inputExample',
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="모델에 입력한 내용의 예시를 작성해주세요"
                                        rows={3}
                                        maxLength={2000}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {
                                            (
                                                formData.inputExample ||
                                                ''
                                            ).length
                                        }
                                        /2000
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        출력 예시
                                    </label>
                                    <Textarea
                                        value={
                                            formData.outputExample ||
                                            ''
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                'outputExample',
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="모델이 출력한 결과의 예시를 작성해주세요"
                                        rows={3}
                                        maxLength={2000}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {
                                            (
                                                formData.outputExample ||
                                                ''
                                            ).length
                                        }
                                        /2000
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Tags */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                태그
                            </h2>
                            <div className="space-y-4">
                                <Input
                                    value={tagInput}
                                    onChange={(e) =>
                                        setTagInput(
                                            e.target.value
                                        )
                                    }
                                    onKeyPress={
                                        handleKeyPress
                                    }
                                    placeholder="태그를 입력하고 Enter를 누르세요"
                                />

                                {formData.tags &&
                                    formData.tags.length >
                                        0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.tags.map(
                                                (tag) => (
                                                    <div
                                                        key={
                                                            tag
                                                        }
                                                        className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                                    >
                                                        {
                                                            tag
                                                        }
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleTagRemove(
                                                                    tag
                                                                )
                                                            }
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>
                        </Card>

                        {/* Actions */}
                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    router.back()
                                }
                            >
                                취소
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2"
                            >
                                {loading ? (
                                    <LoadingSpinner size="sm" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                수정 완료
                            </Button>
                        </div>
                    </form>
                </FadeIn>
            </div>
        </div>
    );
}
