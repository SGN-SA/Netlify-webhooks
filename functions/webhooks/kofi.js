const sendWebhook = require("./sendWebhook");
const querystring = require("querystring");
const webhook = require("webhook-discord");
require("dotenv").config();

const {
    KOFI,
    PUBLIC_DISCORD_KOFI_WEBHOOK_URL,
    PRIVATE_DISCORD_KOFI_WEBHOOK_URL
} = process.env;

/**
 * @param {import("../../types/ko-fi/index.ts").Data} data
 * @returns {import("webhook-discord").MessageBuilder}
 */
function getMessageBuilder(data) {
    return new webhook.MessageBuilder()
        .setAuthor("Ko-fi", "https://storage.ko-fi.com/cdn/nav-logo-stroke.png")
        .setTitle(data.from_name)
        .setURL(data.url)
        .setTime(parseInt(data.timestamp));
}

/**
 * @param {import("../../types/ko-fi/index.ts").Data} data
 * @returns {Promise<void>}
 */
async function sendPrivateWebhook(data) {
    if (!PRIVATE_DISCORD_KOFI_WEBHOOK_URL) {
        console.error("Public webhook URL not defined");
        return;
    }

    const messageBuilder = getMessageBuilder(data);

    const wantedFields = [
        "type",
        "amount",
        "currency",
        "is_subscription_payment",
        "is_first_subscription_payment",
        "email",
        "is_public",
        "message",
        "message_id",
        "kofi_transaction_id"
    ];

    for (let i = 0; i < wantedFields.length; i++) {
        const fieldName = wantedFields[i];
        const element = data[fieldName];
        if (element) {
            messageBuilder.addField(fieldName, element);
        }
    }

    await sendWebhook(messageBuilder, PRIVATE_DISCORD_KOFI_WEBHOOK_URL);
}

/**
 * @param {import("../../types/ko-fi/index.ts").Data} data
 * @returns {Promise<void>}
 */
async function sendPublicWebhook(data) {
    if (!PUBLIC_DISCORD_KOFI_WEBHOOK_URL) {
        console.error("Public webhook URL not defined");
        return;
    }

    const messageBuilder = getMessageBuilder(data).addField("المبلغ", "");

    if (data.is_subscription_payment && data.tier_name) {
        messageBuilder.addField("الرتبة", data.tier_name);
    }

    if (data.message && data.is_public) {
        messageBuilder.addField("رسالة", data.message);
    }

    await sendWebhook(messageBuilder, PUBLIC_DISCORD_KOFI_WEBHOOK_URL);
}

/** @type { import("@netlify/functions").Handler } */
async function kofi(event) {
    if (!event.body) {
        return {
            statusCode: 400,
            body: "Event body is missing"
        };
    }

    const parsedBody = querystring.parse(event.body);
    if (!parsedBody.data) {
        return {
            statusCode: 401,
            body: "Data property is missing"
        };
    }

    if (Array.isArray(parsedBody.data)) {
        return {
            statusCode: 400,
            body: "Data property is an array"
        };
    }

    /** @type { import("../../types/ko-fi/index").Data } */
    const data = JSON.parse(parsedBody.data);
    console.log(data);

    if (data.verification_token !== KOFI) {
        return {
            statusCode: 401,
            body: "Invalid Authentication"
        };
    }

    try {
        await sendPrivateWebhook(data);
        await sendPublicWebhook(data);
    } catch (err) {
        console.error(err);
    }

    return {
        statusCode: 200
    };
}

module.exports = kofi;
