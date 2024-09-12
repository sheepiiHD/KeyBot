import {Client, GatewayIntentBits, Partials} from 'discord.js';
import mongoose from 'mongoose';
import loadCommands from "./utils/loadCommands";
import loadInteractions from "./utils/loadInteractions";
import loadEvents from "./utils/loadEvents";
import config from "./config";

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
mongoose.connect(config.MONGO_URI).then(() => console.log('Successfully loaded database'))
    .catch(err => console.error('MongoDB connection error:', err));


client.login(config.BOT_TOKEN);