'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    registerSchema,
    type RegisterFormData,
} from '@/utils/validation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/auth';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    ArrowRight,
    X,
    Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

const interestOptions = [
    '텍스트 생성',
    '코드 작성',
    '번역',
    '요약',
    '질문 답변',
    '창작',
    '분석',
    '멀티모달',
    '이미지 생성',
    '음성 처리',
    '데이터 분석',
    '마케팅',
    '교육',
    '연구',
    '비즈니스',
];

export default function RegisterPage() {
    const router = useRouter();
    const { register: registerUser, isLoading } =
        useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [selectedInterests, setSelectedInterests] =
        useState<string[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const password = watch('password', '');

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await registerUser({
                ...data,
                interests: selectedInterests,
            });
            toast.success('회원가입에 성공했습니다!');
            router.push('/');
        } catch (error: any) {
            toast.error(
                error.message || '회원가입에 실패했습니다.'
            );
        }
    };

    const toggleInterest = (interest: string) => {
        setSelectedInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((i) => i !== interest)
                : [...prev, interest]
        );
    };

    const getPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(password);
    const strengthLabels = [
        '매우 약함',
        '약함',
        '보통',
        '강함',
        '매우 강함',
    ];
    const strengthColors = [
        'error',
        'warning',
        'warning',
        'success',
        'success',
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 mb-6"
                    >
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                AI
                            </span>
                        </div>
                        <span className="text-2xl font-bold text-gradient">
                            AI 모델 비교
                        </span>
                    </Link>
                    <h2 className="text-3xl font-bold text-secondary-900">
                        회원가입
                    </h2>
                    <p className="mt-2 text-sm text-secondary-600">
                        이미 계정이 있으신가요?{' '}
                        <Link
                            href="/login"
                            className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                        >
                            로그인
                        </Link>
                    </p>
                </div>

                {/* Register Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">
                            새 계정 만들기
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit(
                                onSubmit
                            )}
                            className="space-y-6"
                        >
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="이메일"
                                    type="email"
                                    placeholder="이메일을 입력하세요"
                                    leftIcon={
                                        <Mail className="h-5 w-5" />
                                    }
                                    error={
                                        errors.email
                                            ?.message
                                    }
                                    {...register('email')}
                                />

                                <Input
                                    label="닉네임"
                                    type="text"
                                    placeholder="닉네임을 입력하세요"
                                    leftIcon={
                                        <User className="h-5 w-5" />
                                    }
                                    error={
                                        errors.nickname
                                            ?.message
                                    }
                                    {...register(
                                        'nickname'
                                    )}
                                />
                            </div>

                            <Input
                                label="비밀번호"
                                type={
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                placeholder="비밀번호를 입력하세요"
                                leftIcon={
                                    <Lock className="h-5 w-5" />
                                }
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="hover:text-secondary-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                }
                                error={
                                    errors.password?.message
                                }
                                {...register('password')}
                            />

                            {/* Password Strength */}
                            {password && (
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex-1 bg-secondary-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${
                                                    passwordStrength <=
                                                    2
                                                        ? 'bg-error-500'
                                                        : passwordStrength <=
                                                          3
                                                        ? 'bg-warning-500'
                                                        : 'bg-success-500'
                                                }`}
                                                style={{
                                                    width: `${
                                                        (passwordStrength /
                                                            5) *
                                                        100
                                                    }%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm text-secondary-600">
                                            {strengthLabels[
                                                passwordStrength -
                                                    1
                                            ] ||
                                                '매우 약함'}
                                        </span>
                                    </div>
                                    <div className="text-xs text-secondary-500">
                                        비밀번호는 8자 이상,
                                        대소문자, 숫자,
                                        특수문자를 포함해야
                                        합니다.
                                    </div>
                                </div>
                            )}

                            <Textarea
                                label="자기소개 (선택사항)"
                                placeholder="간단한 자기소개를 작성해주세요"
                                rows={3}
                                error={errors.bio?.message}
                                {...register('bio')}
                            />

                            {/* Interests */}
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-3">
                                    관심 분야 (선택사항)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {interestOptions.map(
                                        (interest) => (
                                            <button
                                                key={
                                                    interest
                                                }
                                                type="button"
                                                onClick={() =>
                                                    toggleInterest(
                                                        interest
                                                    )
                                                }
                                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                                    selectedInterests.includes(
                                                        interest
                                                    )
                                                        ? 'bg-primary-100 text-primary-800 border border-primary-200'
                                                        : 'bg-secondary-100 text-secondary-700 border border-secondary-200 hover:bg-secondary-200'
                                                }`}
                                            >
                                                {interest}
                                                {selectedInterests.includes(
                                                    interest
                                                ) && (
                                                    <X className="ml-1 h-3 w-3" />
                                                )}
                                            </button>
                                        )
                                    )}
                                </div>
                                <p className="mt-2 text-xs text-secondary-500">
                                    관심 분야를 선택하면
                                    맞춤형 콘텐츠를 추천받을
                                    수 있습니다.
                                </p>
                            </div>

                            {/* Terms */}
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        required
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label
                                        htmlFor="terms"
                                        className="text-secondary-600"
                                    >
                                        <Link
                                            href="/terms"
                                            className="text-primary-600 hover:text-primary-500"
                                        >
                                            이용약관
                                        </Link>
                                        과{' '}
                                        <Link
                                            href="/privacy"
                                            className="text-primary-600 hover:text-primary-500"
                                        >
                                            개인정보처리방침
                                        </Link>
                                        에 동의합니다.
                                    </label>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? '회원가입 중...'
                                    : '회원가입'}
                                {!isLoading && (
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                )}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-secondary-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-secondary-500">
                                        또는
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Social Register */}
                        <div className="mt-6 space-y-3">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() =>
                                    toast.error(
                                        '소셜 로그인은 준비 중입니다.'
                                    )
                                }
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Google로 계속하기
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() =>
                                    toast.error(
                                        '소셜 로그인은 준비 중입니다.'
                                    )
                                }
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook으로 계속하기
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
