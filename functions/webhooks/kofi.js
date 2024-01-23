import { config } from 'dotenv'
import { parse } from 'querystring'
import { MessageBuilder } from 'webhook-discord'
import { CurrencyCharacter } from '../../helpers/currency.js'
import { sendWebhook } from './sendWebhook'

config()
const {
  KOFI,
  PUBLIC_DISCORD_KOFI_WEBHOOK_URL,
  PRIVATE_DISCORD_KOFI_WEBHOOK_URL
} = process.env

/**
 * Get a MessageBuilder containing shared information
 * @param {import("../../types/ko-fi/index.ts").Data} data The data to read from
 * @returns {import("webhook-discord").MessageBuilder} A MessageBuilder with the shared information
 */
function getMessageBuilder(data) {
  var date = new Date(data.timestamp)
  var unixTimestamp = Math.floor(date.getTime() / 1000)

  return new MessageBuilder()
    .setAuthor('Ko-fi', 'https://storage.ko-fi.com/cdn/nav-logo-stroke.png')
    .setTitle(data.from_name)
    .setURL(data.url.replace('&readToken=', ''))
    .setTime(unixTimestamp)
}

/**
 * Send the Ko-fi notification to the private Discord server
 * @param {import("../../types/ko-fi/index.ts").Data} data The data containing the payment information
 * @returns {Promise<void>}
 */
async function sendPrivateWebhook(data) {
  if (!PRIVATE_DISCORD_KOFI_WEBHOOK_URL) {
    console.error('Public webhook URL not defined')
    return
  }

  const messageBuilder = getMessageBuilder(data)

  const wantedFields = [
    'type',
    'amount',
    'currency',
    'is_subscription_payment',
    'is_first_subscription_payment',
    'email',
    'is_public',
    'message',
    'message_id',
    'kofi_transaction_id'
  ]

  for (let i = 0; i < wantedFields.length; i++) {
    const fieldName = wantedFields[i]
    const element = data[fieldName]
    if (element !== undefined && element !== null) {
      messageBuilder.addField(fieldName, element)
    }
  }

  await sendWebhook(messageBuilder, PRIVATE_DISCORD_KOFI_WEBHOOK_URL)
}

/**
 * Send the Ko-fi notification to the public Discord server
 * @param {import("../../types/ko-fi/index.ts").Data} data The data containing the payment information
 * @returns {Promise<void>}
 */
async function sendPublicWebhook(data) {
  if (!PUBLIC_DISCORD_KOFI_WEBHOOK_URL) {
    console.error('Public webhook URL not defined')
    return
  }

  const messageBuilder = getMessageBuilder(data).addField(
    'المبلغ',
    `${CurrencyCharacter[data.currency]} ${data.amount}`
  )

  if (data.is_subscription_payment && data.tier_name) {
    messageBuilder.addField('الرتبة', data.tier_name)
  }

  if (data.message && data.is_public) {
    messageBuilder.addField('الرسالة', data.message)
  }

  await sendWebhook(messageBuilder, PUBLIC_DISCORD_KOFI_WEBHOOK_URL)
}

/**
 * Read the Ko-fi webhook event and send the notification to Discord
 * @type {import("@netlify/functions").Handler}
 */
export default async function kofi(event) {
  if (!event.body) {
    return {
      statusCode: 400,
      body: 'Event body is missing'
    }
  }

  const parsedBody = parse(event.body)
  if (!parsedBody.data) {
    return {
      statusCode: 401,
      body: 'Data property is missing'
    }
  }

  if (Array.isArray(parsedBody.data)) {
    return {
      statusCode: 400,
      body: 'Data property is an array'
    }
  }

  /** @type { import("../../types/ko-fi/index").Data } */
  let data
  try {
    data = JSON.parse(parsedBody.data)
    console.log('📢 -----------------------📢')
    console.log('📢 - kofi - data:', data)
    console.log('📢 -----------------------📢')
  } catch (err) {
    console.log('📢 ---------------------------------------------📢')
    console.log('📢 - kofi - parsedBody.data:', parsedBody.data)
    console.log('📢 ---------------------------------------------📢')
    console.error(err)
    return
  }

  if (data.verification_token !== KOFI && data.verification_token !== 'test') {
    return {
      statusCode: 401,
      body: 'Invalid Authentication'
    }
  }

  try {
    await sendPrivateWebhook(data)
    await sendPublicWebhook(data)
  } catch (err) {
    console.error(err)
  }

  return {
    statusCode: 200
  }
}
