import got from 'got';
import { IYandexLoginResult, IYandexUserInfo } from './auth.types';
import { User } from '../data/User';
import { randomUUID } from 'crypto';
import { Token } from '../data/Token';

const YANDEX_USER_INFO_URL = 'https://login.yandex.ru/info?&format=json';
const TOKEN_TTL_MS = 86400000 * 7;

export async function yandexLogin(accessToken: string): Promise<IYandexLoginResult> {
    const info = await got
        .get(YANDEX_USER_INFO_URL, {
            headers: { Authorization: `OAuth ${accessToken}` },
        })
        .json<IYandexUserInfo>();

    let user = await User.findOne({ yandexId: info.id });

    if (!user) {
        user = await User.create({ yandexId: info.id, name: info.display_name });
    } else {
        user.name = info.display_name;
        user.save();
    }

    const token = randomUUID();

    await Token.create({ userId: user._id, token, expires: new Date(Date.now() + TOKEN_TTL_MS) });

    return {
        accessToken: token,
        user: user.toDto(),
    };
}
