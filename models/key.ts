import mongoose, {Document, Model, Schema} from 'mongoose';

export interface IKey extends Document {
    key: string;
    assignedTo: string | null;
}

const KeySchema: Schema<IKey> = new Schema({
    key: { type: String, required: true, unique: true },
    assignedTo: { type: String, default: null },
});

KeySchema.statics.createBulk = async function (keys: Array<{ key: string; assignedTo?: string | null }>) {
    try {
        return await this.insertMany(keys, {ordered: false});
    } catch (error) {
        console.error('Error during bulk creation:', error);
        throw error;
    }
};

export const Key = mongoose.model<IKey, Model<IKey> & { createBulk: (keys: Array<{ key: string; assignedTo?: string | null }>) => Promise<IKey[]> }>('Key', KeySchema);