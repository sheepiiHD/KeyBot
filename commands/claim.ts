import {Client, CommandInteraction, GuildMember} from 'discord.js';
import { assignKey } from '../utils/assignKey';
import {SlashCommandBuilder} from "@discordjs/builders";
import config from "../config";


export const data = new SlashCommandBuilder()
    .setName('claim')
    .setDescription('Claim a key!')
    .addStringOption(option =>
        option.setName('type')
            .setRequired(true)
            .setDescription('Currently: patreon1 and patreon2'))
    .toJSON()

export const execute = async (client: Client, commandName: string, interaction: CommandInteraction | any) => {

    const typeOption = interaction.options.get('type');
    if (!typeOption || typeOption.value === null) {
        await interaction.reply({content: 'Please provide a valid amount.', ephemeral: true});
        return;
    }

    const claim = config.claims.find(x => x.name === typeOption.value);

    if(!claim) {
        await interaction.reply({content: 'There is no claim with this name', ephemeral: true});
        return;
    }

    const member = interaction.member as GuildMember;

    if (!member.roles.cache.has(claim.discordRoleId)) {
        await interaction.reply({content: 'You don\'t have access to this claim', ephemeral: true});
        return;
    }

    const key = await assignKey(interaction.user.id, typeOption.value);

    if (key) {
        await interaction.reply({content: `Your claim for ${typeOption.value} is: \`${key}\``, ephemeral: true});
    } else {
        await interaction.reply({content: 'No available keys.', ephemeral: true});
    }
}