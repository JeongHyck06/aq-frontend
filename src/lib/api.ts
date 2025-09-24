import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'http://localhost:8080';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                console.error('API Error:', error);

                if (
                    error.code === 'NETWORK_ERROR' ||
                    error.message === 'Network Error'
                ) {
                    toast.error(
                        '네트워크 연결을 확인해주세요. 백엔드 서버가 실행 중인지 확인하세요.'
                    );
                    return Promise.reject(error);
                }

                if (error.response?.status === 401) {
                    this.clearToken();
                    window.location.href = '/login';
                    toast.error('로그인이 필요합니다');
                } else if (error.response?.status >= 500) {
                    toast.error('서버 오류가 발생했습니다');
                } else if (error.response?.data?.message) {
                    toast.error(
                        error.response.data.message
                    );
                } else if (error.response?.status === 404) {
                    toast.error(
                        '요청한 리소스를 찾을 수 없습니다'
                    );
                } else {
                    toast.error(
                        '알 수 없는 오류가 발생했습니다'
                    );
                }
                return Promise.reject(error);
            }
        );
    }

    private getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('accessToken');
    }

    private setToken(token: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem('accessToken', token);
    }

    private clearToken(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }

    async get<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response: AxiosResponse<T> =
            await this.client.get(url, config);
        return response.data;
    }

    async post<T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response: AxiosResponse<T> =
            await this.client.post(url, data, config);
        return response.data;
    }

    async put<T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response: AxiosResponse<T> =
            await this.client.put(url, data, config);
        return response.data;
    }

    async delete<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response: AxiosResponse<T> =
            await this.client.delete(url, config);
        return response.data;
    }

    async patch<T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response: AxiosResponse<T> =
            await this.client.patch(url, data, config);
        return response.data;
    }

    // Auth methods
    async login(email: string, password: string) {
        const response = await this.post(
            '/api/auth/login',
            { email, password }
        );
        if (response.accessToken) {
            this.setToken(response.accessToken);
            localStorage.setItem(
                'refreshToken',
                response.refreshToken
            );
        }
        return response;
    }

    async register(userData: any) {
        const response = await this.post(
            '/api/auth/register',
            userData
        );
        if (response.accessToken) {
            this.setToken(response.accessToken);
            localStorage.setItem(
                'refreshToken',
                response.refreshToken
            );
        }
        return response;
    }

    async refreshToken() {
        const refreshToken =
            localStorage.getItem('refreshToken');
        if (!refreshToken)
            throw new Error('No refresh token');

        const response = await this.post(
            '/api/auth/refresh',
            { refreshToken }
        );
        if (response.accessToken) {
            this.setToken(response.accessToken);
            localStorage.setItem(
                'refreshToken',
                response.refreshToken
            );
        }
        return response;
    }

    logout() {
        this.clearToken();
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    // Review methods
    async getReviews(page = 0, size = 20) {
        return this.get(
            `/api/reviews?page=${page}&size=${size}`
        );
    }

    async getReview(reviewId: number) {
        return this.get(`/api/reviews/${reviewId}`);
    }

    async createReview(reviewData: any) {
        return this.post('/api/reviews', reviewData);
    }

    async updateReview(reviewId: number, reviewData: any) {
        return this.put(
            `/api/reviews/${reviewId}`,
            reviewData
        );
    }

    async deleteReview(reviewId: number) {
        return this.delete(`/api/reviews/${reviewId}`);
    }

    async getReviewsByModel(
        modelId: number,
        page = 0,
        size = 20
    ) {
        return this.get(
            `/api/reviews/model/${modelId}?page=${page}&size=${size}`
        );
    }

    async getReviewsByUser(
        userId: number,
        page = 0,
        size = 20
    ) {
        return this.get(
            `/api/reviews/user/${userId}?page=${page}&size=${size}`
        );
    }

    async searchReviews(
        keyword: string,
        page = 0,
        size = 20
    ) {
        return this.get(
            `/api/reviews/search?keyword=${encodeURIComponent(
                keyword
            )}&page=${page}&size=${size}`
        );
    }

    async getPopularReviews(page = 0, size = 20) {
        return this.get(
            `/api/reviews/popular?page=${page}&size=${size}`
        );
    }
}

export const apiClient = new ApiClient();
export default apiClient;
