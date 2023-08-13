import logger from './logger';
import { Middleware } from 'koa';

export const errorHanlingMiddleware: Middleware = async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        logger.error(`Error during hanling request from alice %o`, e?.message);
        ctx.body = {};
        ctx.status = 400;
    }
};
