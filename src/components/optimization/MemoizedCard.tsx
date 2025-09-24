'use client';

import React, { memo } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
    formatNumber,
    formatRelativeTime,
} from '@/utils/format';
import {
    Star,
    Eye,
    Heart,
    MessageSquare,
    ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { Review, PromptRecipe, AIModel } from '@/types';

interface ReviewCardProps {
    review: Review;
}

export const ReviewCard = memo<ReviewCardProps>(
    ({ review }) => {
        return (
            <Card className="hover:shadow-medium transition-shadow">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-lg line-clamp-2">
                                {review.title}
                            </CardTitle>
                            <div className="flex items-center space-x-2 mt-2">
                                <Badge variant="outline">
                                    {review.modelName}
                                </Badge>
                                <div className="flex items-center space-x-1">
                                    {Array.from({
                                        length: 5,
                                    }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${
                                                i <
                                                review.rating
                                                    ? 'text-warning-400 fill-current'
                                                    : 'text-secondary-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-secondary-600 line-clamp-3 mb-4">
                        {review.content}
                    </p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-secondary-500">
                            <div className="flex items-center space-x-1">
                                <Eye className="h-4 w-4" />
                                <span>
                                    {formatNumber(
                                        review.viewCount
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Heart className="h-4 w-4" />
                                <span>
                                    {formatNumber(
                                        review.likeCount
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>
                                    {formatNumber(
                                        review.commentCount
                                    )}
                                </span>
                            </div>
                        </div>
                        <Link
                            href={`/reviews/${review.id}`}
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                            >
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        );
    }
);

ReviewCard.displayName = 'ReviewCard';

interface RecipeCardProps {
    recipe: PromptRecipe;
}

export const RecipeCard = memo<RecipeCardProps>(
    ({ recipe }) => {
        return (
            <Card className="hover:shadow-medium transition-shadow">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-lg line-clamp-2">
                                {recipe.title}
                            </CardTitle>
                            <div className="flex items-center space-x-2 mt-2">
                                <Badge variant="secondary">
                                    {recipe.category}
                                </Badge>
                                {recipe.recommendedModelName && (
                                    <Badge variant="outline">
                                        {
                                            recipe.recommendedModelName
                                        }
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-secondary-600 line-clamp-3 mb-4">
                        {recipe.description}
                    </p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-secondary-500">
                            <div className="flex items-center space-x-1">
                                <Eye className="h-4 w-4" />
                                <span>
                                    {formatNumber(
                                        recipe.viewCount
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Heart className="h-4 w-4" />
                                <span>
                                    {formatNumber(
                                        recipe.likeCount
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>
                                    {formatNumber(
                                        recipe.commentCount
                                    )}
                                </span>
                            </div>
                        </div>
                        <Link
                            href={`/recipes/${recipe.id}`}
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                            >
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        );
    }
);

RecipeCard.displayName = 'RecipeCard';

interface ModelCardProps {
    model: AIModel;
}

export const ModelCard = memo<ModelCardProps>(
    ({ model }) => {
        return (
            <Card className="hover:shadow-medium transition-shadow">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-lg">
                                {model.name}
                            </CardTitle>
                            <div className="flex items-center space-x-2 mt-2">
                                <Badge variant="outline">
                                    {model.provider}
                                </Badge>
                                <Badge variant="secondary">
                                    {model.category}
                                </Badge>
                                {model.hasFreeTier && (
                                    <Badge variant="success">
                                        무료 체험
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-secondary-600 line-clamp-3 mb-4">
                        {model.description}
                    </p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-secondary-500">
                            <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4" />
                                <span>
                                    {model.averageRating?.toFixed(
                                        1
                                    ) || 'N/A'}
                                </span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>
                                    {formatNumber(
                                        model.reviewCount
                                    )}
                                </span>
                            </div>
                        </div>
                        <Link href={`/models/${model.id}`}>
                            <Button
                                variant="ghost"
                                size="sm"
                            >
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        );
    }
);

ModelCard.displayName = 'ModelCard';
