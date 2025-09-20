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

        // 다양한 방법으로 환경 감지
        const isLocalhost =
            currentOrigin.includes('localhost') ||
            currentOrigin.includes('127.0.0.1');
        const isVercelDeployment =
            currentOrigin.includes('vercel.app');
        const isProduction =
            process.env.NODE_ENV === 'production';
        const isVercelEnv = process.env.VERCEL === '1'; // Vercel에서 자동 설정

        let redirectUri;
        if (frontendUrl) {
            redirectUri = `${frontendUrl}/oidc-callback`;
        } else if (isVercelDeployment) {
            // Vercel 배포 환경에서 환경변수가 없는 경우 현재 origin 사용
            redirectUri = `${currentOrigin}/oidc-callback`;
        } else {
            // 로컬 개발 환경
            redirectUri = `${currentOrigin}/oidc-callback`;
        }

        // 환경 판단
        let environment = 'unknown';
        if (isLocalhost) {
            environment = 'local';
        } else if (isVercelDeployment || isVercelEnv) {
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
            isVercelEnv,
            redirectUri,
            kakaoAppKey: process.env
                .NEXT_PUBLIC_KAKAO_APP_KEY
                ? '설정됨'
                : '설정안됨',
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
        const settings = createOidcConfig();
        userManager = new UserManager(settings);

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
