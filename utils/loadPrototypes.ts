import {
    CommandInteraction, GuildMember,
    GuildMessageManager,
    InteractionReplyOptions,
    InteractionResponse,
    Message,
    MessageCreateOptions
} from "discord.js";
import Logger from "./Logger";


declare global {
    interface Promise<T> {
        expireMessage(this: Promise<Message>, time: number): Promise<Message>;

        expireInteractionResponse(this: Promise<InteractionResponse<boolean>>, time: number): Promise<InteractionResponse<boolean>>;
    }
}

declare module 'discord.js' {
    interface CommandInteraction {
        tryReply(content: string | InteractionReplyOptions): Promise<void>;
    }
    interface GuildMember {
        trySend(content: string | MessageCreateOptions, message?: Message): Promise<void>;
    }
}

export default () => {
    // Extending Promise prototype for expireMessage
    Promise.prototype.expireMessage = function (this: Promise<Message>, time: number) {
        return this.then(message => {
            setTimeout(() => {
                message.delete().catch(console.error);
            }, time);
            return message;
        });
    };

    // Extending Promise prototype for expireInteractionResponse
    Promise.prototype.expireInteractionResponse = function (this: Promise<InteractionResponse<boolean>>, time: number) {
        return this.then(interactionResponse => {
            setTimeout(() => {
                interactionResponse.delete().catch(console.error);
            }, time);
            return interactionResponse;
        });
    };

    // Extending CommandInteraction prototype for tryReply
    CommandInteraction.prototype.tryReply = async function (content: string | InteractionReplyOptions): Promise<void> {
        try {
            await this.reply(content);
        } catch (error) {
            await Logger.error(`${this.member.id} tried something on an interaction that didn't exist.`)
        }
    };
    GuildMember.prototype.trySend = async function (content: string | MessageCreateOptions, message?: Message): Promise<void> {
        try {
            await this.send(content);
        } catch (error) {
            message?.reply({content: "I can't seem to DM you, you have DMs disabled."})
            Logger.error(`Tried to send this to <@${this.user.id}> but failed :( : \n\n \`\`\`${content}\`\`\``)
        }
    };

    console.log("Successfully loaded prototypes");
};