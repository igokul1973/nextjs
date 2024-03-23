// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data

import { UserRoleEnum } from '@prisma/client';

const countries = [{ name: 'Russia' }, { name: 'Sweden' }, { name: 'USA' }];

const organizationTypes = [
    { type: 'Corporation' },
    { type: 'Handelsbolag' },
    { type: 'AB' },
    { type: 'LLC' }
];

const inventoryTypes = [{ type: 'product' }, { type: 'service' }];

const users = [
    {
        name: 'igor',
        email: 'igor@igor.com',
        phone: '+15127601955',
        password: '123456',
        role: UserRoleEnum.superuser
    },
    {
        name: 'admin1',
        email: 'admin1@admin1.com',
        phone: '+17127601933',
        password: '123456',
        role: UserRoleEnum.admin
    },
    {
        name: 'admin2',
        email: 'admin2@admin2.com',
        phone: '+12127601966',
        password: '123456',
        role: UserRoleEnum.admin
    },
    {
        name: 'user1',
        email: 'user1@user1.com',
        phone: '+13128601919',
        password: '123456',
        role: UserRoleEnum.reader
    }
];

const profiles = [
    {
        firstName: 'Steven',
        lastName: 'Ku',
        middleName: 'Balezny'
    },
    {
        firstName: 'Norma',
        lastName: 'Dobbs'
    },
    {
        firstName: 'Milly',
        lastName: 'Snouts',
        middleName: 'Karin'
    },
    {
        firstName: 'Lenny',
        lastName: 'Kravits'
    }
];

const customers = [
    {
        id: '3958dc91-712f-4377-85e9-fec4b6a64987',
        name: 'Delba de Oliveira',
        email: 'delba@oliveira.com',
        image_url: '/customers/delba-de-oliveira.png'
    },
    {
        id: '3958dc9e-742f-4377-85e9-fec4b6a64398',
        name: 'Lee Robinson',
        email: 'lee@robinson.com',
        image_url: '/customers/lee-robinson.png'
    },
    {
        id: '3958dc9f-737f-4377-85e9-fec4b6a64ba3',
        name: 'Hector Simpson',
        email: 'hector@simpson.com',
        image_url: '/customers/hector-simpson.png'
    },
    {
        id: '50ca3e18-62cd-11ee-8c99-0242ac120002',
        name: 'Steven Tey',
        email: 'steven@tey.com',
        image_url: '/customers/steven-tey.png'
    },
    {
        id: '3958dc9f-787f-4377-85e9-fec4b6a64dc5',
        name: 'Steph Dietz',
        email: 'steph@dietz.com',
        image_url: '/customers/steph-dietz.png'
    },
    {
        id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
        name: 'Michael Novotny',
        email: 'michael@novotny.com',
        image_url: '/customers/michael-novotny.png'
    },
    {
        id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
        name: 'Evil Rabbit',
        email: 'evil@rabbit.com',
        image_url: '/customers/evil-rabbit.png'
    },
    {
        id: '126eed9c-c90c-4ef6-a4a8-fcf7408d3c66',
        name: 'Emil Kowalski',
        email: 'emil@kowalski.com',
        image_url: '/customers/emil-kowalski.png'
    },
    {
        id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
        name: 'Amy Burns',
        email: 'amy@burns.com',
        image_url: '/customers/amy-burns.png'
    },
    {
        id: '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
        name: 'Balazs Orban',
        email: 'balazs@orban.com',
        image_url: '/customers/balazs-orban.png'
    }
];

