import { request } from 'https';
import config from "../config";

export default class Logger {
    private static webhookUrl = config.WEBHOOK_URL;

    private static async sendPayload(payload: string): Promise<void> {
        const url = new URL(this.webhookUrl);

        const options = {
            hostname: url.hostname,
            path: url.pathname + url.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
            },
        };

        return new Promise((resolve, reject) => {
            const req = request(options, (res) => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    console.log('Log sent to Discord webhook');
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

            req.write(payload);
            req.end();
        });
    }

    private static async log(message: string): Promise<void> {
        const payload = JSON.stringify({ content: message });
        await this.sendPayload(payload);
    }

    static async info(message: string): Promise<void> {
        await this.log(`:information_source: [INFO]: ${message}`);
    }

    static async warn(message: string): Promise<void> {
        await this.log(`:warning: [WARN]: ${message}`);
    }

    static async error(message: string): Promise<void> {
        await this.log(`:x: [ERROR]: ${message}`);
    }
}