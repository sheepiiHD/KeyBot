import { Client, Interaction } from 'discord.js';
import fs from 'fs';
import path from 'path';

export default async function loadInteractions(client: Client | any) {
    const interactions: {id: string, action: (client:Client, interaction: Interaction) => void}[] = []

    const interactionTypes = ['button', 'select-menu', "modal-submit"];

    for (let type of interactionTypes) {
        const dirPath = path.join(__dirname, "..", 'interactions', type);
        const files = fs.readdirSync(dirPath);

        for (let file of files) {

            if (!file.endsWith('.ts')) continue;

            // Use dynamic import here
            const interactionModule = await import(path.join(__dirname , "..", 'interactions', type, file));

            if (interactionModule.default) {
                const { id, action } = interactionModule.default;

                if (id && action) {
                    interactions.push({ id, action });
                    console.log("Loaded interaction: " + id);
                }
            }
        }
        console.log(`Successfully loaded ${type} interactions`);
    }

    client.on('interactionCreate', async (interaction: Interaction | any) => {
        if(interaction.isCommand()){
            const command = client.commands.get(interaction?.commandName);
            if (!command) return;

            try {
                await command(client, interaction.commandName, interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                })
            }
        }
        const found = interactions.find(x => x.id === interaction.customId)

        if(found){ found.action(client, interaction); }
    });

    console.log('Successfully loaded interactions');
}