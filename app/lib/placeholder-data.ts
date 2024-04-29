// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data

import {
    AccountRelationEnum,
    EmailTypeEnum,
    EntitiesEnum,
    InvoiceStatusEnum,
    PhoneTypeEnum,
    UserRoleEnum
} from '@prisma/client';
import { LocaleEnum } from './types.ts';

const countries = [
    {
        name: 'United States of America',
        abbreviation: 'USA',
        locale: LocaleEnum.en_US,
        phoneCode: 1,
        localIdentifierNames: [
            {
                name: 'Employer Identification Number',
                abbreviation: 'EIN',
                type: EntitiesEnum.organization
            },
            {
                name: 'Social Security Number',
                abbreviation: 'SSN',
                type: EntitiesEnum.individual
            }
        ]
    },
    {
        name: 'Sweden',
        locale: LocaleEnum.sv_SE,
        phoneCode: 46,
        localIdentifierNames: [
            {
                name: 'Organisationsnummer',
                type: EntitiesEnum.organization
            },
            {
                name: 'Personnummer',
                type: EntitiesEnum.individual
            }
        ]
    },
    {
        name: 'Russian Federation',
        abbreviation: 'Russia',
        locale: LocaleEnum.ru_RU,
        phoneCode: 7,
        localIdentifierNames: [
            {
                name: 'Основной государственный регистрационный номер',
                abbreviation: 'ОГРН',
                type: EntitiesEnum.organization
            },
            {
                name: 'Идентификационный номер налогоплательщика',
                abbreviation: 'ИНН',
                type: EntitiesEnum.individual
            }
        ]
    }
];

const organizationTypes = [
    { type: 'Corporation' },
    { type: 'Handelsbolag' },
    { type: 'AB' },
    { type: 'LLC' }
];

const inventoryTypes = [{ type: 'product' }, { type: 'service' }, { type: 'miscellaneous' }];

const users = [
    {
        email: 'admin1@admin.com',
        phone: '+17127601933',
        password: 'QuiteDifficult098$',
        role: UserRoleEnum.admin
    },
    {
        email: 'admin2@admin.com',
        phone: '+460857601966',
        password: 'QuiteDifficult098$',
        role: UserRoleEnum.admin
    },
    {
        email: 'writer1@writer.com',
        phone: '+463338601919',
        password: 'QuiteDifficult098$',
        role: UserRoleEnum.writer
    },
    {
        email: 'reader1@user.com',
        phone: '+468128901329',
        password: 'QuiteDifficult098$',
        role: UserRoleEnum.reader
    },
    {
        email: 'reader2@user.com',
        phone: '+463128601919',
        password: 'QuiteDifficult098$',
        role: UserRoleEnum.reader
    }
];

const profiles = [
    {
        firstName: 'Tony',
        lastName: 'Blair',
        middleName: 'Karin'
    },
    {
        firstName: 'Tania',
        lastName: 'Karlsonson'
    },
    {
        firstName: 'Peppa',
        lastName: 'Rigolson'
    },
    {
        firstName: 'Mia',
        lastName: 'Torvaldson'
    },
    {
        firstName: 'Rimma',
        lastName: 'Urkule'
    }
];

const providerIndividual = {
    firstName: 'Tony',
    lastName: 'Blair',
    dob: '1975-08-22',
    description: 'Description of Tony Blair, the service provider',
    localIdentifierValue: '3033-86-51',
    address: {
        addressLine1: '83 Nagano str.',
        locality: 'Nashville',
        region: 'TN',
        postcode: '93029-8332',
        country: countries[0].name
    },
    accountRelation: AccountRelationEnum.provider,
    emails: [{ email: 'tony@blair.us', type: EmailTypeEnum.main }],
    phones: [
        {
            countryCode: countries[0].phoneCode.toString(),
            number: '9392001921',
            type: PhoneTypeEnum.mobile
        }
    ]
};

