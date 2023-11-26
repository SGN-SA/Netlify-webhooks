import { Webhook } from "webhook-discord";

/**
 * @param {import("webhook-discord").MessageBuilder} messageBuilder
 * @param {string} webhookUrl
 * @return {Promise<void>}
 */
export async function sendWebhook(messageBuilder, webhookUrl) {
    const Hook = new Webhook(webhookUrl);

    messageBuilder
        .setName("SaudiGN")
        .setColor("#6945ff")
        .setAvatar(
            "https://pbs.twimg.com/profile_images/1636726723302621185/pqdwlxAg_400x400.jpg"
        );

    try {
        await Hook.send(messageBuilder);
    } catch (err) {
        console.error("Error sending message to Discord:", err.message);
    }
}
