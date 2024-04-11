import { TTranslationKeys } from './types';

const sv: Record<TTranslationKeys, string> = {
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
    close: 'stäng',
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
    organization: 'företag',
    name: 'namn',
    'organization type': 'organizationstyp',
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
    // Emails
    email: 'e-post',
    'email addresses': 'mejladresser',
    // Errors
    'please enter the first name': 'var god ange förnamn',
    'please enter the last name': 'var god ange efternamn',
    'please enter the street address': 'var god ange gatuadress',
    'please enter the city/village/locality': 'var god ange stad, by eller lokalitet',
    'please enter the region/state': 'var god ange län eller region',
    'please enter the zip/postal code': 'var god ange postnummer',
    'please enter the country': 'var god ange landet',
    // Buttons
    'create customer': 'skapa en kund',
    'update customer': 'redigera kunden',
    'delete customer': 'ta bort kunden',
    // Reports
    collected: 'insamlad',
    pending: 'avvaktande',
    'total invoices': 'totala fakturor',
    'total customers': 'totala kunder'
} as const;

export default sv;
