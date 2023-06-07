import { IAliceResponse } from './yandex.types';

export function buildAliceResponse(
    text: string,
    otherOptions: { directives?: Record<string, any>; user_state_update?: any; tts?: string } = {}
): IAliceResponse {
    const { tts, directives, user_state_update } = otherOptions;
    return {
        response: {
            text,
            tts: tts || text,
            end_session: false,
            directives,
        },
        user_state_update,
        version: '1.0',
    };
}
