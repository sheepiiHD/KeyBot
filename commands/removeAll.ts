import {Client, CommandInteraction} from 'discord.js';
import { assignKey } from '../utils/assignKey';
import {SlashCommandBuilder} from "@discordjs/builders";
import {Key} from "../models/key";
import {User} from "../models/user";
import {ADMIN_ID} from "../bot";


export const data = new SlashCommandBuilder()
    .setName('removeallkeys')
    .setDescription('Allows admins to remove all keys')
    .toJSON()

export const execute = async (client: Client, commandName: string, interaction: CommandInteraction | any) => {
    const key = await assignKey(interaction.user.id);

    if (!ADMIN_ID.includes(interaction.user.id)) {
        await interaction.reply('You do not have permission to use this command.');
        return;
    }

    if (key) {
        await Key.deleteMany({});
        await User.deleteMany({});
        await interaction.reply({content: `All keys have been removed!`, ephemeral: true});
    } else {
        await interaction.reply({content: `No keys to remove`, ephemeral: true});
    }
}