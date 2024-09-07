import {Client, CommandInteraction} from 'discord.js';
import { assignKey } from '../utils/assignKey';
import {SlashCommandBuilder} from "@discordjs/builders";


export const data = new SlashCommandBuilder()
    .setName('key')
    .setDescription('Get your key!')
    .toJSON()

export const execute = async (client: Client, commandName: string, interaction: CommandInteraction | any) => {
    const key = await assignKey(interaction.user.id);
    if (key) {
        await interaction.reply({content: `Your key is: \`${key}\``, ephemeral: true});
    } else {
        await interaction.reply('No available keys.');
    }
}