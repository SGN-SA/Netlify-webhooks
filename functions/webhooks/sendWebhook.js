const axios = require("axios");
require("dotenv").config();

const webhookURL = `https://discord.com/api/webhooks/1102426732822270073/${process.env.DISCORD_TOKEN}`;

/**
 * @param {import("discord-api-types/v10").APIEmbed} embed
 * @return {Promise<void>}
 */
async function sendWebhook(embed) {
    embed.color = 0x6945ff;

    /** @type { import("discord-api-types/v10").RESTPostAPIWebhookWithTokenJSONBody} */
    const messagePayload = {
        username: "SaudiGN",
        avatar_url:
            "https://pbs.twimg.com/profile_images/1636726723302621185/pqdwlxAg_400x400.jpg",
        embeds: [embed]
    };

    try {
        const response = await axios.post(
            webhookURL,
            JSON.stringify(messagePayload),
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Message sent to Discord:", response.data);
    } catch (err) {
        console.error("Error sending message to Discord:", err.message);
        console.error(err);
    }
}

module.exports = sendWebhook;
