import got from 'got';
import { IYandexUserInfo } from './yandex.types';

const YANDEX_USER_INFO_URL = 'https://login.yandex.ru/info?&format=json';

export function getUserInfo(accessToken: string): Promise<IYandexUserInfo> {
    return got
        .get(YANDEX_USER_INFO_URL, {
            headers: { Authorization: `OAuth ${accessToken}` },
        })
        .json<IYandexUserInfo>();
}
