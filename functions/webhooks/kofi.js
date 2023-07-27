const sendWebhook = require("./sendWebhook");
const querystring = require("querystring");
require("dotenv").config();

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

    /** @type {import("discord-api-types/v10").APIEmbed} */
    let embed = {
        author: {
            name: "Ko-fi",
            icon_url: "https://storage.ko-fi.com/cdn/nav-logo-stroke.png"
        },

        url: data.url,
        description: `**${data.from_name}** قام بالتبرع`,

        fields: [
            {
                name: "المبلغ",
                value: `${Number.parseFloat(data.amount)} ${data.currency}`
            }
        ],

        timestamp: data.timestamp
    };

    if (data.tier_name) {
        embed.fields.push({ name: "الرتبة", value: data.tier_name });
    }

    if (data.is_public) {
        embed.fields.push({ name: "رسالة", value: data.message });
    }

    await sendWebhook(embed);

    return {
        statusCode: 200
    };
}

module.exports = kofi;
