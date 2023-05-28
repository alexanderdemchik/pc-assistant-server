import { Schema, model, Model } from 'mongoose';

export interface IUser {
    name: string;
    email: string;
    yandexId: string;
}

interface IUserMethods {
    toDto(): UserDto;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
    name: { type: String, required: false },
    email: { type: String, required: false },
    yandexId: { type: String, required: true, unique: true },
});

userSchema.method('toDto', function toDto(): UserDto {
    return {
        _id: this._id,
        name: this.name,
        email: this.email,
        yandexId: this.yandexId,
    };
});

export const User = model<IUser, UserModel>('User', userSchema);

export interface UserDto {
    _id: string;
    name: string;
    email: string;
    yandexId: string;
}
