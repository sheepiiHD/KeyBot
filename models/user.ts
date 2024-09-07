import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    discordId: string;
    key: string | null;
}

const UserSchema: Schema<IUser> = new Schema({
    discordId: { type: String, required: true, unique: true },
    key: { type: String, default: null },
});

export const User = mongoose.model<IUser>('User', UserSchema);