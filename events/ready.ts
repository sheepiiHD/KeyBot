import {Client} from "discord.js";
import {refreshApplicationCommands} from "../utils/loadCommands";

export default (client: Client) => {
    client.once('ready', async() => {

        await refreshApplicationCommands(client);

        console.log(`Logged in as ${client.user?.tag}!`);
    });
};