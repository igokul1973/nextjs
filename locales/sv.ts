import { TPluralTranslationKeys, TSingleTranslationKeys } from './types';

const svPlural: Record<TPluralTranslationKeys, string> = {
    'must be digits#many': 'måste vara {count} siffror',
    'must be up to digits#many': 'måste vara upp till {count} siffror',
    'must be at least characters#many':
        'innehållsartikelnamnet kan inte vara mindre än {count} tecken'
};

const svSingle: Record<TSingleTranslationKeys, string> = {
    create: 'skapa',
    add: 'lägg till',
    edit: 'redigera',
    delete: 'ta bort',
    save: 'spara',
    cancel: 'avbryt',
    'log out': 'logga ut',
    'log in': 'logga in',
    yes: 'ja',
    no: 'nej',
    type: 'typ',
    close: 'stäng',
    actions: 'åtgärder',
    // Navigation
    home: 'hem',
    dashboard: 'instrumentpanel',
    invoices: 'fakturor',
    customers: 'kunder',
    inventory: 'inventering',
    account: 'kontot',
    'my account': 'mitt konto',
    provider: 'leverantör',
    'provider type': 'leverantörstyp',
    profile: 'profil',
    'user profile': 'användarprofil',
    settings: 'inställningar',
    'account settings': 'kontoinställningar',
    'account id': 'kontoid',
    id: 'id',
    // Organization
    'select customer type': 'valj kundtyp',
    organization: 'företag',
    name: 'namn',
    'organization name': 'företagnamn',
    'organization type': 'företagstyp',
    'is private': 'är privat',
    'is charity': 'är en välgörenhetsorganisation',
    // Individual
    individual: 'enskild',
    'first name': 'fornamn',
    'last name': 'efternamn',
    'middle name': 'mellanamn',
    'full name': 'fullt namn',
    dob: 'fd',
    'date of birth': 'födelsedatum',
    'Enter the date of birth': 'Ange födelsedatum',
    description: 'beskrivning',
    // Address
    address: 'adress',
    'street address': 'gatuaddress',
    'address (line 2)': 'gatuaddress 2',
    'address (line 3)': 'gatuaddress 3',
    'enter street address and building number': 'ange gatuadress och byggnadsnummer',
    'continue street address and/or apartment number':
        'fortsätt gatuadress och/eller lägenhetsnummer',
    locality: 'lokalitet',
    'city or locality': 'stad eller lokalitet',
    'enter city, village or locality': 'Ange stad, by eller annat lokalitet',
    region: 'län',
    'state or region': 'län eller region',
    'enter state or region': 'Ange län eller region',
    'postal code': 'postnummer',
    'enter postal/zip code': 'ange postnummer',
    country: 'land',
    'enter the country': 'ange landet',
    // Phones
    phones: 'telefonnummer',
    number: 'nummer',
    'add phone': 'lägg till telefon nummer',
    'add another phone': 'lägg till ett annat telefonnummer',
    'country code': 'landskod',
    'phone country code': 'telefon landskod',
    'please enter the country code': 'var god ange landskod',
    'please enter the phone number': 'var god ange telefonnummer',
    'please enter the phone type': 'var god ange telefontyp',
    // Emails
    email: 'e-post',
    'email addresses': 'e-postadress',
    'add email address': 'lägg till e-postadress',
    'add another email address': 'lägg till en annan e-postadress',
    'please enter the email address': 'var god ange e-postadress',
    'please enter the email type': 'var god ange e-posttyp',
    // Inventory
    price: 'pris',
    'internal code': 'intern kod',
    'external code': 'extern kod',
    'manufacturer code': 'tillverkarekod',
    'manufacturer price': 'tillverkarepris',
    miscellaneous: 'annan',
    product: 'produkt',
    service: 'tjänst',
    // Attributes
    'add another attribute': 'lägg till ett annat attribut',
    'add attribute': 'lägg till en attribut',
    text: 'text',
    value: 'värde',
    // Errors
    'must be a number': 'måste vara ett nummer',
    'could not load data': 'kunde inte ladda data',
    'please enter at least one character': 'var god ange minst ett tecken',
    'please enter the name': 'var god ange namnet',
    'please enter the first name': 'var god ange förnamn',
    'please enter the last name': 'var god ange efternamn',
    'please enter the street address': 'var god ange gatuadress',
    'please enter the city/village/locality': 'var god ange stad, by eller lokalitet',
    'please enter the region/state': 'var god ange län eller region',
    'please enter the zip/postal code': 'var god ange postnummer',
    'please enter the country': 'var god ange landet',
    'please enter the company name': 'var god ange företagsnamn',
    'please enter the price': 'var god ange priset',
    'the price cannot be less than 0.01': 'priset kan inte vara mindre än 0.01',
    'the country code cannot be bigger than 999': 'landskoden kan inte vara mer än 999',
    'the phone number cannot have less than 8 digits':
        'telefonnumret kan inte ha mindre än 8 siffror',
    'the phone number cannot have more than 14 digits':
        'telefonnumret kan inte ha mer än 14 siffror',
    'invalid date': 'ogiltig datum',
    'please enter a valid email address': 'var god ange en giltig e-postadress',
    'please enter the attribute type': 'var god ange attributtyp',
    'please enter the attribute name': 'var god ange attributnamn',
    'please enter the attribute value': 'var god ange attributvärde',
    'please enter the inventory item name': 'var god ange innehållsartikelnamn',
    'please enter the inventory item type': 'var god ange innehållsartikeltyp',
    // Buttons
    'create customer': 'skapa en kund',
    'update customer': 'redigera kunden',
    'delete customer': 'ta bort kunden',
    'create inventory': 'skapa inventering',
    'create inventory item': 'skapa innehållsartikel',
    'create invoice': 'skapa en faktura',
    'dense padding': 'tät stoppning',
    // Reports
    collected: 'insamlad',
    pending: 'avvaktande',
    'paid invoices': 'betalade fakturor',
    'pending invoices': 'avvaktande fakturor',
    'total invoices': 'totala fakturor',
    'total customers': 'totala kunder',
    // Miscellaneous
    'search customers': 'sök kunder',
    search: 'sök'
};

const sv = {
    ...svSingle,
    ...svPlural
} as const;

export default sv;
