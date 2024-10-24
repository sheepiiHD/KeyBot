import { IUser} from "../models/user";
import {IKey, Key} from "../models/key";
import Logger from "./Logger";


export async function assignKey(discordId: string, type: string): Promise<string | null> {
    const user = await Key.findOne({ assignedTo: discordId, type }) as IUser | null;
    const keyDoc = await Key.findOne({ assignedTo: null, type }) as IKey | null;

    if (!keyDoc) return null;

    if(!user) {
        keyDoc.assignedTo = discordId;
        await keyDoc.save();
        await Logger.info(`<@${discordId}> claimed a **${type}** key.`);
    }

    return keyDoc.key;
}