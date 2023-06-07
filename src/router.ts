import Router from 'koa-router';
import * as auth from './auth/auth.contoller';
import * as yandex from './yandex/yandex.controller';
import { authMiddleware, requireAuth } from './auth/auth.middleware';
import { aliceErrorHanlingMiddleware } from './yandex/alice-error-handling.middleware';

const router = new Router();

router.get('/version', (ctx) => {
    ctx.body = process.env.npm_package_version;
});

router.get('/me', authMiddleware, requireAuth, (ctx) => {
    ctx.body = ctx.user;
    ctx.status = 200;
});

router.post('/auth/yandex', auth.yandexLogin);

router.post('/alice/webhook', aliceErrorHanlingMiddleware, yandex.handleAliceRequest);

export default router;