const customerIndividuals = [
    {
        firstName: 'Delba',
        lastName: 'de Oliveira',
        dob: '2000-12-12',
        description: 'Description of the customer Delba de Oliveira',
        localIdentifierValue: '3234-23-33',
        address: {
            addressLine1: '93 Mowsel Street',
            addressLine2: 'apt. 20',
            locality: 'Portland',
            region: 'OR',
            postcode: '98093-4332',
            country: countries[0].name
        },
        accountRelation: AccountRelationEnum.customer,
        emails: [
            { email: 'delba@oliveira.se', type: EmailTypeEnum.main },
            { email: 'delba@work.com', type: EmailTypeEnum.work }
        ],
        phones: [
            {
                countryCode: countries[0].phoneCode.toString(),
                number: '8373282731',
                type: PhoneTypeEnum.work
            },
            {
                countryCode: countries[0].phoneCode.toString(),
                number: '9893627263',
                type: PhoneTypeEnum.home
            }
        ]
    },
    {
        firstName: 'Lee',
        lastName: 'Robinson',
        middleName: 'Horace',
        dob: '1976-12-12',
        description: 'Description of the customer Lee Horace Robinson',
        localIdentifierValue: '7483-73-82',
        address: {
            addressLine1: '131 New Boulevard',
            addressLine2: 'apt. 1',
            locality: 'Seattle',
            region: 'WA',
            postcode: '92023',
            country: countries[0].name
        },
        accountRelation: AccountRelationEnum.customer,
        emails: [{ email: 'leerobh@gmail.com', type: EmailTypeEnum.main }],
        phones: [
            {
                countryCode: countries[0].phoneCode.toString(),
                number: '3839292921',
                type: PhoneTypeEnum.work
            },
            {
                countryCode: countries[0].phoneCode.toString(),
                number: '8386572928',
                type: PhoneTypeEnum.mobile
            }
        ]
    },
    {
        firstName: 'Hector',
        lastName: 'Smith',
        dob: '1988-11-02',
        description: 'Description of the customer Hector Smith',
        localIdentifierValue: '0983-22-33',
        address: {
            addressLine1: '131 Palisadess',
            addressLine2: 'apt. 200',
            locality: 'Seattle',
            region: 'WA',
            postcode: '92025',
            country: countries[0].name
        },
        accountRelation: AccountRelationEnum.customer,
        emails: [{ email: 'hectorsmith11@gmail.com', type: EmailTypeEnum.main }],
        phones: [
            {
                countryCode: countries[0].phoneCode.toString(),
                number: '9392029300',
                type: PhoneTypeEnum.work
            },
            {
                countryCode: countries[0].phoneCode.toString(),
                number: '7476662827',
                type: PhoneTypeEnum.mobile
            }
        ]
    },
    {
        firstName: 'Mara',
        lastName: 'Karsson',
        dob: '1944-01-09',
        description: 'Description of the customer Mara Karsson',
        localIdentifierValue: '098398-2998',
        address: {
            addressLine1: 'Bagartoprsringen 39',
            addressLine2: 'lgh. 88',
            locality: 'Stockholm',
            region: 'Stockholm Lan',
            postcode: '939900',
            country: countries[1].name
        },
        accountRelation: AccountRelationEnum.customer,
        emails: [{ email: 'mara@gmail.com', type: EmailTypeEnum.other }],
        phones: [
            {
                countryCode: countries[1].phoneCode.toString(),
                number: '7476662827',
                type: PhoneTypeEnum.mobile
            }
        ]
    }
];

const providerOrganization = {
    name: 'SBR Nord Grupp, HB',
    description: 'Some SBR Nord Grupp HB description here. lorem ipsum',
    type: 'LLC',
    isPrivate: true,
    isCharity: false,
    localIdentifierValue: '9302194-3288',
    address: {
        addressLine1: 'Torvaldsongatu 33',
        addressLine2: '3 vaning',
        locality: 'Ekero',
        postcode: '930293',
        country: countries[1].name
    },
    accountRelation: AccountRelationEnum.provider,
    emails: [{ email: 'main@sbrnordgrupp.se', type: EmailTypeEnum.main }],
    phones: [
        {
            countryCode: countries[1].phoneCode.toString(),
            number: '9392039921',
            type: PhoneTypeEnum.work
        }
    ]
};

