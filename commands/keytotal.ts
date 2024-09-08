import {Client, CommandInteraction} from 'discord.js';
import {SlashCommandBuilder} from "@discordjs/builders";
import {ADMIN_ID} from "../bot";
import {Key} from "../models/key";


export const data = new SlashCommandBuilder()
    .setName('adminkeytotal')
    .setDescription('Get your key!')
    .toJSON()

export const execute = async (client: Client, commandName: string, interaction: CommandInteraction | any) => {

    if (!ADMIN_ID.includes(interaction.user.id)) {
        await interaction.reply('You do not have permission to use this command.');
        return;
    }

    const unassignedKeys = await Key.find({ assignedTo: null });
    const assignedKeys = await Key.find({ assignedTo: { $ne: null } });
    await interaction.reply(`Keys given out: ${assignedKeys.length}\nKeys left unclaimed: ${unassignedKeys.length}`);
}