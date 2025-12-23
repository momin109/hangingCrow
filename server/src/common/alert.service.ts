import { Injectable, Logger } from '@nestjs/common';
import * as https from 'https';

/**
 * Alert Service
 * Sends critical incident alerts via Telegram and Email (simulated)
 */
@Injectable()
export class AlertService {
    private readonly logger = new Logger(AlertService.name);
    private readonly TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    private readonly TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    /**
     * Send critical alert
     */
    async sendAlert(
        title: string,
        message: string,
        level: 'INFO' | 'WARNING' | 'CRITICAL' = 'INFO',
    ): Promise<void> {
        const timestamp = new Date().toISOString();
        const formattedMessage = `[${level}] ${title}\nTime: ${timestamp}\n\n${message}`;

        this.logger.warn(`[ALERT SERVICE] ${formattedMessage}`);

        // Async sending to channels
        this.sendToTelegram(formattedMessage).catch((err) =>
            this.logger.error(`Failed to send Telegram alert: ${err.message}`),
        );
    }

    /**
     * Send to Telegram
     */
    private async sendToTelegram(text: string): Promise<void> {
        if (!this.TELEGRAM_BOT_TOKEN || !this.TELEGRAM_CHAT_ID) {
            return; // Skip if not configured
        }

        const url = `https://api.telegram.org/bot${this.TELEGRAM_BOT_TOKEN}/sendMessage`;
        const data = JSON.stringify({
            chat_id: this.TELEGRAM_CHAT_ID,
            text: text,
        });

        return new Promise((resolve, reject) => {
            const req = https.request(
                url,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': data.length,
                    },
                },
                (res) => {
                    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                        resolve();
                    } else {
                        reject(new Error(`Status code: ${res.statusCode}`));
                    }
                },
            );

            req.on('error', (err) => reject(err));
            req.write(data);
            req.end();
        });
    }
}
