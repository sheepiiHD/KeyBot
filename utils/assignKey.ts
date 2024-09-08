import {User, IUser} from "../models/user";
import {IKey, Key} from "../models/key";


export async function assignKey(discordId: string): Promise<string | null> {
    const user = await User.findOne({ discordId }) as IUser | null;

    if (user && user.key) {
        return user.key;
    }

    const keyDoc = await Key.findOne({ assignedTo: null }) as IKey | null;
    if (!keyDoc) return null;

    keyDoc.assignedTo = discordId;
    await keyDoc.save();

    if (user) {
        user.key = keyDoc.key;
        await user.save();
    } else {
        const newUser = new User({ discordId, key: keyDoc.key });
        await newUser.save();
    }

    return keyDoc.key;
}