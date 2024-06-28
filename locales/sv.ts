import { TPluralTranslationKeyRaw, TSingleTranslationKey } from './types';

const svPlural: Record<TPluralTranslationKeyRaw, string> = {
    'must be digits#other': 'måste vara {count} siffror',
    'must be up to digits#other': 'måste vara upp till {count} siffror',
    'can have up to decimal digits#other': 'kan ha upp till {count} decimaler',
    'must be at least characters#other': 'kan inte vara mindre än {count} tecken',
    'must be less than characters#other': 'kan inte vara mer än {count} tecken',
    'must be less than#other': 'måste vara mindre än {count}',
    'must be less than or equal to#other': 'måste vara mindre eller lika med {count}',
    'must be greater than or equal to#other': 'måste vara mer än eller lika med {count}',
    'must be greater than#other': 'måste vara mer än {count}',
    'price cannot be more than 999 999 999 999.99':
        'priset kan inte vara mer än 999 999 999 999.99',
    'file size must be less than kb#other': 'filen måste vara mindre än {count} KB',
    'file size must be less than mb#other': 'filen måste vara mindre än {count} MB',
    'square picture (png, jpg, jpeg or svg) with max file size: kb#other':
        'fyrkantig bild (png, jpg, jpeg eller svg) med maximal filstorlek: {count} KB',
    'square picture (png, jpg, jpeg or svg) with max file size mb#other':
        'fyrkantig bild (png, jpg, jpeg eller svg) med maximal filstorlek: {count} MB'
};