const customerOrganizations = [
    {
        name: 'Microsoft',
        description: 'Some Microsoft Co. description here. lorem ipsum',
        type: 'LLC',
        isPrivate: true,
        isCharity: false,
        localIdentifierValue: '3234-23-53',
        address: {
            addressLine1: '3234 Main Street',
            addressLine2: 'Suite 20',
            locality: 'New York',
            region: 'NY',
            postcode: '10023-4332',
            country: countries[0].name
        },
        accountRelation: AccountRelationEnum.customer,
        emails: [
            { email: 'main@microsoft.com', type: EmailTypeEnum.main },
            { email: 'invoicing@microsoft.com', type: EmailTypeEnum.invoicing }
        ],
        phones: [
            {
                countryCode: countries[0].phoneCode.toString(),
                number: '3423238593',
                type: PhoneTypeEnum.work
            },
            {
                countryCode: countries[0].phoneCode.toString(),
                number: '3428388784',
                type: PhoneTypeEnum.invoicing
            }
        ]
    },
    {
        name: 'Oracle',
        description: 'Some Oracle org description here. lorem ipsum and more stuff',
        type: 'Corporation',
        isPrivate: true,
        isCharity: true,
        localIdentifierValue: '1293-28-93',
        address: {
            addressLine1: '823 Willow Road',
            addressLine2: 'Suite 300',
            locality: 'Boston',
            region: 'MA',
            postcode: '73882',
            country: countries[0].name
        },
        accountRelation: AccountRelationEnum.customer,
        emails: [
            { email: 'main@oracle.com', type: EmailTypeEnum.main },
            { email: 'work@oracle.com', type: EmailTypeEnum.work }
        ],
        phones: [
            {
                countryCode: countries[0].phoneCode.toString(),
                number: '7579998583',
                type: PhoneTypeEnum.work
            },
            {
                countryCode: countries[0].phoneCode.toString(),
                number: '8384932811',
                type: PhoneTypeEnum.invoicing
            }
        ]
    },
    {
        name: 'Legman Brothers',
        description: `Some Legman Brothers org description here. lorem ipsum and more stuff. Here I am describing a whole lot of the company's stuff`,
        type: 'LLC',
        isPrivate: false,
        isCharity: false,
        localIdentifierValue: '8332-08-20',
        address: {
            addressLine1: '1 Tullamore Road',
            addressLine2: '3rd floor',
            addressLine3: 'Ste 2001',
            locality: 'Round Rock',
            region: 'TX',
            postcode: '78928',
            country: countries[0].name
        },
        accountRelation: AccountRelationEnum.customer,
        emails: [{ email: 'other@legman.com', type: EmailTypeEnum.other }],
        phones: [
            {
                countryCode: countries[0].phoneCode.toString(),
                number: '1234379990',
                type: PhoneTypeEnum.invoicing
            }
        ]
    },
    {
        name: 'ABC Handlesbolag',
        description: `Some ABC Handelsbolag org description here. lorem ipsum and more stuff. Here I am describing a whole lot of the company's stuff`,
        type: 'Handelsbolag',
        isPrivate: false,
        isCharity: false,
        localIdentifierValue: '8332-0970-08-20',
        address: {
            addressLine1: '1 Tullamore ringen',
            addressLine2: '3rd vaning',
            addressLine3: 'Ste 2001',
            locality: 'Kopenhaveg',
            region: 'Stockholm lan',
            postcode: '789280',
            country: countries[1].name
        },
        accountRelation: AccountRelationEnum.customer,
        emails: [{ email: 'other@abc.com', type: EmailTypeEnum.other }],
        phones: [
            {
                countryCode: countries[1].phoneCode.toString(),
                number: '9002932990',
                type: PhoneTypeEnum.mobile
            }
        ]
    },
    {
        name: 'ABC Actiebolag',
        description: `Some ABC Actiebolag org description here. lorem ipsum and more stuff. Here I am describing a whole lot of the company's stuff`,
        type: 'AB',
        isPrivate: true,
        isCharity: false,
        localIdentifierValue: '9392-9382-08-13',
        address: {
            addressLine1: '1 Ulvesta Vagen',
            addressLine2: '3rd vaning',
            locality: 'Balsta',
            postcode: '940989',
            country: countries[1].name
        },
        accountRelation: AccountRelationEnum.customer,
        emails: [{ email: 'other@abcactie.com', type: EmailTypeEnum.other }],
        phones: [
            {
                countryCode: countries[1].phoneCode.toString(),
                number: '9302223490',
                type: PhoneTypeEnum.mobile
            }
        ]
    },
    {
        name: 'Coolorobado AB',
        description: `Some Coolorobado AB org description here. lorem ipsum and more stuff. Here I am describing a whole lot of the company's stuff`,
        type: 'AB',
        isPrivate: true,
        isCharity: false,
        localIdentifierValue: '8985-3737-89-55',
        address: {
            addressLine1: '12 Morengen vagen',
            locality: 'Nyneshamn',
            postcode: '930290',
            country: countries[1].name
        },
        accountRelation: AccountRelationEnum.customer,
        emails: [{ email: 'main@Coolorobado.com', type: EmailTypeEnum.main }],
        phones: [
            {
                countryCode: countries[1].phoneCode.toString(),
                number: '4334129333',
                type: PhoneTypeEnum.work
            }
        ]
    }
];

