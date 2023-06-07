export interface IYandexUserInfo {
    login: string;
    id: string;
    display_name: string;
}

export interface IAliceRequest {
    request: {
        command: string;
    };
    state: {
        user?: {
            userId?: string;
        };
    };
}

export interface IAliceResponse {
    version: string;
    response: {
        text: string;
        tts: string;
        end_session: boolean;
        directives: Record<string, any>;
    };
    user_state_update?: Record<string, string | number>;
}
