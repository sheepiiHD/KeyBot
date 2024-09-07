import { Client, Message } from "discord.js";
import fetch from 'node-fetch';
import {Key} from "../models/key";
import {ADMIN_ID} from "../bot";

export default (client: Client) => {
    client.on('messageCreate', async (message: Message) => {
        if (!message.inGuild()) {
            if (message.attachments.size === 1) {
                const attachment = message.attachments.first();
                if(ADMIN_ID.includes(message.author.id)) {
                    if (attachment && attachment.name?.endsWith('.txt')) {
                        try {

                            const response = await fetch(attachment.url);
                            const text = await response.text();
                            const lines = text.split('\n');
                            const input = lines.map((line) => ({key: line.trim(), assignedTo: null}));

                            await Key.createBulk(input).then(() => message.reply("Done!"));
                        } catch (error) {
                            console.error('Error reading the attachment:', error);
                        }
                    } else {
                        console.log('The attached file is not a .txt file.');
                    }
                }
            }
        }
    });
};