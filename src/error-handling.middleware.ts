import logger from './logger';
import { Middleware } from 'koa';

export const errorHanlingMiddleware: Middleware = async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        logger.error(`error %o`, e?.message);
        ctx.body = {};
        ctx.status = 400;
    }
};
