import { request } from 'https';
import config from "../config";

export default class Logger {
    private static webhookUrl = config.WEBHOOK_URL;

    private static async sendPayload(payload: object): Promise<void> {
        const url = new URL(this.webhookUrl);

        const options = {
            hostname: url.hostname,
            path: url.pathname + url.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(payload)),
            },
        };

        return new Promise((resolve, reject) => {
            const req = request(options, (res) => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    resolve();
                } else {
                    console.error(`Failed to send log. Status code: ${res.statusCode}`);
                    reject(new Error(`Status code: ${res.statusCode}`));
                }
            });

            req.on('error', (e) => {
                console.error(`Problem with request: ${e.message}`);
                reject(e);
            });

            req.write(JSON.stringify(payload));
            req.end();
        });
    }

    private static async log(message: string, color: number): Promise<void> {
        const payload = {
            embeds: [
                {
                    title: "Log Message",
                    description: message,
                    color: color,
                    timestamp: new Date().toISOString(),
                },
            ],
        };
        await this.sendPayload(payload);
    }

    static async info(message: string): Promise<void> {
        await this.log(`${message}`, 3447003); // Blue color
    }

    static async warn(message: string): Promise<void> {
        await this.log(`${message}`, 16776960); // Yellow color
    }

    static async error(message: string): Promise<void> {
        await this.log(`${message}`, 15158332); // Red color
    }
}