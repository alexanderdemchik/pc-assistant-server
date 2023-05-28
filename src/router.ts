import Router from 'koa-router';
import * as auth from './auth/auth.contoller';

const router = new Router();

router.post('/auth/yandex', auth.yandexLogin);

export default router;
