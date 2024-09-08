import {Attachment, Client, Message} from 'discord.js';
import fetch from 'node-fetch';
import { Key } from '../models/key';
import { ADMIN_ID } from '../bot';

export default (client: Client) => {
    client.on('messageCreate', async (message: Message) => {
        if (!message.inGuild() && message.attachments.size === 1) {
            const attachment = message.attachments.first() as Attachment;

            if (ADMIN_ID.includes(message.author.id) && attachment?.name?.endsWith('.txt')) {
                try {
                    const response = await fetch(attachment.url);
                    const text = await response.text();

                    const keys = text.split('\n').map(line => ({
                        key: line.trim(),
                        assignedTo: null
                    }));

                    await Key.createBulk(keys);

                    await message.reply('Keys have been successfully uploaded!');
                } catch (error) {
                    console.error('Error processing the attachment:', error);
                    await message.reply('An error occurred while processing the file.');
                }
            } else {
                await message.reply('Please upload a valid .txt file.');
            }
        }
    });
};