const inventory = [
    {
        name: 'Product 1',
        description: 'Something 1 description',
        type: 'product',
        price: 1000,
        externalCode: 'RXF1TTS-D',
        internalCode: 'LPMRF32-X',
        manufacturerCode: 'TTS-LLMPD',
        manufacturerPrice: 800
    },
    {
        name: 'Product 2',
        description: 'Product 2 description',
        type: 'product',
        price: 800,
        externalCode: 'RXF1TTS-D',
        internalCode: 'LPMRF32-X',
        manufacturerCode: 'TTS-LLMPD',
        manufacturerPrice: 700
    },
    {
        name: 'Product 3',
        description: 'Product 3 description',
        type: 'product',
        price: 5000,
        externalCode: 'RXF1TTS-D',
        internalCode: 'LPMRF32-X',
        manufacturerCode: 'TTS-LLMPD',
        manufacturerPrice: 4000
    },
    {
        name: 'Product 4',
        description: 'Product 4 description',
        type: 'product',
        price: 800,
        externalCode: 'RXF1TTS-D',
        internalCode: 'LPMRF32-X',
        manufacturerCode: 'TTS-LLMPD',
        manufacturerPrice: 700
    },
    {
        name: 'Product 5',
        description: 'Product 5 description',
        type: 'product',
        price: 8000,
        externalCode: 'RXF1TTS-D',
        internalCode: 'LPMRF32-X',
        manufacturerCode: 'TTS-LLMPD',
        manufacturerPrice: 7000
    },
    {
        name: 'Product 6',
        description:
            'Product 6 description and this one is a pretty long one just in case I want to check how it will lay out',
        type: 'product',
        price: 1000,
        externalCode: 'RXF1TTS-D',
        internalCode: 'LPMRF32-X',
        manufacturerCode: 'TTS-LLMPD',
        manufacturerPrice: 500
    },
    {
        name: 'Service 1',
        description:
            'Service 1 description and this one is a pretty long one just in case I want to check how it will lay out',
        type: 'service',
        price: 10000,
        externalCode: 'KKF1TTS-D1',
        internalCode: 'DDMRF32-1'
    },
    {
        name: 'Service 2',
        description:
            'Service 2 description and this one is a pretty long one just in case I want to check how it will lay out',
        type: 'service',
        price: 20000,
        externalCode: 'KKF1TTS-D2',
        internalCode: 'DDMRF32-2'
    },
    {
        name: 'Service 3',
        description:
            'Service 3 description and this one is a pretty long one just in case I want to check how it will lay out',
        type: 'service',
        price: 30000,
        externalCode: 'KKF1TTS-D3',
        internalCode: 'DDMRF32-3'
    },
    {
        name: 'Service 4',
        description:
            'Service 4 description and this one is a pretty long one just in case I want to check how it will lay out',
        type: 'service',
        price: 40000,
        externalCode: 'KKF1TTS-D4',
        internalCode: 'DDMRF32-4'
    },
    {
        name: 'Service 5',
        description: 'Service 5 description and this one is - mummification',
        type: 'service',
        price: 50000,
        externalCode: 'KKF1TTS-D5',
        internalCode: 'DDMRF32-5'
    },
    {
        name: 'Service 6',
        description: 'Service 6 description pretty short now',
        type: 'service',
        price: 60000,
        externalCode: 'KKF1TTS-D6',
        internalCode: 'DDMRF32-6'
    },
    {
        name: 'Some miscellaneous stuff',
        description:
            'Some miscellaneous description pretty short now, but it still does what it has to',
        type: 'miscellaneous',
        price: 22700,
        externalCode: 'KKF1TTS-DM',
        internalCode: 'DDMRF32-M'
    },
    {
        name: 'Another miscellaneous stuff',
        description:
            'Some other badly needed and very long miscellaneous description pretty short now, but it still does what it has to. There is more description here than anywhere else in the world. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur exercitationem, unde maiores, asperiores, dolores inventore expedita sit dicta error fugiat necessitatibus commodi vero voluptate. Ut quo odit sapiente reprehenderit odio a distinctio, magnam saepe dicta quas quos laborum consequuntur repellendus enim, optio unde corrupti numquam ipsa culpa aut nostrum minima. Exercitationem nostrum, perspiciatis veritatis deleniti cum voluptate qui quod eligendi eius eum aspernatur! Animi excepturi quaerat repudiandae ex at labore, consequuntur in eum! Repellat dolores delectus sint aut suscipit ad mollitia explicabo optio. Nobis beatae laudantium modi, cum pariatur sint doloribus, incidunt eveniet natus ea reiciendis quam dignissimos sapiente architecto.',
        type: 'miscellaneous',
        price: 7470,
        externalCode: 'KKF1TTS-DM2',
        internalCode: 'DDMRF32-M2'
    }
];

