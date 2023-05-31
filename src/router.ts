import Router from 'koa-router';
import * as auth from './auth/auth.contoller';
import { requireAuth } from './auth/auth.middleware';

const router = new Router();

router.get('/version', (ctx) => {
    ctx.body = process.env.npm_package_version;
});

router.get('/user', requireAuth, (ctx) => {
    //@ts-ignore
    ctx.body = ctx.user;
    ctx.status = 200;
})

// auth
router.post('/auth/yandex', auth.yandexLogin);

router.post('/alice/webhook', (ctx) => {
    console.log(ctx.body);
    console.log(ctx.headers);
});

export default router;
