import { CurrencyCode } from "../other";

export interface ShotItem {
    direct_link_code: string;
    variation_name: string;
    quantity: number;
}

export type PaymentType =
    | "Donation"
    | "Subscription"
    | "Commission"
    | "Shop Order";

export interface PaymentShipping {
    full_name: string;
    street_address: string;
    city: string;
    state_or_province: string;
    postal_code: number;
    country: string;
    country_code: string;
    telephone: string;
}

export interface Data {
    type: PaymentType;
    verification_token: string;
    message_id: string | null;
    /**
     * Date
     */
    timestamp: string;
    is_public: boolean;
    from_name: string;
    message: string;
    /**
     * Parse to float: Number.parseFloat(data.amount)
     */
    amount: string;
    url: string; // URL
    email: string; // EMAIL
    currency: CurrencyCode;
    is_subscription_payment: boolean;
    is_first_subscription_payment: boolean;
    kofi_transaction_id: string; // 00000000-1111-2222-3333-444444444444
    shop_items: ShotItem[] | null;
    tier_name: string | null;
    shipping: PaymentShipping | null;
}

export type WebhookBody = `data=${string}`;
