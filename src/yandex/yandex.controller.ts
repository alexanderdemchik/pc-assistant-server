import { Middleware } from 'koa';
import { KoaContext } from '../types/koa';
import { IAliceRequest, IYandexUserInfo } from './yandex.types';
import * as yandexService from './yandex.service';
import * as userService from '../user/user.service';
import logger from '../logger';
import { buildAliceResponse } from './yandex.helper';

export const handleAliceRequest: Middleware = async (ctx: KoaContext<IAliceRequest>) => {
    logger.info('handle alice webhook request %o', ctx);

    if (ctx.headers.authorization) {
        let userInfo: IYandexUserInfo;

        const userIdFromSession = ctx.request.body?.state?.user?.userId;
        let userId = userIdFromSession;
        if (!userIdFromSession) {
            try {
                userInfo = await yandexService.getUserInfo(ctx.headers.authorization.replace('Bearer ', ''));

                userId = (await userService.createUserOrUpdateInfoUsingYandexInfo(userInfo)).id;
            } catch (e) {
                logger.error(e);
                ctx.body = buildAliceResponse('Произошла ошибка при валидации пользователя');
            }
        }

        ctx.body = await yandexService.handleAliceRequest(ctx.request.body, userId);

        if (!userIdFromSession) {
            ctx.body.user_state_update = {
                userId,
            };
        }
    } else {
        ctx.body = buildAliceResponse('Необходима авторизация в навыке', {
            directives: {
                start_account_linking: {},
            },
        });
    }

    ctx.status = 200;
};
