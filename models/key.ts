import mongoose, {Document, Model, Schema} from 'mongoose';

export interface IKey extends Document {
    key: string;
    assignedTo: string | null;
    type: string;
}

const KeySchema: Schema<IKey> = new Schema({
    key: { type: String, required: true, unique: true },
    type: {type: String, default: 'key' },
    assignedTo: { type: String, default: null },
});

KeySchema.statics.createBulk = async function (keys: Array<{ key: string; assignedTo?: string | null, type: string }>) {
    try {
        return await this.insertMany(keys, {ordered: false});
    } catch (error) {
        console.error('Error during bulk creation:', error);
        throw error;
    }
};

KeySchema.statics.claimBulk = async function (type: string, assignedTo: string, limit: number) {
    try {
        const availableKeys = await this.find({ type, assignedTo: null }).limit(limit);

        if (availableKeys.length < limit) {
            return {
                updatedCount: 0,
                keys: [],
                message: `No available keys.`,
            };
        }

        const keysToClaim = availableKeys.map((keyDoc: IKey) => keyDoc._id);
        const result = await this.updateMany(
            { _id: { $in: keysToClaim } },
            { $set: { assignedTo } }
        );

        const claimedKeys = availableKeys.map((keyDoc: IKey) => keyDoc.key);

        return {
            updatedCount: result.modifiedCount,
            keys: claimedKeys,
            message: `Successfully claimed ${result.modifiedCount} key(s) out of ${limit}.\n**Please Note:** These cannot be retrieved back from the database once claimed, so save them somewhere.`,
        };
    } catch (error) {
        console.error('Error during bulk claiming:', error);
        throw error;
    }
};

export const Key = mongoose.model<IKey, Model<IKey> & {
    createBulk: (keys: Array<{ key: string; assignedTo?: string | null; type: string }>) => Promise<IKey[]>,
    claimBulk: (type: string, assignedTo: string, limit: number) => Promise<{ updatedCount: number, keys: string[], message: string }>
}>('Key', KeySchema);