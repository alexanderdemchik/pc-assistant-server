import logger from './logger';
import { Middleware } from 'koa';

export const errorHanlingMiddleware: Middleware = async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        logger.error(`error %o`, e?.message);
        logger.error(`error %o`, e?.response);
        logger.error(`error %o`, e?.status);
        ctx.body = {};
        ctx.status = 400;
    }
};
