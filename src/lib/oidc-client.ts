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
    return {
        authority: 'https://kauth.kakao.com',
        client_id:
            process.env.NEXT_PUBLIC_KAKAO_APP_KEY || '',
        redirect_uri: `${window.location.origin}/oidc-callback`,
        response_type: 'code',
        scope: [
            'openid',
            'account_email',
            'profile_nickname',
            'profile_image',
        ].join(' '),
        post_logout_redirect_uri: window.location.origin,
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
    }
    return userManager;
}
