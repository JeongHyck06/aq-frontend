import React, { memo } from 'react';
import { ContentCard } from './ContentCard';
import { Review, PromptRecipe, AIModel } from '@/types';

interface ContentGridProps {
    reviews?: Review[];
    recipes?: PromptRecipe[];
    models?: AIModel[];
    reviewsLoading?: boolean;
    recipesLoading?: boolean;
    modelsLoading?: boolean;
    type: 'reviews' | 'recipes' | 'models';
    limit?: number;
}

export const ContentGrid: React.FC<ContentGridProps> = memo(
    ({
        reviews = [],
        recipes = [],
        models = [],
        reviewsLoading = false,
        recipesLoading = false,
        modelsLoading = false,
        type,
        limit = 6,
    }) => {
        const isLoading =
            reviewsLoading ||
            recipesLoading ||
            modelsLoading;

        const renderContent = () => {
            switch (type) {
                case 'reviews':
                    if (isLoading) {
                        return Array.from({
                            length: limit,
                        }).map((_, i) => (
                            <ContentCard
                                key={i}
                                item={{}}
                                isLoading={true}
                            />
                        ));
                    }
                    return reviews
                        .slice(0, limit)
                        .map((review) => (
                            <ContentCard
                                key={review.id}
                                item={{
                                    type: 'review',
                                    id: review.id,
                                    title: review.title,
                                    content: review.content,
                                    modelName:
                                        review.modelName,
                                    rating: review.rating,
                                    viewCount:
                                        review.viewCount,
                                    likeCount:
                                        review.likeCount,
                                    commentCount:
                                        review.commentCount,
                                    createdAt:
                                        review.createdAt,
                                }}
                            />
                        ));

                case 'recipes':
                    if (isLoading) {
                        return Array.from({
                            length: limit,
                        }).map((_, i) => (
                            <ContentCard
                                key={i}
                                item={{}}
                                isLoading={true}
                            />
                        ));
                    }
                    return recipes
                        .slice(0, limit)
                        .map((recipe) => (
                            <ContentCard
                                key={recipe.id}
                                item={{
                                    type: 'recipe',
                                    id: recipe.id,
                                    title: recipe.title,
                                    description:
                                        recipe.description,
                                    category:
                                        recipe.category,
                                    recommendedModelName:
                                        recipe.recommendedModelName,
                                    viewCount:
                                        recipe.viewCount,
                                    likeCount:
                                        recipe.likeCount,
                                    commentCount:
                                        recipe.commentCount,
                                    usageCount:
                                        recipe.usageCount,
                                    createdAt:
                                        recipe.createdAt,
                                }}
                            />
                        ));

                case 'models':
                    if (isLoading) {
                        return Array.from({
                            length: limit,
                        }).map((_, i) => (
                            <ContentCard
                                key={i}
                                item={{}}
                                isLoading={true}
                            />
                        ));
                    }
                    return models
                        .slice(0, limit)
                        .map((model) => (
                            <ContentCard
                                key={model.id}
                                item={{
                                    type: 'model',
                                    id: model.id,
                                    name: model.name,
                                    title: model.name,
                                    description:
                                        model.description ||
                                        '',
                                    provider:
                                        model.provider,
                                    category:
                                        model.category,
                                    hasFreeTier:
                                        model.hasFreeTier,
                                    averageRating:
                                        model.averageRating,
                                    reviewCount:
                                        model.reviewCount,
                                    viewCount: 0,
                                    likeCount: 0,
                                    commentCount:
                                        model.reviewCount,
                                    createdAt:
                                        model.createdAt,
                                }}
                            />
                        ));

                default:
                    return null;
            }
        };

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderContent()}
            </div>
        );
    }
);

ContentGrid.displayName = 'ContentGrid';