const invoices = [
    {
        date: '2022-12-06',
        status: InvoiceStatusEnum.paid,
        purchaseOrderNumbers: ['PO9982734'],
        additionalInformation: 'Some additional information',
        payBy: '2022-12-30',
        paidOn: '2022-12-29',
        paymentInfo: 'This is a payment info',
        tax: 20
    },
    {
        date: '2023-02-16',
        status: InvoiceStatusEnum.paid,
        purchaseOrderNumbers: ['PO289374'],
        additionalInformation: 'Some additional information',
        manufacturerInvoiceNumbers: ['KK648929834-12'],
        payBy: '2023-03-12',
        paidOn: '2023-03-08',
        paymentInfo: 'This is a payment info',
        tax: 20
    },
    {
        date: '2023-03-26',
        status: InvoiceStatusEnum.paid,
        purchaseOrderNumbers: ['PO392384', 'PO389180'],
        additionalInformation: 'Some additional information',
        payBy: '2023-04-15',
        paidOn: '2023-04-19',
        paymentInfo: 'This is a payment info',
        notes: 'This company is sometimes overdue with its invoice payments',
        tax: 10,
        discount: 5
    },
    {
        date: '2023-05-11',
        status: InvoiceStatusEnum.pending,
        purchaseOrderNumbers: ['PO988984', 'PO389630'],
        payBy: '2023-06-11',
        paymentInfo: 'This is a payment info',
        tax: 20
    },
    {
        date: '2023-05-11',
        status: InvoiceStatusEnum.pending,
        purchaseOrderNumbers: ['PO322384'],
        payBy: '2023-06-11',
        paymentInfo: 'This is a payment info',
        tax: 10,
        discount: 5
    },
    {
        date: '2024-03-18',
        status: InvoiceStatusEnum.draft,
        purchaseOrderNumbers: ['PO392384'],
        manufacturerInvoiceNumbers: ['TT683K9834'],
        additionalInformation: 'Some additional information',
        payBy: '2024-04-15',
        paymentInfo: 'This is a payment info',
        notes: 'Gotta check out if anything is wrong before moving status to pending',
        tax: 10,
        discount: 5
    },
    {
        date: '2024-04-01',
        status: InvoiceStatusEnum.draft,
        purchaseOrderNumbers: ['PO392384', 'POPR63K9834'],
        manufacturerInvoiceNumbers: ['TT683K9834'],
        additionalInformation: 'Some additional information',
        payBy: '2024-04-19',
        paymentInfo: 'This is a payment info for my company',
        tax: 10
    }
];

// const revenue = [
//     { month: 'Jan', revenue: 2000 },
//     { month: 'Feb', revenue: 1800 },
//     { month: 'Mar', revenue: 2200 },
//     { month: 'Apr', revenue: 2500 },
//     { month: 'May', revenue: 2300 },
//     { month: 'Jun', revenue: 3200 },
//     { month: 'Jul', revenue: 3500 },
//     { month: 'Aug', revenue: 3700 },
//     { month: 'Sep', revenue: 2500 },
//     { month: 'Oct', revenue: 2800 },
//     { month: 'Nov', revenue: 3000 },
//     { month: 'Dec', revenue: 4800 }
// ];

export {
    countries,
    customerIndividuals,
    customerOrganizations,
    inventory,
    inventoryTypes,
    invoices,
    organizationTypes,
    profiles,
    providerIndividual,
    providerOrganization,
    users
};
