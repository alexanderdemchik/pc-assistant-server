import { Token } from '../data/Token';
import { IDevice, User, UserDto } from '../data/User';
import { IYandexUserInfo } from '../yandex/yandex.types';

export async function getUserByToken(token: string): Promise<UserDto> {
    const { userId } = await Token.findOne({ token });
    return User.findById(userId);
}

export async function getUserByYandexId(yandexId: string) {
    return User.findOne({ yandexId });
}

export async function getUserById(id: string) {
    return User.findById(id);
}

export async function addDeviceToUser(userId: string, device: IDevice) {
    const userModel = await User.findById(userId);

    userModel.devices = [...userModel.devices, { ...device, default: !userModel.devices.length }];

    await userModel.save();
}

export async function createUserOrUpdateInfoUsingYandexInfo(info: IYandexUserInfo) {
    let user = await User.findOne({ yandexId: info.id });

    if (!user) {
        user = await User.create({ yandexId: info.id, name: info.display_name });
    } else {
        user.name = info.display_name;
        user.save();
    }

    return user.toDto();
}
