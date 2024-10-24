import {Attachment, Client, GuildMember, Message} from 'discord.js';
import fetch from 'node-fetch';
import { Key } from '../models/key';
import config from "../config";
import Logger from "../utils/Logger";
import {assignKey} from "../utils/assignKey";

export default (client: Client) => {
    client.on('messageCreate', async (message: Message) => {
        if (!message.inGuild() && message.attachments.size === 1) {
            const attachment = message.attachments.first() as Attachment;

            if(message.content === ""){
                await message.reply(`You must include a type in your upload, just type something like **'beta'**... `);
                return;
            }

            if (config.ADMIN_IDs.includes(message.author.id) && attachment?.name?.endsWith('.txt')) {
                try {
                    const response = await fetch(attachment.url);
                    const text = await response.text();

                    const keys = text.split('\n').map(line => ({
                        key: line.trim(),
                        assignedTo: null,
                        type: message.content.trim()
                    }));

                    await Key.createBulk(keys);
                    await Logger.info(`Keys created for ${message.content.trim()}.`);

                    await message.reply('Keys have been successfully uploaded!');
                } catch (error) {
                    console.error('Error processing the attachment:', error);
                    await message.reply('An error occurred while processing the file.');
                }
            } else {
                await message.reply('Please upload a valid .txt file.');
            }
        } else {
            const [command, type] = message.content.slice(1).split(' ');
            const member = message.member as GuildMember;
            if(!message.content.startsWith('!') || !command || !member){
                return;
            }

            if(command && command !== 'claim'){
                return
            }

            if(!type){
                return;
            }

            const claim = config.claims.find(x => x.name === type);

            if (!claim) {
                await member.trySend(
                    {content: 'There is no claim with this name, `' + type + '`.'}, message
                );
                return;
            }

            const hasRole = member && claim.discordRoleId.some(roleId => member.roles.cache.has(roleId));

            if (!hasRole) {
                await member.trySend({content: 'You don\'t have access to this claim, `' + type + '`.'}, message);
            }

            const amount = claim?.amount ?? 1;
            const existingKeys = await Key.find({ assignedTo: member.id, type: type});
            
            if(existingKeys.length > 0){
                const keysList = existingKeys.map(key => `\`${key.key}\``).join('\n');
                await member.trySend({
                    content: `You already have the following keys for ${type}:\n${keysList}`,
                }, message);
            }else{
                // Claim multiple keys if amount is specified
                if (amount > 1) {
                    const claimResult = await Key.claimBulk(type, member.id, amount);

                    if (claimResult.updatedCount > 0) {
                        const keysList = claimResult.keys.map(key => `\`${key}\``).join('\n');
                        await member.trySend({ content: `Your claim for ${type}:\n${keysList}`,}, message);
                        await Logger.info(`<@${member.id}> claimed ${claimResult.updatedCount}x **${type}** keys.`);
                    } else {
                        await member.trySend({content: claimResult.message,}, message);
                    }
                } else {
                    // Fallback to claiming a single key
                    const key = await assignKey(member.id, type);

                    if (key) {
                        await member.trySend({content: `Your claim for ${type} is: \`${key}\``,}, message);
                    } else {
                        await member.trySend({ content: 'No available keys.',  }, message);
                    }

                }
            }
        }
    });
};