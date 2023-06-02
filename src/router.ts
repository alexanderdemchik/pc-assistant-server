import Router from 'koa-router';
import * as auth from './auth/auth.contoller';
import { requireAuth } from './auth/auth.middleware';
import { getUserInfo } from './yandex/yandex.service';
import { IYandexUserInfo } from './yandex/yandex.types';
import { io } from './wsinit';

const router = new Router();

router.get('/version', (ctx) => {
    ctx.body = process.env.npm_package_version;
});

router.get('/user', requireAuth, (ctx) => {
    //@ts-ignore
    ctx.body = ctx.user;
    ctx.status = 200;
});

// auth
router.post('/auth/yandex', auth.yandexLogin);

router.post('/alice/webhook', async (ctx) => {
    if (ctx.headers.authorization) {
        let userInfo: IYandexUserInfo;
        console.log(ctx.request.body);
        //@ts-ignore
        if (!ctx.request.body?.state?.user?.userId) {
            try {
                userInfo = await getUserInfo(ctx.headers.authorization.replace('Bearer ', ''));
            } catch (e) {}
        }

        const userId = userInfo.id || ctx.body.state.user.userId;
        console.log(userId);
        //@ts-ignore
        if (ctx.request?.body?.request?.command?.includes('выключи')) {
            console.log('sockets');
            const sockets = await io.fetchSockets();
            console.log(sockets[0]);
            sockets[0]?.emit('command', { name: 'shutdown' });
        }

        ctx.body = {
            response: {
                text: 'красавчик',
                tts: 'краааасавчик',
            },
            version: '1.0',
        };

        if (userInfo) {
            ctx.body.user_state_update = {
                userId: userInfo.id,
            };
        }
    } else {
        ctx.body = {
            response: {
                text: 'необходима авторизация',
                tts: 'необходима авторизация',
                end_session: false,
                directives: {
                    start_account_linking: {},
                },
            },
            version: '1.0',
        };
    }

    ctx.status = 200;
});

export default router;
