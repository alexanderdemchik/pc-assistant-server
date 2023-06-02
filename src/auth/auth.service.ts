import got from 'got';
import { IYandexLoginResult } from './auth.types';
import { User } from '../data/User';
import { randomUUID } from 'crypto';
import { Token } from '../data/Token';
import { getUserInfo } from '../yandex/yandex.service';

const TOKEN_TTL_MS = 86400000 * 7;

export async function yandexLogin(accessToken: string): Promise<IYandexLoginResult> {
    const info = await getUserInfo(accessToken);
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
