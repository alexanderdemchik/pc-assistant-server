import { IYandexLoginResult } from './auth.types';
import { randomUUID } from 'crypto';
import { Token } from '../data/Token';
import { getUserInfo } from '../yandex/yandex.service';
import { createUserOrUpdateInfoUsingYandexInfo } from '../user/user.service';
import logger from '../logger';

const TOKEN_TTL_MS = 86400000 * 7;

export async function yandexLogin(accessToken: string): Promise<IYandexLoginResult> {
    const info = await getUserInfo(accessToken);

    logger.debug('%o', info);

    const user = await createUserOrUpdateInfoUsingYandexInfo(info);

    const token = randomUUID();

    await Token.create({ userId: user.id, token, expires: new Date(Date.now() + TOKEN_TTL_MS) });

    return {
        accessToken: token,
        user,
    };
}

export async function renewTokenLife(token: string) {
    const tokenModel = await Token.findOne({ token });

    tokenModel.expires = new Date(Date.now() + TOKEN_TTL_MS);

    tokenModel.save();
}
