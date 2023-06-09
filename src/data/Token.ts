import { Schema, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
interface IToken {
    userId: string;
    token: string;
    expires: Date;
}

// 2. Create a Schema corresponding to the document interface.
const tokenSchema = new Schema<IToken>({
    userId: { type: String, required: true, index: true },
    token: { type: String, required: true },
    expires: { type: Date, required: false, expires: 0 },
});

// 3. Create a Model.
export const Token = model<IToken>('Token', tokenSchema);
