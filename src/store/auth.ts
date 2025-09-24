import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse } from '@/types';
import apiClient from '@/lib/api';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (
        email: string,
        password: string
    ) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
    refreshToken: () => Promise<void>;
    updateUser: (user: User) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (
                email: string,
                password: string
            ) => {
                set({ isLoading: true });
                try {
                    const response: AuthResponse =
                        await apiClient.login(
                            email,
                            password
                        );
                    set({
                        user: response.user,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            register: async (userData: any) => {
                set({ isLoading: true });
                try {
                    const response: AuthResponse =
                        await apiClient.register(userData);
                    set({
                        user: response.user,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            logout: () => {
                apiClient.logout();
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            },

            refreshToken: async () => {
                try {
                    const response: AuthResponse =
                        await apiClient.refreshToken();
                    set({
                        user: response.user,
                        isAuthenticated: true,
                    });
                } catch (error) {
                    get().logout();
                    throw error;
                }
            },

            updateUser: (user: User) => {
                set({ user });
            },

            setLoading: (loading: boolean) => {
                set({ isLoading: loading });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
