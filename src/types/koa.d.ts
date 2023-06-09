import { Context, Request } from 'koa';
import { UserDto } from '../data/User';

interface KoaRequest<RequestBody = any> extends Request {
    body?: RequestBody;
}

export interface KoaContext<RequestBody = any, ResponseBody = any> extends Context {
    request: KoaRequest<RequestBody>;
    body: ResponseBody;
}

// eslint-disable-next-line
export interface KoaResponseContext<ResponseBody> extends KoaContext<any, ResponseBody> {}

declare module 'koa' {
    interface BaseContext {
        user: UserDto;
    }
}
