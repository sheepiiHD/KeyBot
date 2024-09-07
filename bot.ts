import {Client, GatewayIntentBits, Partials} from 'discord.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import loadCommands from "./utils/loadCommands";
import loadInteractions from "./utils/loadInteractions";
import loadEvents from "./utils/loadEvents";

dotenv.config();

export const BOT_TOKEN = process.env.BOT_TOKEN || '';
export const MONGO_URI = process.env.MONGO_URI || '';
export const ADMIN_ID = (process.env.ADMIN_IDS as string).split(',') || [];

const client: Client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
});

loadCommands(client);

loadEvents(client);

loadInteractions(client);

// Connect to MongoDB
mongoose.connect(MONGO_URI).then(() => console.log('Successfully loaded database'))
    .catch(err => console.error('MongoDB connection error:', err));


client.login(BOT_TOKEN);