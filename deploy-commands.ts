import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from '@discordjs/builders';
import dotenv from 'dotenv';

dotenv.config();

const commands = [
    new SlashCommandBuilder().setName('key').setDescription('Get your key from the database'),
    new SlashCommandBuilder()
        .setName('adminkey')
        .setDescription('Admin command to request keys')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of keys to retrieve')
                .setRequired(true)
        ),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN as string);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID as string),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();