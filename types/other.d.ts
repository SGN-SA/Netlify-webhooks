// export enum Currency {
//     US = "USD",
//     EURO = "EUR",
//     British = "GBP",
//     Australian = "AUD",
//     Brazilian = "BRL",
//     Canadian = "CAD",
//     JapaneseYen = "JPY",
//     Singaporean = "SGD",
//     ThaiBaht = "THB",
//     NewZealand = "NZD"
// }

export type CurrencyCode =
    | "USD"
    | "EUR"
    | "GBP"
    | "AUD"
    | "BRL"
    | "CAD"
    | "JPY"
    | "SGD"
    | "THB"
    | "NZD";

export type Country = "United States" | "Japan";

export type CountryCode = "US" | "MY" | "SA";

export type CountryPhoneCode = "01" | "60" | "966";
export type PhoneNumber = `+${CountryPhoneCode}${string}`;