const invoices = [
    {
        customer_id: customers[0].id,
        amount: 15795,
        status: 'pending',
        date: '2022-12-06'
    },
    {
        customer_id: customers[1].id,
        amount: 20348,
        status: 'pending',
        date: '2022-11-14'
    },
    {
        customer_id: customers[4].id,
        amount: 3040,
        status: 'paid',
        date: '2022-10-29'
    },
    {
        customer_id: customers[3].id,
        amount: 44800,
        status: 'paid',
        date: '2023-09-10'
    },
    {
        customer_id: customers[5].id,
        amount: 34577,
        status: 'pending',
        date: '2023-08-05'
    },
    {
        customer_id: customers[7].id,
        amount: 54246,
        status: 'pending',
        date: '2023-07-16'
    },
    {
        customer_id: customers[6].id,
        amount: 666,
        status: 'pending',
        date: '2023-06-27'
    },
    {
        customer_id: customers[3].id,
        amount: 32545,
        status: 'paid',
        date: '2023-06-09'
    },
    {
        customer_id: customers[4].id,
        amount: 1250,
        status: 'paid',
        date: '2023-06-17'
    },
    {
        customer_id: customers[5].id,
        amount: 8546,
        status: 'paid',
        date: '2023-06-07'
    },
    {
        customer_id: customers[1].id,
        amount: 500,
        status: 'paid',
        date: '2023-08-19'
    },
    {
        customer_id: customers[5].id,
        amount: 8945,
        status: 'paid',
        date: '2023-06-03'
    },
    {
        customer_id: customers[2].id,
        amount: 8945,
        status: 'paid',
        date: '2023-06-18'
    },
    {
        customer_id: customers[0].id,
        amount: 8945,
        status: 'paid',
        date: '2023-10-04'
    },
    {
        customer_id: customers[2].id,
        amount: 1000,
        status: 'paid',
        date: '2022-06-05'
    }
];

const revenue = [
    { month: 'Jan', revenue: 2000 },
    { month: 'Feb', revenue: 1800 },
    { month: 'Mar', revenue: 2200 },
    { month: 'Apr', revenue: 2500 },
    { month: 'May', revenue: 2300 },
    { month: 'Jun', revenue: 3200 },
    { month: 'Jul', revenue: 3500 },
    { month: 'Aug', revenue: 3700 },
    { month: 'Sep', revenue: 2500 },
    { month: 'Oct', revenue: 2800 },
    { month: 'Nov', revenue: 3000 },
    { month: 'Dec', revenue: 4800 }
];

const productTypes = [
    {
        id: '3838da91-714f-4377-85e9-fec4b6a52989',
        type: 'service'
    },
    {
        id: '5458ac91-732f-4321-75e9-fecbb3a64187',
        type: 'goods'
    }
];

const products = [
    {
        name: 'Installation of pipes',
        description: 'Drawing of pipes to different locations',
        typeId: '3838da91-714f-4377-85e9-fec4b6a52989',
        code: '',
        price: 39023
    },
    {
        name: 'Installation of kitchen basin',
        description: 'Installation of kitchen basin with all sorts of screws',
        typeId: '3838da91-714f-4377-85e9-fec4b6a52989',
        code: '',
        price: 39302
    },
    {
        name: 'Kitchen basin',
        description: 'Stainless steel kitchen basin with outlet for swills',
        typeId: '5458ac91-732f-4321-75e9-fecbb3a64187',
        code: 'KB1502RTR',
        price: 93903
    },
    {
        name: 'Pipe 12 inch',
        typeId: '5458ac91-732f-4321-75e9-fecbb3a64187',
        code: 'PP1202RTP',
        price: 3922
    },
    {
        name: 'Pipe 24 inch',
        typeId: '5458ac91-732f-4321-75e9-fecbb3a64187',
        code: 'PP2412RTP',
        price: 4323
    },
    {
        name: 'Pipe 36 inch',
        typeId: '5458ac91-732f-4321-75e9-fecbb3a64187',
        code: 'PP3627RTP',
        price: 6549
    },
    {
        name: 'Looking glass',
        description:
            'A beautiful and framed piece of oval glass where humans and animals can watch themselves',
        typeId: '5458ac91-732f-4321-75e9-fecbb3a64187',
        code: 'LG3672GGP',
        price: 17440
    }
];

export {
    countries,
    inventoryTypes,
    invoices,
    organizationTypes,
    productTypes,
    products,
    profiles,
    revenue,
    users
};
