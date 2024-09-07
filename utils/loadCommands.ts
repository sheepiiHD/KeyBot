import path, {join} from "path";
import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import {readdirSync} from 'fs';
import {Client} from "discord.js";

const commandsDir = path.join(__dirname, '..', 'commands');
export async function refreshApplicationCommands(client: Client) {

    // Ensure the client is ready and has a user object
    if (!client.user) {
        console.error("Client is not ready or doesn't have a user object");
        return;
    }

    const clientID = client.user.id;

    // Read command files
    const commandFiles = readdirSync(commandsDir).filter(file => file.endsWith('.ts'));
    const commands: any[] = [];

    for (const file of commandFiles) {
        const command = await import(path.join(commandsDir, file));
        commands.push(command.data);
    }

    const rest = new REST({version: '10'}).setToken(process.env.BOT_TOKEN as string);

    try {
        await rest.put(
            Routes.applicationCommands(clientID),
            {body: commands},
        );

        console.log('Successfully loaded commands cache');
    } catch (error) {
        console.error(error);
    }
}

export default function loadCommands(client: Client | any) {

    // Import command files
    const commandFiles = readdirSync(commandsDir).filter(file => file.endsWith('.ts'));

    // Create a new Map for commands
    client.commands = new Map();

    // Load command data and execute function from each file into the Map
    for (const file of commandFiles) {
        const command = require(`${commandsDir}/${file}`);
        client.commands.set(command.data.name, command.execute);
    }
    console.log('Successfully loaded commands');
}