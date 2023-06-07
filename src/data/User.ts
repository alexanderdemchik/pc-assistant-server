import { Schema, model, Model } from 'mongoose';

export interface IDevice {
    id: string;
    name?: string;
    default?: boolean;
}

export interface IUser {
    name: string;
    email: string;
    yandexId: string;
    devices: IDevice[];
}

interface IUserMethods {
    toDto(): UserDto;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
    name: { type: String, required: false },
    email: { type: String, required: false },
    yandexId: { type: String, required: true, unique: true },
    devices: [
        {
            id: String,
            name: String,
            default: Boolean,
        },
    ],
});

userSchema.method('toDto', function toDto(): UserDto {
    return {
        id: this.id,
        name: this.name,
        email: this.email,
        yandexId: this.yandexId,
        devices: this.devices,
    };
});

export const User = model<IUser, UserModel>('User', userSchema);

export interface UserDto {
    id: string;
    name: string;
    email: string;
    yandexId: string;
    devices: IDevice[];
}
