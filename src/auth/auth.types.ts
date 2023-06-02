import { UserDto } from '../data/User';

export interface IYandexLoginRequest {
    accessToken: string;
}

export interface IYandexLoginResult {
    accessToken: string;
    user: UserDto;
}
