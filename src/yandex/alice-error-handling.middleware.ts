import logger from '../logger';
import { Middleware } from 'koa';
import { buildAliceResponse } from './yandex.helper';

export const aliceErrorHanlingMiddleware: Middleware = async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        logger.error(`Error during hanling request from alice %o`, e);
        ctx.body = buildAliceResponse('Упс! Произошла неизвестная ошибка, попробуйте позже');
        ctx.status = 200;
    }
};
