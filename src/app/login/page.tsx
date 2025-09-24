'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    loginSchema,
    type LoginFormData,
} from '@/utils/validation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';
import { useAuthStore } from '@/store/auth';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoading } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data.email, data.password);
            toast.success('로그인에 성공했습니다!');
            router.push('/');
        } catch (error: any) {
            toast.error(
                error.message || '로그인에 실패했습니다.'
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
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
                        로그인
                    </h2>
                    <p className="mt-2 text-sm text-secondary-600">
                        계정이 없으신가요?{' '}
                        <Link
                            href="/register"
                            className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                        >
                            회원가입
                        </Link>
                    </p>
                </div>

                {/* Login Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">
                            계정에 로그인
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit(
                                onSubmit
                            )}
                            className="space-y-6"
                        >
                            <Input
                                label="이메일"
                                type="email"
                                placeholder="이메일을 입력하세요"
                                leftIcon={
                                    <Mail className="h-5 w-5" />
                                }
                                error={
                                    errors.email?.message
                                }
                                {...register('email')}
                            />

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

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="ml-2 block text-sm text-secondary-600"
                                    >
                                        로그인 상태 유지
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <Link
                                        href="/forgot-password"
                                        className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                                    >
                                        비밀번호를
                                        잊으셨나요?
                                    </Link>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? '로그인 중...'
                                    : '로그인'}
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

                        {/* Social Login */}
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

                {/* Footer */}
                <div className="text-center text-sm text-secondary-500">
                    로그인함으로써{' '}
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
                </div>
            </div>
        </div>
    );
}
