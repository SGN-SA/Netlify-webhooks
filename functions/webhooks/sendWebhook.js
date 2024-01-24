import { Webhook } from 'webhook-discord'

/**
 * Send the final message to Discord using a webhook
 * @param {import("webhook-discord").MessageBuilder} messageBuilder The message builder containing the payment details
 * @param {string} webhookUrl The Discord webhook url to send the 'messageBuilder' to
 * @returns {Promise<void>}
 */
export async function sendWebhook(messageBuilder, webhookUrl) {
  messageBuilder
    .setName('SGN')
    .setColor('#6945ff')
    .setAvatar(
      'https://pbs.twimg.com/profile_images/1636726723302621185/pqdwlxAg_400x400.jpg'
    )

  try {
    const Hook = new Webhook(webhookUrl)
    await Hook.send(messageBuilder)
  } catch (err) {
    console.error('📢 - sendWebhook - err:', err)
  }
}
