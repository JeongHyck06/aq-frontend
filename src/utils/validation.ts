import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
    email: z
        .string()
        .email('올바른 이메일 형식이 아닙니다'),
    password: z.string().min(1, '비밀번호를 입력해주세요'),
});

export const registerSchema = z.object({
    email: z
        .string()
        .email('올바른 이메일 형식이 아닙니다'),
    password: z
        .string()
        .min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
    nickname: z
        .string()
        .min(2, '닉네임은 최소 2자 이상이어야 합니다')
        .max(20, '닉네임은 20자 이하여야 합니다'),
    bio: z
        .string()
        .max(500, '자기소개는 500자 이하여야 합니다')
        .optional(),
    interests: z.array(z.string()).optional(),
});

// Review validation schemas
export const createReviewSchema = z.object({
    modelId: z.number().min(1, '모델을 선택해주세요'),
    title: z
        .string()
        .min(1, '제목을 입력해주세요')
        .max(200, '제목은 200자 이하여야 합니다'),
    content: z
        .string()
        .min(1, '내용을 입력해주세요')
        .max(5000, '내용은 5000자 이하여야 합니다'),
    rating: z
        .number()
        .min(1, '평점을 선택해주세요')
        .max(5, '평점은 5점 이하여야 합니다'),
    useCase: z
        .string()
        .max(200, '사용 사례는 200자 이하여야 합니다')
        .optional(),
    inputExample: z
        .string()
        .max(2000, '입력 예시는 2000자 이하여야 합니다')
        .optional(),
    outputExample: z
        .string()
        .max(2000, '출력 예시는 2000자 이하여야 합니다')
        .optional(),
    tags: z.array(z.string()).optional(),
    screenshotUrl: z
        .string()
        .url('올바른 URL 형식이 아닙니다')
        .optional(),
});

// Recipe validation schemas
export const createRecipeSchema = z.object({
    recommendedModelId: z.number().optional(),
    title: z
        .string()
        .min(1, '제목을 입력해주세요')
        .max(200, '제목은 200자 이하여야 합니다'),
    description: z
        .string()
        .min(1, '설명을 입력해주세요')
        .max(2000, '설명은 2000자 이하여야 합니다'),
    promptTemplate: z
        .string()
        .min(1, '프롬프트 템플릿을 입력해주세요')
        .max(
            10000,
            '프롬프트 템플릿은 10000자 이하여야 합니다'
        ),
    expectedOutput: z
        .string()
        .max(2000, '기대 출력은 2000자 이하여야 합니다')
        .optional(),
    usageInstructions: z
        .string()
        .max(1000, '사용 방법은 1000자 이하여야 합니다')
        .optional(),
    tags: z.array(z.string()).optional(),
    steps: z.array(z.string()).optional(),
    category: z.enum([
        'TRANSLATION',
        'SUMMARIZATION',
        'CODE_GENERATION',
        'CREATIVE_WRITING',
        'ANALYSIS',
        'QUESTION_ANSWERING',
        'OPTIMIZATION',
        'TEMPLATE',
        'TUTORIAL',
    ]),
});

// Comment validation schemas
export const createCommentSchema = z.object({
    content: z
        .string()
        .min(1, '댓글 내용을 입력해주세요')
        .max(1000, '댓글은 1000자 이하여야 합니다'),
    type: z.enum(['REVIEW', 'RECIPE']),
    targetId: z.number().min(1, '대상 ID가 필요합니다'),
    parentId: z.number().optional(),
});

// Profile validation schemas
export const updateProfileSchema = z.object({
    nickname: z
        .string()
        .min(2, '닉네임은 최소 2자 이상이어야 합니다')
        .max(20, '닉네임은 20자 이하여야 합니다')
        .optional(),
    bio: z
        .string()
        .max(500, '자기소개는 500자 이하여야 합니다')
        .optional(),
    profileImage: z
        .string()
        .url('올바른 URL 형식이 아닙니다')
        .optional(),
    interests: z.array(z.string()).optional(),
});

// Search validation schemas
export const searchSchema = z.object({
    keyword: z
        .string()
        .min(1, '검색어를 입력해주세요')
        .max(100, '검색어는 100자 이하여야 합니다'),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    sortBy: z
        .enum(['newest', 'oldest', 'popular', 'rating'])
        .optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<
    typeof registerSchema
>;
export type CreateReviewFormData = z.infer<
    typeof createReviewSchema
>;
export type CreateRecipeFormData = z.infer<
    typeof createRecipeSchema
>;
export type CreateCommentFormData = z.infer<
    typeof createCommentSchema
>;
export type UpdateProfileFormData = z.infer<
    typeof updateProfileSchema
>;
export type SearchFormData = z.infer<typeof searchSchema>;
