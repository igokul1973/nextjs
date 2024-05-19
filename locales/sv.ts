import { TPluralTranslationKeyRaw, TSingleTranslationKey } from './types';

const svPlural: Record<TPluralTranslationKeyRaw, string> = {
    'must be digits#many': 'måste vara {count} siffror',
    'must be up to digits#many': 'måste vara upp till {count} siffror',
    'must be at least characters#many': 'kan inte vara mindre än {count} tecken',
    'must be more than#many': 'måste vara mer än {count}',
    'file size must be less than kb#many': 'filen måste vara mindre än {count} KB',
    'file size must be less than mb#many': 'filen måste vara mindre än {count} MB',
    'square picture (png, jpg, jpeg, webp, or svg) with max file size: kb#many':
        'fyrkantig bild (png, jpg, jpeg, webp, eller svg) med maximal filstorlek: {count} KB',
    'square picture (png, jpg, jpeg, webp, or svg) with max file size mb#many':
        'fyrkantig bild (png, jpg, jpeg, webp, eller svg) med maximal filstorlek: {count} MB'
};

const svSingle: Record<TSingleTranslationKey, string> = {
    create: 'skapa',
    show: 'visa',
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
    date: 'datum',
    // Navigation
    home: 'hem',
    avatar: 'avatar',
    dashboard: 'instrumentpanel',
    invoice: 'faktura',
    invoices: 'fakturor',
    status: 'status',
    'latest invoices': 'senaste fakturor',
    customer: 'kund',
    customers: 'kunder',
    inventory: 'inventering',
    account: 'kontot',
    'my account': 'mitt konto',
    provider: 'leverantör',
    'provider type': 'leverantörstyp',
    'provider address': 'leverantörsadress',
    'provider email': 'leverantörens e-postadress',
    'provider phone': 'leverantörens telefonnummer',
    'payment info': 'betalningsinformation',
    profile: 'profil',
    'user profile': 'användarprofil',
    settings: 'inställningar',
    'account settings': 'kontoinställningar',
    'account id': 'kontoid',
    id: 'id',
    // Organization
    'select customer type': 'välj kundtyp',
    'select type': 'välj typ',
    organization: 'företag',
    organizations: 'företag',
    name: 'namn',
    'organization name': 'företagnamn',
    'organization type': 'företagstyp',
    'is private': 'är privat',
    'is charity': 'är en välgörenhetsorganisation',
    // Individual
    individual: 'enskild',
    individuals: 'enskilda',
    'first name': 'fornamn',
    'last name': 'efternamn',
    'middle name': 'mellanamn',
    'full name': 'fullt namn',
    dob: 'fd',
    'date of birth': 'födelsedatum',
    'enter the date of birth': 'ange födelsedatum',
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
    'please enter the user ID': 'var god ange användar-ID',
    // Attributes
    'add another attribute': 'lägg till ett annat attribut',
    'add attribute': 'lägg till en attribut',
    text: 'text',
    value: 'värde',
    // Inventory
    price: 'pris',
    'internal code': 'intern kod',
    'external code': 'extern kod',
    'manufacturer code': 'tillverkarekod',
    'manufacturer price': 'tillverkarepris',
    miscellaneous: 'annan',
    product: 'produkt',
    service: 'tjänst',
    // Invoices
    draft: 'utkast',
    pending: 'avvaktande',
    paid: 'betalat',
    cancelled: 'avbruten',
    tax: 'moms/VAT',
    'payment terms': 'betalningsvillkor',
    'rebate/discount': 'rabatt/avdrag',
    notes: 'anteckningar',
    'enter tax': 'ange moms/VAT',
    'invoice number': 'faktureringsnummer',
    'invoice date': 'faktureringsdatum',
    'enter the date the invoice have been paid on': 'ange datumet faktureringen har blivit betald',
    'enter the invoice number': 'ange faktureringsnummer',
    'enter the invoice date': 'ange faktureringsdatum',
    'select customer': 'välj en kund',
    'purchase order numbers': 'kundordernummer',
    'enter purchase order numbers': 'ange kundordernummer',
    'enter manufacturer invoice numbers (you can enter multiple)':
        'ange tillverkarefaktureringsnummer (du kan ange flera)',
    'manufacturer invoice numbers': 'tillverkarefaktureringsnummer',
    'enter manufacturer invoice numbers': 'ange tillverkarefaktureringsnummer',
    'additional information': 'yterligare information',
    'enter any additional information for customer':
        'ange eventuell ytterligare information för kunden',
    'payment information': 'betalningsinformation',
    'enter payment information such as payment method and/or bank routing and account':
        'ange betalningsinformation såsom betalningsmetod och/eller bankkonto',
    'latest payment date': 'senaste betalningsdatum',
    'enter the date the invoice must be paid by': 'ange det datum då fakturan ska betalas senast',
    'paid on date': 'betalat datum',
    'enter the date the invoice has been paid on': 'ange det datum då fakturan har blivit betalt',
    'enter payment terms': 'ange betalningsvillkor',
    'enter notes (for internal use)': 'ange anteckningar (för internt bruk)',
    'add invoice item': 'lägg till ett faktureringsobjekt',
    'add another invoice item': 'lägg till ett annat faktureringsobjekt',
    'inventory item name': 'inventeringsobjectetsnamn',

    'your phone': 'ditt telefon',
    'select your phone': 'välj ditt telefon',
    'select your phone (might be shown on the invoice)':
        'välj ditt telefon (kan möjligen visas på fakturan)',
    'your email': 'ditt e-post',
    'select your email': 'välj ditt e-post',
    'select your email (might be shown on the invoice)':
        'välj ditt e-post (kan möjligen visas på fakturan)',
    'customer name': 'kundnamn',
    'customer address': 'kundadress',
    'customer email': 'kundepostadress',
    'customer phone': 'kundtelefonnummer',
    title: 'benämning',
    quantity: 'antal',
    'sales tax': 'moms/VAT',
    delivery: 'leverans',
    freight: 'frakt',
    subtotal: 'delsumma',
    total: 'totalsumma',
    sum: 'belopp',
    amount: 'mängd',
    'select invoice status': 'välj faktureringsstatus',
    'enter inventory item name': 'ange inventeringsobjektnamn',
    // Errors
    'must be a number': 'måste vara ett nummer',
    'must be a date': 'måste vara ett datum',
    'could not load data': 'kunde inte ladda data',
    'please enter at least one character': 'var god ange minst ett tecken',
    'please enter the name': 'var god ange namnet',
    'please at least one invoice item': 'var god ange minst ett faktureringsobjekt',
    'please enter the first name': 'var god ange förnamn',
    'please enter the last name': 'var god ange efternamn',
    'please enter the street address': 'var god ange gatuadress',
    'please enter the city/village/locality': 'var god ange stad, by eller lokalitet',
    'please enter the region/state': 'var god ange län eller region',
    'please enter the zip/postal code': 'var god ange postnummer',
    'please enter the country': 'var god ange landet',
    'please enter the company name': 'var god ange företagsnamn',
    'please enter the price': 'var god ange priset',
    'price cannot be less than 0.01': 'priset kan inte vara mindre än 0.01',
    'price cannot be more than 999 999 999 999.99':
        'priset kan inte vara mer än 999 999 999 999.99',
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
    'please enter the inventory item name': 'var god ange inventeringsobjectetsnamn',
    'please enter the inventory item type': 'var god ange inventeringsobjectetstyp',
    'please enter the invoice number': 'var god ange fakturanummer',
    'please enter tax': 'var god ange momsats/VAT',
    'the tax cannot be less than 0': 'momsatsen kan inte vara mindre än 0',
    'the tax cannot be more than 100': 'momsatsen kan inte vara mer än 100',
    'the discount cannot be less than 0': 'rabatten kan inte vara mindre än 0',
    'the discount cannot be more than 100': 'rabatten kan inte vara mer än 100',
    'please select inventory item to get the price':
        'val ett inventeringsobjectetsnamn för att fa priset',
    'please enter a customer': 'var god ange en kund',
    'file must be a PNG, JPG, JPEG, WEBP, or SVG image':
        'filen måste vara en PNG, JPG, JPEG, WEBP, eller SVG bild',
    // Buttons
    'create customer': 'skapa en kund',
    'update customer': 'redigera kunden',
    'delete customer': 'ta bort kunden',
    'create inventory': 'skapa inventering',
    'create inventory item': 'skapa inventeringsobject',
    'create invoice': 'skapa en faktura',
    'update invoice': 'redigera faktura',
    'update inventory item': 'redigera inventeringsobject',
    'view invoice': 'visa faktura',
    'create profile': 'skapa användarprofil',
    'update profile': 'redigera användarprofil',
    'create provider': 'skapa en leverantör',
    'update provider': 'redigera leverantör',
    'update user profile': 'redigera användarprofil',
    'update account': 'redigera konto',
    'dense padding': 'tät stoppning',
    // Tooltips
    filter: 'filter',
    'additional filter': 'yttre filter',
    'click to see more filters': 'klicka för att se mer filter',
    'filter list': 'filterlista',
    'click to change avatar': 'klicka för att byta avatar',
    'click to delete avatar': 'klicka för att ta bort avatar',
    // Reports
    collected: 'insamlad',
    'paid invoices': 'betalade fakturor',
    'pending invoices': 'avvaktande fakturor',
    'total invoices': 'totala fakturor',
    'total customers': 'totala kunder',
    // Miscellaneous
    search: 'sök',
    'search customers': 'sök kunder',
    'search invoices': 'sök fakturor',
    'by name, phone or email': 'sök på namn, telefon eller e-post',
    'please create provider first': 'var god skapa leverantören',
    'please create user profile first': 'var god skapa användarprofil',
    'click icon to the right to upload avatar': 'klicka på ikonen för att ladda upp avatar',
    'click icon to the right to upload logo': 'klicka på ikonen för att ladda upp logo'
};

const sv = {
    ...svSingle,
    ...svPlural
} as const;

export default sv;
