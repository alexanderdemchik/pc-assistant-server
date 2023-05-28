import { UserDto } from '../data/User';

export interface IYandexLoginRequest {
    accessToken: string;
}

export interface IYandexLoginResult {
    accessToken: string;
    user: UserDto;
}

export interface IYandexUserInfo {
    login: string;
    id: string;
    display_name: string;
}
