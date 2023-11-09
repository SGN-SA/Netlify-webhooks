const kofi = require("./webhooks/kofi");

/** @type {import("@netlify/functions").Handler} */
async function webhook(event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 400,
            body: "Received non-POST HTTP method"
        };
    }

    const pathParts = event.path.split("/");
    const lastPart = pathParts[pathParts.length - 1];

    switch (lastPart) {
        case "kofi":
            const res = await kofi(event);
            if (res && res.statusCode >= 400) {
                console.error(res);
            }
            return res;

        default:
            return {
                statusCode: 204
            };
    }
}

exports.handler = webhook;
