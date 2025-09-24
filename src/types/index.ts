// User types
export interface User {
    id: number;
    email: string;
    nickname: string;
    profileImage?: string;
    bio?: string;
    points: number;
    level: number;
}

export interface UserProfile extends User {}

// Auth types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    nickname: string;
    bio?: string;
    interests?: string[];
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: User;
}

// Model types
export interface AIModel {
    id: number;
    name: string;
    provider: string;
    description?: string;
    category: ModelCategory;
    capabilities: string[];
    inputPricePerToken?: number;
    outputPricePerToken?: number;
    maxTokens?: number;
    hasFreeTier: boolean;
    apiEndpoint?: string;
    documentationUrl?: string;
    createdAt: string;
    updatedAt: string;
    averageRating?: number;
    reviewCount: number;
    isBookmarked: boolean;
}

export enum ModelCategory {
    TEXT_GENERATION = 'TEXT_GENERATION',
    CODE_GENERATION = 'CODE_GENERATION',
    TRANSLATION = 'TRANSLATION',
    SUMMARIZATION = 'SUMMARIZATION',
    QUESTION_ANSWERING = 'QUESTION_ANSWERING',
    CREATIVE_WRITING = 'CREATIVE_WRITING',
    ANALYSIS = 'ANALYSIS',
    MULTIMODAL = 'MULTIMODAL',
}

// Review types
export interface Review {
    id: number;
    modelId: number;
    modelName: string;
    modelProvider: string;
    authorId: number;
    authorNickname: string;
    authorProfileImage?: string;
    title: string;
    content: string;
    rating: number;
    useCase?: string;
    inputExample?: string;
    outputExample?: string;
    tags: string[];
    screenshotUrl?: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    createdAt: string;
    updatedAt: string;
    isLiked: boolean;
    isBookmarked: boolean;
}

export interface CreateReviewRequest {
    modelId: number;
    title: string;
    content: string;
    rating: number;
    useCase?: string;
    inputExample?: string;
    outputExample?: string;
    tags?: string[];
    screenshotUrl?: string;
}

export interface UpdateReviewRequest
    extends CreateReviewRequest {}

// Recipe types
export interface PromptRecipe {
    id: number;
    authorId: number;
    authorNickname: string;
    authorProfileImage?: string;
    recommendedModelId?: number;
    recommendedModelName?: string;
    recommendedModelProvider?: string;
    title: string;
    description: string;
    promptTemplate: string;
    expectedOutput?: string;
    usageInstructions?: string;
    tags: string[];
    steps: string[];
    category: RecipeCategory;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    usageCount: number;
    createdAt: string;
    updatedAt: string;
    isLiked: boolean;
    isBookmarked: boolean;
}

export enum RecipeCategory {
    TRANSLATION = 'TRANSLATION',
    SUMMARIZATION = 'SUMMARIZATION',
    CODE_GENERATION = 'CODE_GENERATION',
    CREATIVE_WRITING = 'CREATIVE_WRITING',
    ANALYSIS = 'ANALYSIS',
    QUESTION_ANSWERING = 'QUESTION_ANSWERING',
    OPTIMIZATION = 'OPTIMIZATION',
    TEMPLATE = 'TEMPLATE',
    TUTORIAL = 'TUTORIAL',
}

export interface CreateRecipeRequest {
    recommendedModelId?: number;
    title: string;
    description: string;
    promptTemplate: string;
    expectedOutput?: string;
    usageInstructions?: string;
    tags?: string[];
    steps?: string[];
    category: RecipeCategory;
}

export interface UpdateRecipeRequest
    extends CreateRecipeRequest {}

// Comment types
export interface Comment {
    id: number;
    authorId: number;
    authorNickname: string;
    authorProfileImage?: string;
    content: string;
    type: CommentType;
    targetId: number;
    parentId?: number;
    likeCount: number;
    createdAt: string;
    updatedAt: string;
    replies?: Comment[];
}

export enum CommentType {
    REVIEW = 'REVIEW',
    RECIPE = 'RECIPE',
}

export interface CreateCommentRequest {
    content: string;
    type: CommentType;
    targetId: number;
    parentId?: number;
}

// Interaction types
export enum LikeType {
    REVIEW = 'REVIEW',
    RECIPE = 'RECIPE',
    COMMENT = 'COMMENT',
}

export enum BookmarkType {
    REVIEW = 'REVIEW',
    RECIPE = 'RECIPE',
    MODEL = 'MODEL',
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            sorted: boolean;
            unsorted: boolean;
        };
    };
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    numberOfElements: number;
    size: number;
    number: number;
    empty: boolean;
}

// UI types
export interface SelectOption {
    value: string;
    label: string;
}

export interface TabItem {
    id: string;
    label: string;
    content: React.ReactNode;
}

export interface FilterOption {
    key: string;
    label: string;
    options: SelectOption[];
}

// Form types
export interface FormField {
    name: string;
    label: string;
    type:
        | 'text'
        | 'email'
        | 'password'
        | 'textarea'
        | 'select'
        | 'multiselect'
        | 'file';
    placeholder?: string;
    required?: boolean;
    options?: SelectOption[];
    validation?: any;
}

// Navigation types
export interface NavItem {
    label: string;
    href: string;
    icon?: React.ComponentType<any>;
    badge?: string | number;
    children?: NavItem[];
}

// Search types
export interface SearchFilters {
    category?: string;
    tags?: string[];
    rating?: number;
    dateRange?: {
        start: Date;
        end: Date;
    };
    sortBy?: 'newest' | 'oldest' | 'popular' | 'rating';
}

// Notification types
export interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    actionUrl?: string;
}
