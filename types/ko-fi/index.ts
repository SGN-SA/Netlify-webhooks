import { CurrencyCode } from "../other";

export declare interface ShotItem {
    direct_link_code: string;
    variation_name: string;
    quantity: number;
}

export declare type PaymentType =
    | "Donation"
    | "Subscription"
    | "Commission"
    | "Shop Order";

export declare interface PaymentShipping {
    full_name: string;
    street_address: string;
    city: string;
    state_or_province: string;
    postal_code: number;
    country: string;
    country_code: string;
    telephone: string;
}

export declare interface Data {
    type: PaymentType;
    verification_token: string;
    message_id: string | null;
    /**
     * Date of the transaction
     * @format YYYY-MM-DDThh:mm:ssZ
     */
    timestamp: string;
    is_public: boolean;
    /**
     * Name of the payer
     */
    from_name: string;
    /**
     * Message of the payer
     */
    message: string;
    /**
     * Money paid as `currency`
     */
    amount: string;
    /**
     * @format https://ko-fi.com/Home/CoffeeShop?txid={{`kof_transaction_id`}}&readToken=
     */
    url: string;
    email: string;
    currency: CurrencyCode;
    /**
     * Is the payer subscribed to tier
     */
    is_subscription_payment: boolean;
    is_first_subscription_payment: boolean;
    /**
     * @format 00000000-1111-2222-3333-444444444444
     */
    kofi_transaction_id: string;
    shop_items: ShotItem[] | null;
    tier_name: string | null;
    shipping: PaymentShipping | null;
}

export declare type WebhookBody = `data=${string}`;
