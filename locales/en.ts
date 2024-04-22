export const enPlural = {
    'must be digits#many': 'must be {count} digits',
    'must be up to digits#many': 'must be up to {count} digits'
};

export const enSingle = {
    create: 'create',
    add: 'add',
    edit: 'edit',
    delete: 'delete',
    save: 'save',
    cancel: 'cancel',
    'log out': 'log out',
    'log in': 'log in',
    yes: 'yes',
    no: 'no',
    type: 'type',
    close: 'close',
    // Navigation
    home: 'home',
    dashboard: 'dashboard',
    invoices: 'invoices',
    customers: 'customers',
    inventory: 'inventory',
    account: 'account',
    'my account': 'my account',
    provider: 'provider',
    'provider type': 'provider type',
    profile: 'profile',
    'user profile': 'user profile',
    settings: 'settings',
    'account settings': 'account settings',
    'account id': 'account id',
    id: 'id',
    // Organization
    'select customer type': 'select customer type',
    organization: 'organization',
    name: 'name',
    'organization name': 'organization name',
    'organization type': 'organization type',
    'is private': 'is private',
    'is charity': 'is charity',
    // Individual
    individual: 'individual',
    'first name': 'first name',
    'last name': 'last name',
    'middle name': 'middle name',
    'full name': 'full name',
    dob: 'dob',
    'date of birth': 'date of birth',
    'Enter the date of birth': 'Enter the date of birth',
    description: 'description',
    // Address
    address: 'address',
    'street address': 'street address',
    'address (line 2)': 'address (line 2)',
    'address (line 3)': 'address (line 3)',
    'enter street address and building number': 'enter street address and building number',
    'continue street address and/or apartment number':
        'continue street address and/or apartment number',
    locality: 'locality',
    'city or locality': 'city or locality',
    'enter city, village or locality': 'enter city, village or locality',
    region: 'region',
    'state or region': 'state or region',
    'enter state or region': 'Enter state or region',
    'postal code': 'postal code',
    'enter postal/zip code': 'enter postal/zip code',
    country: 'country',
    'enter the country': 'enter the country',
    // Phones
    phones: 'phones',
    number: 'number',
    'add phone': 'add phone',
    'add another phone': 'add another phone',
    'country code': 'country code',
    'phone country code': 'phone country code',
    'please enter the country code': 'please enter the country code',
    'please enter the phone number': 'please enter the phone number',
    'please enter the phone type': 'please enter the phone type',
    // Emails
    email: 'email',
    'email addresses': 'email addresses',
    'add email address': 'add email address',
    'add another email address': 'add another email address',
    'please enter the email address': 'please enter the email address',
    'please enter the email type': 'please enter the email type',
    // Attributes
    'add another attribute': 'add another attribute',
    'add attribute': 'add attribute',
    text: 'text',
    value: 'value',
    // Errors
    'please enter at least one character': 'please enter at least one character',
    'please enter the name': 'please enter the name',
    'please enter the first name': 'please enter the first name',
    'please enter the last name': 'please enter the last name',
    'please enter the street address': 'please enter the street address',
    'please enter the city/village/locality': 'please enter the city/village/locality',
    'please enter the region/state': 'please enter the region/state',
    'please enter the zip/postal code': 'please enter the zip/postal code',
    'please enter the country': 'please enter the country',
    'please enter the company name': 'please enter the company name',
    'the country code cannot be bigger than 999': 'the country code cannot be bigger than 999',
    'the phone number cannot have less than 8 digits':
        'the phone number cannot have less than 8 digits',
    'the phone number cannot have more than 14 digits':
        'the phone number cannot have more than 14 digits',
    'invalid date': 'invalid date',
    'please enter a valid email address': 'please enter a valid email address',
    'please enter the attribute type': 'please enter the attribute type',
    'please enter the attribute name': 'please enter the attribute name',
    'please enter the attribute value': 'please enter the attribute value',
    // Buttons
    'create customer': 'create customer',
    'update customer': 'update customer',
    'delete customer': 'delete customer',
    // Reports
    collected: 'collected',
    pending: 'pending',
    'paid invoices': 'paid invoices',
    'pending invoices': 'pending invoices',
    'total invoices': 'total invoices',
    'total customers': 'total customers',
    // Miscellaneous
    'search customers': 'search customers',
    search: 'search'
};

const en = {
    ...enSingle,
    ...enPlural
} as const;

export default en;
