import {Client, CommandInteraction} from 'discord.js';
import {Key} from "../models/key";
import {SlashCommandBuilder} from "@discordjs/builders";
import config from "../config";

export const data = new SlashCommandBuilder()
    .setName('adminkey')
    .setDescription('Allows admins to pull keys')
    .addIntegerOption(option =>
        option.setName('amount')
            .setRequired(true)
            .setDescription('The amount of keys to retrieve'))
    .addStringOption(option =>
        option.setName('type')
            .setRequired(false)
            .setDescription('the type of keys you want to retrieve'))
    .toJSON()

export const execute = async (client: Client, commandName: string, interaction: CommandInteraction | any) => {
    if (!config.ADMIN_IDs.includes(interaction.user.id)) {
        await interaction.tryReply('You do not have permission to use this command.');
        return;
    }

    const amountOption = interaction.options.get('amount');
    if (!amountOption || amountOption.value === null) {
        await interaction.tryReply('Please provide a valid amount.');
        return;
    }

    const amount = amountOption.value as number;

    const typeOption = interaction.options.get('type');
    let type = '';
    if (!typeOption || typeOption.value === null) {
        type = 'beta';
    }else{
        type = typeOption.value as string;
    }

    const {keys, updatedCount, message} = await Key.claimBulk(type, interaction.user.id, amount);


    if (keys.length === 0) {
        await interaction.tryReply(`${message}`);
        return;
    }else{
        await interaction.tryReply({content: `${message}\n\n**Keys:**\n${keys.join('\n')}`, ephemeral: true});
    }
}