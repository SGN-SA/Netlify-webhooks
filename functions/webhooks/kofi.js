const sendWebhook = require("./sendWebhook");
const querystring = require("querystring");
require("dotenv").config();

/**
 *
 * @param {import("../../types/ko-fi/index.ts").Data} data
 * @returns {void}
 */
async function sendPrivateWebhook(data) {
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

    /** @type {import("discord-api-types/v10").APIEmbed} */
    let embed = {
        author: {
            name: "Ko-fi",
            icon_url: "https://storage.ko-fi.com/cdn/nav-logo-stroke.png"
        },

        title: data.from_name,
        url: data.url,
        timestamp: data.timestamp,
        fields: []
    };

    for (let i = 0; i < wantedFields.length; i++) {
        const fieldName = wantedFields[i];
        const element = data[fieldName];
        if (element) {
            embed.fields.push({ name: fieldName, value: element });
        }
    }

    console.log("📢 ---------------------------------------📢");
    console.log("📢 - sendPrivateWebhook - embed:", embed);
    console.log("📢 ---------------------------------------📢");

    await sendWebhook(embed, process.env.PRIVATE_DISCORD_KOFI_WEBHOOK_URL);
}

/**
 *
 * @param {import("../../types/ko-fi/index.ts").Data} data
 * @returns {void}
 */
async function sendPublicWebhook(data) {
    /** @type {import("discord-api-types/v10").APIEmbed} */
    let embed = {
        author: {
            name: "Ko-fi",
            icon_url: "https://storage.ko-fi.com/cdn/nav-logo-stroke.png"
        },

        title: data.from_name,
        url: data.url,
        timestamp: data.timestamp,

        fields: [
            {
                name: "المبلغ",
                value: `${Number.parseFloat(data.amount)} ${data.currency}`
            }
        ]
    };

    if (data.is_subscription_payment && data.tier_name) {
        embed.fields.push({ name: "الرتبة", value: data.tier_name });
    }

    if (data.message && data.is_public) {
        embed.fields.push({ name: "رسالة", value: data.message });
    }

    await sendWebhook(embed, process.env.PUBLIC_DISCORD_KOFI_WEBHOOK_URL);
}

/** @type { import("@netlify/functions").Handler } */
async function kofi(event) {
    if (!event.body) {
        console.log("Event body is missing");
        return {
            statusCode: 400,
            body: "Event body is missing"
        };
    }

    const parsedBody = querystring.parse(event.body);
    if (!parsedBody.data) {
        console.log("data property is missing");
        return {
            statusCode: 401,
            body: "data property is missing"
        };
    }

    /** @type { import("../../types/ko-fi/index").Data } */
    const data = JSON.parse(parsedBody.data);
    console.log(data);

    if (data.verification_token !== process.env.KOFI) {
        console.log("Invalid Authentication");
        return {
            statusCode: 401,
            body: "Invalid Authentication"
        };
    }

    await sendPrivateWebhook(data);
    await sendPublicWebhook(data);

    return {
        statusCode: 200
    };
}

module.exports = kofi;