const svSingle: Record<TSingleTranslationKey, string> = {
    create: 'skapa',
    show: 'visa',
    add: 'lägg till',
    edit: 'redigera',
    delete: 'ta bort',
    save: 'spara',
    cancel: 'avbryt',
    next: 'nästa',
    previous: 'föregående',
    'log out': 'logga ut',
    'log in': 'logga in',
    'click on the icons below to sign in with social apps':
        'klicka på de ikonerna nedan för att logga in med sociala apper',
    yes: 'ja',
    no: 'nej',
    'not provided': 'ej angiven',
    type: 'typ',
    close: 'stäng',
    actions: 'åtgärder',
    date: 'datum',
    // Navigation
    home: 'hem',
    avatar: 'avatar',
    logo: 'logo',
    pdf: 'pdf',
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
    'select provider type': 'välj leverantörstyp',
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
    'customer number': 'kundnummer',
    'enter customer number': 'ange kundnummer',
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
    'select country': 'välj land',
    'enter the country': 'ange landet',
    'please enter the user ID': 'var god ange användar-ID',
    // Phones
    phones: 'telefonnummer',
    number: 'nummer',
    'phone number': 'telefonnummer',
    'add phone': 'lägg till telefon nummer',
    'add another phone': 'lägg till ett annat telefonnummer',
    'country code': 'landskod',
    'phone country code': 'telefonslandskod',
    'please enter the country code': 'var god ange telfonslandskod',
    'please enter the phone number': 'var god ange telefonnummer',
    'please enter the phone type': 'var god ange telefontyp',
    // Emails
    email: 'e-post',
    'email addresses': 'e-postadress',
    'add email address': 'lägg till e-postadress',
    'add another email address': 'lägg till en annan e-postadress',
    'please enter the email address': 'var god ange e-postadress',
    'please enter the email type': 'var god ange e-posttyp',
    // Attributes
    'additional attributes': 'ytterligare attribut',
    'add another attribute': 'lägg till ett annat attribut',
    'add attribute': 'lägg till en attribut',
    'you have no attributes. Add one by clicking button below.':
        'du har inte attribut. Lägg till en genom att klicka på knappen nedan.',
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
    'sales tax': 'momssats',
    your: 'er',
    our: 'vår',
    'bill to': 'faktura till',
    'your reference': 'er referens',
    'our reference': 'vår referens',
    'customer SSN': 'customer pers.nr',
    'customer EIN': 'customer org.nr',
    'customer reference': 'kundreferens',
    'customer reference for this invoice': 'kundreferens for fakturan',
    'provider reference': 'leverantörreferens',
    'provider reference for this invoice': 'leverantörreferens for fakturan',
    'pay by date': 'förfallodag',
    'payment terms': 'betalningsvillkor',
    terms: 'andra villkor',
    'rebate/discount': 'rabatt/avdrag',
    discount: 'rabatt',
    'item subtotal': 'delpris',
    notes: 'anteckningar',
    'your internal notes': 'dina interna anteckningar',
    unit: 'enhet',
    'measurement unit': 'enhet',
    'enter tax': 'ange moms/VAT',
    'invoice number': 'faktureringsnummer',
    'invoice date': 'faktureringsdatum',
    'enter the date the invoice have been paid on': 'ange datumet faktureringen har blivit betald',
    'enter the invoice number': 'ange faktureringsnummer',
    'enter the invoice date': 'ange faktureringsdatum',
    'select customer': 'välj en kund',
    'purchase order numbers': 'kundordernummer',
    'enter purchase order numbers': 'ange kundordernummer',
    'enter text and click enter': 'ange texten och klicka på Enter',
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
    'inventory item name': 'inventeringsobjectnamn',
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
    tax: 'moms/VAT',
    delivery: 'leverans',
    'delivery terms': 'leveransvillkor',
    freight: 'frakt',
    subtotal: 'delsumma',
    total: 'totalsumma',
    'invoice total': 'fakturasumma',
    'payment amount': 'betalningssumma',
    'subtotal (before tax and discount)': 'delsumma (före moms och rabatt)',
    'tax total': 'fakturamoms',
    'discount total': 'fakturarabatt',
    sum: 'belopp',
    amount: 'mängd',
    'select invoice status': 'välj faktureringsstatus',
    'enter inventory item name': 'ange inventeringsobjektnamn',
    'enter inventory name, code, or description':
        'ange inventeringsobjektnamn, kod eller beskrivning',
    'select unit': 'välj enhet',
    'for billing inquiries': 'för faktureringsförslag',
    // Account settings
    'account settings description':
        'kontoinställningar är standardvärden som visas på nya fakturor och/eller regulerar utseende av alla fakturor. Klicka på knappen Redigera Inställningar för att ändra dem',
    'hover to learn more': 'håll muspekaren över fältnamnet eller frågetecken för att lära dig mer',
    'date format': 'datumformat',
    'display customer SSN or EIN': 'visa kundens person/organisationsnummer',
    'obfuscate customer SSN or EIN': 'fördunkla kundens person/organisationsnummer',
    'display provider SSN or EIN': 'visa leverantörens person/organisationsnummer',
    'obfuscate provider SSN or EIN': 'fördunkla leverantörens  person/organisationsnummer',
    'provider invoice phone type': 'leverantörens faktura telefon typ',
    'provider invoice email type': 'leverantörens faktura e-post typ',
    'display customer local identifier': 'visa kundens person/organisationsnummer',
    'obfuscate customer local identifier':
        'fördunkla kundens personnummer eller organisationsnummer',
    'display your local identifier': 'visa ditt person/organisationsnummer',
    'obfuscate your local identifier': 'fördunkla ditt personnummer eller organisationsnummer',
    'preferred provider invoice phone type': 'föredragen leverantörs fakturatelefontyp',
    'preferred provider invoice email type': 'föredragen leverantörs faktura e-posttyp',
    // Errors
    'no changes detected': 'ingen ändring hittades',
    'no provider was found, redirecting...': 'ingen leverantör hittades, omdirigerar...',
    'no customer was found, redirecting...': 'ingen kund hittades, omdirigerar...',
    'no invoice was found, redirecting...': 'ingen faktura hittades, omdirigerar...',
    'must be a number': 'måste vara ett nummer',
    'must be a date': 'måste vara ett datum',
    'invoice not found': 'fakturan hittades inte',
    'invoice cannot be deleted because it was already paid':
        'fakturan kan inte raderas eftersom den redan har blivit betald',
    'could not load data': 'kunde inte ladda data',
    'please enter the user role': 'var god ange användarrollen',
    'please enter at least one character': 'var god ange minst ett tecken',
    'please enter the name': 'var god ange namnet',
    'please enter the locale code': 'var god ange lokala kod',
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
    'please select the inventory item name': 'var god välj inventeringsobjectetsnamn',
    'please select inventory item': 'var god välj inventeringsobjectet',
    'please enter the inventory item type': 'var god ange inventeringsobjectetstyp',
    'please enter the invoice number': 'var god ange fakturanummer',
    'please enter at least one invoice item': 'var god ange minst ett faktureringsobjekt',
    'please enter tax': 'var god ange momsats/VAT',
    'please enter the date format': 'var god ange datumformat',
    'the tax cannot be less than 0': 'momsatsen kan inte vara mindre än 0',
    'the tax cannot be more than 100': 'momsatsen kan inte vara mer än 100',
    'the discount cannot be less than 0': 'rabatten kan inte vara mindre än 0',
    'the discount cannot be more than 100': 'rabatten kan inte vara mer än 100',
    'customer ID is missing': 'kund-ID saknas',
    'select inventory item to get the price or enter one manually':
        'val ett inventeringsobjectetsnamn för att fa priset eller ange det manuellt',
    'please enter a customer': 'var god ange en kund',
    'file must be a PNG, JPG, JPEG, WEBP or SVG image':
        'filen måste vara en PNG, JPG, JPEG, WEBP eller SVG bild',
    'file must be a PNG, JPG, JPEG or SVG image':
        'filen måste vara en PNG, JPG, JPEG eller SVG bild',
    'enter the unit': 'ange enhet',
    'unit type is incorrect': 'enhettypen är felaktig',
    'enter additional terms': 'ange ytterligare villkor',
    'please enter the account ID': 'var god ange konto-ID',
    'could not get provider form data': 'kunde inte få leverantörsdata',
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
    'view pdf invoice': 'visa PDF faktura',
    'create profile': 'skapa användarprofil',
    'update profile': 'redigera användarprofil',
    'create settings': 'skapa inställningar',
    'update settings': 'redigera inställningar',
    'create provider': 'skapa en leverantör',
    'update provider': 'redigera leverantör',
    'update user profile': 'redigera användarprofil',
    'update account': 'redigera konto',
    'update account settings': 'redigera kontoinställningar',
    'dense padding': 'tät stoppning',
    // Tooltips
    filter: 'filter',
    'additional filter': 'yttre filter',
    'click to see more filters': 'klicka för att se mer filter',
    'filter list': 'filterlista',
    'click to change avatar': 'klicka för att byta avatar',
    'click to delete avatar': 'klicka för att ta bort avatar',
    'provide default phone type for new invoices': 'ange standardtelefontyp för nya fakturor',
    'provide default email type for new invoices': 'ange standardposttyp för nya fakturor',
    'check the box if your company is not owned by government':
        'markera om din företag är ej utvecklad av staten',
    'check the box if your company is a charity':
        'markera om din företag är en välgörenhetsorganisation',
    'check the box if to show your SSN or EIN':
        'kryssa i rutan om du vill visa ditt personnummer eller organisationsnummer på fakturor',
    'check the box if to show only last 4 characters of your SSN or EIN':
        'kryssa i rutan om du endast vill visa de 4 sista tecken i ditt personnummer eller organisationsnummer på fakturor',
    'check the box if to show customer SSN or EIN': `kryssa i rutan om du vill visa kundens personnummer eller organisationsnummer på fakturor`,
    'check the box if to show only last 4 characters of customer SSN or EIN': `kryssa i rutan om du endast vill visa de 4 sista tecken i kundens personnummer eller organisationsnummer på fakturor`,
    'display customer SSN or EIN tooltip':
        'visa på dokument kundens personnummer eller organisationsnummer',
    'obfuscate customer SSN or EIN tooltip':
        'för säkerheten visa på dokument bara de 4 sista tecken i kundens personnummer eller organisationsnummer',
    'display your SSN or EIN tooltip': 'visa på dokument er personnummer eller organisationsnummer',
    'obfuscate your SSN or EIN tooltip':
        'för säkerheten visa på dokument bara de 4 sista tecken i er personnummer eller organisationsnummer',
    'bank account/routing number/other means of payment':
        'bankgiro/kontonummer/andra betalningsmetoder som anges i fakturor',
    // Reports
    collected: 'insamlad',
    'paid invoices': 'betalade fakturor',
    'pending invoices': 'avvaktande fakturor',
    'total invoices': 'totala fakturor',
    'total customers': 'totala kunder',
    // Snackbar
    'successfully created customer': 'kunden har skapats',
    'successfully updated customer': 'kunden har uppdaterats',
    'could not create customer': 'kunde inte skapa kunden',
    'could not update customer': 'kunde inte uppdatera kunden',
    'could not delete customer': 'kunde inte ta bort kunden',
    'cannot delete customer because it has associated invoices':
        'kunde inte ta bort kunden eftersom den har associerade fakturor',
    'successfully created provider': 'leverantören har skapats',
    'successfully updated provider': 'leverantören har uppdaterats',
    'could not create provider': 'kunde inte skapa leverantören',
    'could not update provider': 'kunde inte uppdatera leverantören',
    'could not delete provider': 'kunde inte ta bort leverantören',
    'successfully created invoice': 'fakturan har skapats',
    'successfully updated invoice': 'fakturan har uppdaterats',
    'successfully deleted invoice': 'fakturan har borttagits',
    'could not create invoice': 'kunde inte skapa fakturan',
    'could not update invoice': 'kunde inte uppdatera fakturan',
    'could not delete invoice': 'kunde inte ta bort fakturan',
    'successfully created inventory item': 'inventeringsobjektet har skapats',
    'successfully updated inventory item': 'inventeringsobjektet har uppdaterats',
    'could not create inventory item': 'kunde inte skapa inventeringsobjektet',
    'could not update inventory item': 'kunde inte uppdatera inventeringsobjektet',
    'could not delete inventory item': 'kunde inte ta bort inventeringsobjektet',
    'cannot delete inventory item because it has associated invoices':
        'kunde inte ta bort inventeringsobjektet eftersom den har associerade fakturor',
    'cannot create user - email already exists': 'kunde inte skapa användare - e-post finns redan',
    'cannot create user - phone already exists': 'kunde inte skapa användare - telefon finns redan',
    'successfully created user': 'användaren har skapats',
    'successfully updated user': 'användaren har uppdaterats',
    'could not create user': 'kunde inte skapa användaren',
    'successfully created user profile': 'användarprofilen har skapats',
    'successfully updated user profile': ' användarprofilen har uppdaterats',
    'could not create user profile': 'kunde inte skapa användarprofilen',
    'could not update user profile': 'kunde inte uppdatera användarprofilen',
    'could not delete user profile': 'kunde inte ta bort användarprofilen',
    'successfully created account settings': 'kontoinställningar har skapats',
    'successfully updated account settings': 'kontoinställningar har uppdaterats',
    'could not create account settings': 'kunde inte skapa kontoinställningar',
    'could not update account settings': 'kunde inte uppdatera kontoinställningar',
    'could not upload avatar': 'kunde inte ladda upp avatar',
    // Miscellaneous
    search: 'sök',
    'search customers': 'sök kunder',
    'search invoices': 'sök fakturor',
    'by name, phone or email': 'sök på namn, telefon eller e-post',
    'please create provider first': 'var god skapa leverantören',
    'please create user profile first': 'var god skapa användarprofil',
    'click icon to the right to upload avatar': 'klicka på ikonen för att ladda upp avatar',
    'click icon to the right to upload logo': 'klicka på ikonen för att ladda upp logo',
    'no logo provided': 'ingen logo har angivits',
    'before creating customers please register yourself as a Service Provider':
        'för att skapa kunder du skall registreras som leverantör',
    'select provider type and country above in order to see provider registration form':
        'valj leverantörstyp och land i ordning för att se leverantörsregistreringformulär'
};

const sv = {
    ...svSingle,
    ...svPlural
} as const;

export default sv;
