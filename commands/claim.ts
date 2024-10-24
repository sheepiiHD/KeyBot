import { Client, CommandInteraction, GuildMember } from 'discord.js';
import { assignKey } from '../utils/assignKey';
import { SlashCommandBuilder } from "@discordjs/builders";
import { Key } from "../models/key";
import config from "../config";
import Logger from "../utils/Logger";

export const data = new SlashCommandBuilder()
    .setName('claim')
    .setDescription('Claim a key!')
    .addStringOption(option =>
        option.setName('type')
            .setRequired(true)
            .setDescription('Try \'key\' or \'earlyaccess\''))
    .toJSON();

export const execute = async (client: Client, commandName: string, interaction: CommandInteraction | any) => {

    const typeOption = interaction.options.get('type');
    if (!typeOption || typeOption.value === null) {
        await interaction.reply({ content: 'Please provide a valid type.', ephemeral: true });
        return;
    }

    const claim = config.claims.find(x => x.name === typeOption.value);

    if (!claim) {
        await interaction.reply({ content: 'There is no claim with this name', ephemeral: true });
        return;
    }

    const member = interaction.member as GuildMember;
    const hasRole = member && claim.discordRoleId.some(roleId => member.roles.cache.has(roleId));
    if (!hasRole) {
        await interaction.reply({ content: 'You don\'t have access to this claim', ephemeral: true });
        return;
    }

    // Check if the claim has the "amount" property for bulk key claiming
    const amount = claim.amount ?? 1; // Default to 1 if no amount is specified

    // Fetch any existing keys assigned to the user for the specified type
    const existingKeys = await Key.find({ assignedTo: interaction.user.id, type: typeOption.value });

    if (existingKeys.length > 0) {
        // If keys already exist, display them
        const keysList = existingKeys.map(key => `\`${key.key}\``).join('\n');
        await interaction.tryReply({
            content: `You already have the following keys for ${typeOption.value}:\n${keysList}`,
            ephemeral: true
        });
    } else {
        // Claim multiple keys if amount is specified
        if (amount > 1) {
            const claimResult = await Key.claimBulk(typeOption.value, interaction.user.id, amount);

            if (claimResult.updatedCount > 0) {
                const keysList = claimResult.keys.map(key => `\`${key}\``).join('\n');
                await interaction.tryReply({
                    content: `Your claim for ${typeOption.value}:\n${keysList}`,
                    ephemeral: true
                });
                await Logger.info(`<@${interaction.user.id}> claimed ${claimResult.updatedCount}x **${typeOption.value}** keys.`);
            } else {
                await interaction.tryReply({
                    content: claimResult.message,
                    ephemeral: true
                });
            }
        } else {
            // Fallback to claiming a single key
            const key = await assignKey(interaction.user.id, typeOption.value);

            if (key) {
                await interaction.tryReply({ content: `Your claim for ${typeOption.value} is: \`${key}\``, ephemeral: true });
            } else {
                await interaction.tryReply({ content: 'No available keys.', ephemeral: true });
            }
        }
    }
};