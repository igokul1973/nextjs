export const baseUrl = process.env.PDF_BACKEND_URL ?? 'http://localhost:8080';

export const localeToCurrencyCode: Record<string, string> = {
    'en-US': 'USD',
    'en-GB': 'GBP',
    'sv-SE': 'SEK',
    'ru-RU': 'RUB'
    // Add more mappings here...
};

export const localeToNumeroSign: Record<string, string> = {
    'en-US': '#',
    'en-GB': 'No.',
    'sv-SE': 'nr.',
    'ru-RU': '№'
    // Add more mappings here...
};
