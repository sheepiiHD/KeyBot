import {Client} from "discord.js";
import path from "path";
import fs from "fs";

export default (client: Client) => {

    const eventsDir = path.join(__dirname, '..', 'events');

    // Get all event files directly within the 'events' directory
    const eventFiles = fs.readdirSync(eventsDir).filter(file => file.endsWith('.ts'));

    for (const file of eventFiles) {
        const event = require(path.join(eventsDir, file)).default;  // assuming ES6 export default
        event(client);
    }

    console.log("Successfully loaded events");
}