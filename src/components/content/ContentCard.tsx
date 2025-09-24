import React, { memo } from 'react';
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { HoverCard } from '@/components/animations';
import {
    Star,
    Eye,
    Heart,
    MessageSquare,
    TrendingUp,
    ArrowRight,
} from 'lucide-react';
import { formatNumber } from '@/utils/format';

interface BaseContent {
    id: number;
    title: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    createdAt: string;
}

interface ReviewContent extends BaseContent {
    type: 'review';
    modelName: string;
    content: string;
    rating: number;
}

interface RecipeContent extends BaseContent {
    type: 'recipe';
    description: string;
    category: string;
    recommendedModelName?: string;
    usageCount: number;
}

interface ModelContent extends BaseContent {
    type: 'model';
    name: string;
    description: string;
    provider: string;
    category: string;
    hasFreeTier: boolean;
    averageRating?: number;
    reviewCount: number;
}

type ContentItem =
    | ReviewContent
    | RecipeContent
    | ModelContent;

interface LoadingContentItem {
    type?: never;
    id?: never;
    title?: never;
    viewCount?: never;
    likeCount?: never;
    commentCount?: never;
    createdAt?: never;
}

interface ContentCardProps {
    item: ContentItem | LoadingContentItem;
    isLoading?: boolean;
}

const LoadingSkeleton: React.FC = memo(() => (
    <Card className="animate-pulse">
        <CardHeader>
            <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
            <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
            <div className="space-y-2">
                <div className="h-3 bg-secondary-200 rounded"></div>
                <div className="h-3 bg-secondary-200 rounded w-5/6"></div>
            </div>
        </CardContent>
    </Card>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

const ReviewCard: React.FC<{ item: ReviewContent }> = memo(
    ({ item }) => (
        <HoverCard>
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-lg line-clamp-2">
                                {item.title}
                            </CardTitle>
                            <div className="flex items-center space-x-2 mt-2">
                                <Badge variant="outline">
                                    {item.modelName}
                                </Badge>
                                <div className="flex items-center space-x-1">
                                    {Array.from({
                                        length: 5,
                                    }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${
                                                i <
                                                item.rating
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
                        {item.content}
                    </p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-secondary-500">
                            <div className="flex items-center space-x-1">
                                <Eye className="h-4 w-4" />
                                <span>
                                    {formatNumber(
                                        item.viewCount
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Heart className="h-4 w-4" />
                                <span>
                                    {formatNumber(
                                        item.likeCount
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>
                                    {formatNumber(
                                        item.commentCount
                                    )}
                                </span>
                            </div>
                        </div>
                        <Link href={`/reviews/${item.id}`}>
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
        </HoverCard>
    )
);

ReviewCard.displayName = 'ReviewCard';

const RecipeCard: React.FC<{ item: RecipeContent }> = memo(
    ({ item }) => (
        <Card className="hover:shadow-medium transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">
                            {item.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="secondary">
                                {item.category}
                            </Badge>
                            {item.recommendedModelName && (
                                <Badge variant="outline">
                                    {
                                        item.recommendedModelName
                                    }
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-secondary-600 line-clamp-3 mb-4">
                    {item.description}
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-secondary-500">
                        <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>
                                {formatNumber(
                                    item.viewCount
                                )}
                            </span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>
                                {formatNumber(
                                    item.likeCount
                                )}
                            </span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>
                                {formatNumber(
                                    item.usageCount
                                )}
                            </span>
                        </div>
                    </div>
                    <Link href={`/recipes/${item.id}`}>
                        <Button variant="ghost" size="sm">
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
);

RecipeCard.displayName = 'RecipeCard';

const ModelCard: React.FC<{ item: ModelContent }> = memo(
    ({ item }) => (
        <Card className="hover:shadow-medium transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg">
                            {item.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline">
                                {item.provider}
                            </Badge>
                            <Badge variant="secondary">
                                {item.category}
                            </Badge>
                            {item.hasFreeTier && (
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
                    {item.description}
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-secondary-500">
                        <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4" />
                            <span>
                                {item.averageRating?.toFixed(
                                    1
                                ) || 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>
                                {formatNumber(
                                    item.reviewCount
                                )}
                            </span>
                        </div>
                    </div>
                    <Link href={`/models/${item.id}`}>
                        <Button variant="ghost" size="sm">
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
);

ModelCard.displayName = 'ModelCard';

export const ContentCard: React.FC<ContentCardProps> = memo(
    ({ item, isLoading }) => {
        if (isLoading) {
            return <LoadingSkeleton />;
        }

        switch (item.type) {
            case 'review':
                return <ReviewCard item={item} />;
            case 'recipe':
                return <RecipeCard item={item} />;
            case 'model':
                return <ModelCard item={item} />;
            default:
                return null;
        }
    }
);

ContentCard.displayName = 'ContentCard';
