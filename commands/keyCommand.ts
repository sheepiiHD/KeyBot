import { Client, CommandInteraction, EmbedBuilder } from 'discord.js';
import { SlashCommandBuilder } from "@discordjs/builders";
import {IKey, Key} from "../models/key";

export const data = new SlashCommandBuilder()
    .setName('keys')
    .setDescription('Get your keys!')
    .toJSON();

export const execute = async (client: Client, commandName: string, interaction: CommandInteraction | any) => {
    // Fetch all keys assigned to the user
    const keys = await Key.find({ assignedTo: interaction.user.id });

    if (keys.length > 0) {
        const embed = new EmbedBuilder()
            .setTitle('Your Keys')
            .setColor(0x00AE86)
            .setDescription('Here are the keys assigned to you:')
            .addFields(
                keys.map((key: IKey) => ({
                    name: key.type || 'Key',
                    value: `\`${key.key}\``,
                    inline: true
                }))
            )
            .setFooter({ text: 'Keep your keys safe!' });

        // Reply with the embed
        await interaction.tryReply({ embeds: [embed], ephemeral: true });
    } else {
        // If no keys are assigned, respond with a message
        await interaction.tryReply({ content: 'No available keys.', ephemeral: true });
    }
};