import {Client, CommandInteraction} from 'discord.js';
import {ADMIN_ID} from "../bot";
import {Key} from "../models/key";
import {SlashCommandBuilder} from "@discordjs/builders";

export const data = new SlashCommandBuilder()
    .setName('adminkey')
    .setDescription('Allows admins to pull keys')
    .addIntegerOption(option =>
        option.setName('amount')
            .setRequired(true)
            .setDescription('The amount of keys to retrieve'))
    .toJSON()

export const execute = async (client: Client, commandName: string, interaction: CommandInteraction | any) => {
    if (!ADMIN_ID.includes(interaction.author.id)) {
        await interaction.reply('You do not have permission to use this command.');
        return;
    }

    const amountOption = interaction.options.get('amount');
    if (!amountOption || amountOption.value === null) {
        await interaction.reply('Please provide a valid amount.');
        return;
    }

    const amount = amountOption.value as number;

    const unassignedKeys = await Key.find({ assignedTo: null }).limit(amount);
    if (unassignedKeys.length < amount) {
        await interaction.reply(`Not enough unassigned keys available. Only ${unassignedKeys.length} keys are available.`);
        return;
    }

    const keys = unassignedKeys.map((keyDoc) => keyDoc.key).join('\n');
    await interaction.reply({content: `Here are ${amount} keys:\n${keys}`, ephemeral: true});
}