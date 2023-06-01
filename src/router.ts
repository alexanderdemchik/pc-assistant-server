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
});

// auth
router.post('/auth/yandex', auth.yandexLogin);

router.post('/alice/webhook', (ctx) => {
    console.log(ctx.body);
    console.log(ctx.headers);
    ctx.body = {
        response: {
            text: 'Здравствуйте! Это мы, хороводоведы.',
            tts: 'Здравствуйте! Это мы, хоров+одо в+еды.',
            card: {
                type: '...',
            },
            buttons: [
                {
                    title: 'Надпись на кнопке',
                    payload: {},
                    url: 'https://example.com/',
                    hide: true,
                },
            ],
            end_session: false,
            directives: {},
        },
        session_state: {
            value: 10,
        },
        user_state_update: {
            value: 42,
        },
        application_state: {
            value: 37,
        },
        analytics: {
            events: [
                {
                    name: 'custom event',
                },
                {
                    name: 'another custom event',
                    value: {
                        field: 'some value',
                        'second field': {
                            'third field': 'custom value',
                        },
                    },
                },
            ],
        },
        version: '1.0',
    };
    ctx.status = 200;
});

router.get('/alice/webhook', (ctx) => {
    console.log(ctx.body);
    console.log(ctx.headers);
    ctx.body = { text: 'good' };
    ctx.status = 200;
});

export default router;
