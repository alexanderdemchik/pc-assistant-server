import axios from 'axios';
import { IAliceRequest, IYandexUserInfo } from './yandex.types';
import { getConnectedUserDevicesIds, sendCommandToDevice } from '../ws';
import { buildAliceResponse } from './yandex.helper';
import { getUserById } from '../user/user.service';
import logger from '../logger';

const YANDEX_USER_INFO_URL = 'https://login.yandex.ru/info';

export async function getUserInfo(accessToken: string): Promise<IYandexUserInfo> {
    const res = await axios.post(
        `${YANDEX_USER_INFO_URL}`,
        {},
        {
            headers: {
                Authorization: 'OAuth ' + accessToken,
            },
        }
    );

    logger.debug('%o', res.data);

    return res.data;
}

export async function handleAliceRequest(body: IAliceRequest, userId: string): Promise<any> {
    logger.info('%o', body);
    const connectedDevices = await getConnectedUserDevicesIds(userId);
    const user = await getUserById(userId);

    if (!connectedDevices.length) {
        return buildAliceResponse('Упс! Мы не обнаружили подключенных устройств');
    }

    let deviceToSendCommand = connectedDevices[0];

    if (connectedDevices.length > 1) {
        const defaultDevice = user.devices.find((device) => device.default);

        const connectedDefaultDeviceId = connectedDevices.find((id) => id === defaultDevice.id);

        if (connectedDefaultDeviceId) {
            deviceToSendCommand = connectedDefaultDeviceId;
        }
    }

    const command = body.request.command;

    logger.debug(`send command to deviceId ${deviceToSendCommand} userId ${userId} command ${command}`);
    sendCommandToDevice(deviceToSendCommand, { command });

    return buildAliceResponse('');
}
