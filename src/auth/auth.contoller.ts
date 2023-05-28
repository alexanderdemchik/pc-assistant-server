import Koa from 'koa';
import * as authService from './auth.service';
import { KoaContext } from '../types/koa';
import { IYandexLoginRequest } from './auth.types';

export const yandexLogin: Koa.Middleware<{}> = async (ctx: KoaContext<IYandexLoginRequest>) => {
    ctx.body = await authService.yandexLogin(ctx.request.body.accessToken);
    ctx.status = 200;
};
