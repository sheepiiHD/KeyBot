import {Client, CommandInteraction} from 'discord.js';
import {assignKey} from '../utils/assignKey';
import {SlashCommandBuilder} from "@discordjs/builders";
import {Key} from "../models/key";
import config from "../config";


export const data = new SlashCommandBuilder()
    .setName('removeallkeys')
    .setDescription('Allows admins to remove all keys')
    .addStringOption(option =>
        option.setName('type')
            .setRequired(true)
            .setDescription('The type of key to remove; ie: \'beta\' or \'all\''))
    .toJSON()

export const execute = async (client: Client, commandName: string, interaction: CommandInteraction | any) => {
    const key = await assignKey(interaction.user.id, 'beta');

    if (!config.ADMIN_IDs.includes(interaction.user.id)) {
        await interaction.reply('You do not have permission to use this command.');
        return;
    }

    const typeOption = interaction.options.get('type');
    if (!typeOption || typeOption.value === null) {
        await interaction.reply('Please provide a valid amount.');
        return;
    }

    if (typeOption.value === "all" && await Key.findOne({type: 'beta'})) {
        await Key.deleteMany({});
        await interaction.reply({content: `All keys have been removed!`, ephemeral: true});
    } else if (await Key.findOne({type: typeOption.value})) {
        await Key.deleteMany({type: typeOption.value});
        await interaction.reply({content: `All ${typeOption.value} keys have been removed!`, ephemeral: true});
    } else {
        await interaction.reply({content: `No keys to remove`, ephemeral: true});
    }
}