import Koa from 'koa';
import { Token } from '../data/Token';
import { User } from '../data/User';

export const authMiddleware: Koa.Middleware = async (ctx, next) => {
    const BEARER_PREFIX = 'Bearer ';
    const authHeader = ctx.headers['authorization'];

    if (authHeader) {
        const token = authHeader.replace(BEARER_PREFIX, '');

        try {
            const dbToken = await Token.findOne({ token }).orFail();
            const user = await User.findById(dbToken.userId).orFail();
            ctx.user = user.toDto();
        } catch (err) {
            console.log(err);
        }
    }

    await next();
};
