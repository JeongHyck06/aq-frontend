// src/lib/oidc-client.ts
import {
    UserManager,
    WebStorageStateStore,
    UserManagerSettings,
} from 'oidc-client-ts';

let userManager: UserManager | null = null;

function createOidcConfig(): UserManagerSettings {
    if (typeof window === 'undefined') {
        return {
            authority: '',
            client_id: '',
            redirect_uri: '',
            response_type: 'code',
            scope: '',
            post_logout_redirect_uri: '',
            userStore: new WebStorageStateStore({
                store: {} as Storage,
            }),
        };
    }
    // 환경에 따른 리다이렉트 URI 설정
    const getRedirectUri = () => {
        const frontendUrl =
            process.env.NEXT_PUBLIC_FRONTEND_URL;
        const currentOrigin = window.location.origin;

        // 환경 감지
        const isLocalhost =
            currentOrigin.includes('localhost') ||
            currentOrigin.includes('127.0.0.1');
        const isVercelDeployment =
            currentOrigin.includes('vercel.app');
        const isProduction =
            process.env.NODE_ENV === 'production';

        let redirectUri;

        // 우선순위: 환경변수 > 현재 origin (HTTPS 강제)
        if (frontendUrl) {
            // 환경변수가 설정된 경우 사용
            redirectUri = `${frontendUrl}/oidc-callback`;
        } else {
            // 환경변수가 없는 경우 현재 origin 사용
            // Vercel에서는 자동으로 HTTPS가 적용됨
            redirectUri = `${currentOrigin}/oidc-callback`;
        }

        // 환경 판단
        let environment = 'unknown';
        if (isLocalhost) {
            environment = 'local';
        } else if (isVercelDeployment) {
            environment = 'vercel';
        } else if (isProduction) {
            environment = 'production';
        }

        console.log('OIDC 환경 감지:', {
            environment,
            frontendUrl,
            currentOrigin,
            isLocalhost,
            isVercelDeployment,
            isProduction,
            redirectUri,
            kakaoAppKey: process.env
                .NEXT_PUBLIC_KAKAO_APP_KEY
                ? '설정됨'
                : '설정안됨',
            nodeEnv: process.env.NODE_ENV,
            vercelEnv: process.env.VERCEL,
        });

        console.log('OIDC 설정 요약:', {
            authority: 'https://kauth.kakao.com',
            clientId: process.env.NEXT_PUBLIC_KAKAO_APP_KEY
                ? '설정됨'
                : '설정안됨',
            redirectUri,
            scope: 'openid account_email profile_nickname profile_image',
        });

        return redirectUri;
    };

    return {
        authority: 'https://kauth.kakao.com',
        client_id:
            process.env.NEXT_PUBLIC_KAKAO_APP_KEY || '',
        redirect_uri: getRedirectUri(),
        response_type: 'code',
        scope: [
            'openid',
            'account_email',
            'profile_nickname',
            'profile_image',
        ].join(' '),
        post_logout_redirect_uri:
            process.env.NEXT_PUBLIC_FRONTEND_URL ||
            window.location.origin,
        userStore: new WebStorageStateStore({
            store: window.localStorage,
        }),
    };
}

export function getUserManager(): UserManager {
    if (!userManager) {
        console.log('🔧 OIDC UserManager 초기화 시작...');
        const settings = createOidcConfig();
        userManager = new UserManager(settings);
        console.log('OIDC UserManager 초기화 완료');

        userManager.events.addAccessTokenExpiring(() => {
            console.warn('access token expiring');
        });

        userManager.events.addAccessTokenExpired(() => {
            console.warn('access token expired');
        });

        userManager.events.addSilentRenewError((error) => {
            console.error('Silent renew error:', error);
        });

        userManager.events.addUserSignedOut(() => {
            console.log('User signed out');
        });
    }
    return userManager;
}
