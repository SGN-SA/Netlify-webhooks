// export declare enum Currency {
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

/**
 * The only currencies supported by Ko-fi
 */
export declare type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'AUD'
  | 'BRL'
  | 'CAD'
  | 'JPY'
  | 'SGD'
  | 'THB'
  | 'NZD'

export declare type Country = 'United States' | 'Malaysia' | 'Saudi Arabia'

export declare type CountryCode = 'US' | 'MY' | 'SA'

export declare type CountryPhoneCode = '1' | '60' | '966'
export declare type PhoneNumber = `+${CountryPhoneCode}${string}`
