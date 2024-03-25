import dotenv from 'dotenv';
// import {
//     customers,
//     invoices,
//     productTypes,
//     products,
//     revenue,
//     users
// } from "../app/lib/placeholder-data.ts";
import { EntitiesEnum, UserRoleEnum } from '@prisma/client';
import bcrypt from 'bcrypt';
import { IProfile, IUser } from '../app/lib/definitions';
import {
    countries,
    inventoryTypes,
    organizationTypes,
    profiles,
    providerIndividual,
    providerOrganization,
    users
} from '../app/lib/placeholder-data.ts';
import prisma from '../app/lib/prisma.ts';

dotenv.config();

async function deleteAllTables() {
    return prisma.$queryRaw`
      do $$ declare
          r record;
      begin
          for r in (select tablename from pg_tables where schemaname = 'public') loop
              execute 'drop table if exists ' || quote_ident(r.tablename) || ' cascade';
          end loop;
      end $$;
      `;
}

async function getSupervisor() {
    const supervisor = await prisma.user.findFirst({
        where: {
            role: UserRoleEnum.superuser
        }
    });

    if (!supervisor) throw Error('The superuser is not found. Please seed the superuser first.');
    return supervisor;
}

async function getAdmins() {
    const admins = await prisma.user.findMany({
        where: {
            role: UserRoleEnum.admin
        }
    });

    if (!admins.length) {
        throw Error('The admin users are not found. Please seed the admin users first.');
    }

    return admins;
}

async function getNotSuperuserUsers() {
    const users = await prisma.user.findMany({
        where: {
            role: {
                not: UserRoleEnum.superuser
            }
        }
    });

    if (!users.length) {
        throw Error('The non-superusers users are not found. Please seed them first.');
    }
    return users;
}

async function getOrganizationTypes() {
    const orgTypes = await prisma.organizationType.findMany();

    if (!orgTypes.length) {
        throw Error('The orgTypes are not found. Please seed them first.');
    }
    return orgTypes;
}
async function getCountries() {
    const countries = await prisma.country.findMany();

    if (!countries.length) {
        throw Error('The countries are not found. Please seed them first.');
    }
    return countries;
}

async function getlocalIdentifiers() {
    const localIdentifiers = await prisma.localIdentifierName.findMany();

    if (!localIdentifiers.length) {
        throw Error('The localIdentifiers are not found. Please seed them first.');
    }
    return localIdentifiers;
}

async function createUUIDExtension() {
    console.log('Creating UUID Extension...');
    return prisma.$queryRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
}

async function removeUUIDExtension() {
    console.log('Removing UUID Extension...');
    return prisma.$queryRaw`DROP EXTENSION IF EXISTS "uuid-ossp"`;
}

async function seedSuperuser() {
    console.log('Seeding superuser...');
    const superuser = {
        email: process.env.SUPERUSER_EMAIL || '',
        phone: process.env.SUPERUSER_PHONE || '',
        password: process.env.SUPERUSER_PASSWORD || '',
        role: UserRoleEnum.superuser
    } satisfies Omit<IUser, 'id'>;

    if (Object.values(superuser).some((v) => !v)) {
        throw Error(
            'The env variables for superuser are not complete or found, please check your environment.'
        );
    }

    const superuserProfile = {
        firstName: process.env.SUPERUSER_PROFILE_FIRST_NAME || 'Steven',
        lastName: process.env.SUPERUSER_PROFILE_LAST_NAME || 'Ku'
    } satisfies Pick<IProfile, 'firstName' | 'lastName'>;

    const hashedPassword = await bcrypt.hash(superuser.password, 10);

    const res = await prisma.account.create({
        select: {
            users: {
                select: {
                    id: true
                }
            }
        },
        data: {
            users: {
                create: { ...superuser, password: hashedPassword }
            }
        }
    });

    if (!res.users[0]?.id) {
        throw Error('The superuser ID is not found, something went wrong..');
    }

    return await prisma.profile.create({
        data: {
            ...superuserProfile,
            userId: res.users[0].id,
            createdBy: res.users[0].id,
            updatedBy: res.users[0].id
        }
    });
}

async function seedAccounts() {
    console.log('Seeding accounts...');
    return prisma.account.createMany({
        data: [...Array(2)].map(() => ({}))
    });
}

async function seedUsers() {
    console.log('Seeding users...');
    // Should return 2 accounts
    const accounts = await prisma.account.findMany();
    if (!accounts.length) {
        throw Error('The accounts are not found, something went wrong..');
    }

    const sanitizedUsers = await Promise.all(
        users.map(async (user, i) => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const index = i <= 1 ? i : 1;
            // First user connects to first account, 2 other users
            // to the second (multiuser account set-up)
            return { ...user, password: hashedPassword, accountId: accounts[index].id };
        })
    );
    return prisma.user.createMany({
        data: sanitizedUsers
    });
}

async function seedProfiles() {
    console.log('Seeding profiles...');
    const users = await getNotSuperuserUsers();
    const data = profiles.map((p, i) => {
        const user = users[i];
        return { ...p, userId: user.id, createdBy: user.id, updatedBy: user.id };
    });
    return prisma.profile.createMany({ data });
}

async function seedCountries() {
    console.log('Seeding countries...');
    const supervisor = await getSupervisor();
    const queries = countries.map((c) => {
        const sanitizedLocalIdentifierNames = c.localIdentifierNames.map((lin) => ({
            ...lin,
            createdBy: supervisor.id,
            updatedBy: supervisor.id
        }));
        return prisma.country.create({
            data: {
                name: c.name,
                localIdentifierName: {
                    create: sanitizedLocalIdentifierNames
                }
            }
        });
    });

    return Promise.all(queries);
}

async function seedOrganizationTypes() {
    console.log('Seeding organization types...');
    return prisma.organizationType.createMany({ data: organizationTypes });
}

async function seedInventoryTypes() {
    console.log('Seeding inventory types...');
    const supervisor = await getSupervisor();

    const sanitizedInventoryTypes = inventoryTypes.map((it) => ({
        ...it,
        createdBy: supervisor.id,
        updatedBy: supervisor.id
    }));

    return prisma.inventoryType.createMany({ data: sanitizedInventoryTypes });
}

async function seedAccountOrgsOrIndividuals() {
    console.log('Seeding accounts with their respective organizations and individuals...');

    const {
        type,
        address: providerOrgAddress,
        emails: providerOrgEmails,
        phones: providerOrgPhones,
        ...providerOrg
    } = providerOrganization;

    const { country: orgCountryName, ...sanitizedOrgProviderAddress } = providerOrgAddress;

    const {
        address: individualProviderAddress,
        emails: individualProviderEmails,
        phones: individualProviderPhones,
        dob,
        ...providerInd
    } = providerIndividual;

    const { country: individualCountryName, ...sanitizedIndividualProviderAddress } =
        individualProviderAddress;

    const admins = await getAdmins();

    const orgAdmin = admins.find((a) => a.email.includes('admin1'));
    if (!orgAdmin) {
        throw Error('The org admin is not found, something went wrong..');
    }

    const individualAdmin = admins.find((a) => a.email.includes('admin2'));
    if (!individualAdmin) {
        throw Error('The individual admin is not found, something went wrong..');
    }

    const orgTypes = await getOrganizationTypes();
    const orgType = orgTypes.find((ot) => ot.type.includes(type));

    if (!orgType) {
        throw Error('The org type is not found, something went wrong.. Try to correct your data.');
    }

    const countries = await getCountries();
    const orgCountry = countries.find((c) =>
        c.name.toLowerCase().includes(orgCountryName.toLowerCase())
    );

    if (!orgCountry) {
        throw Error(
            'The org provider country is not found, something went wrong.. Try to correct your data.'
        );
    }

    const individualCountry = countries.find((c) =>
        c.name.toLowerCase().includes(individualCountryName.toLowerCase())
    );

    if (!individualCountry) {
        throw Error(
            'The individual provider country is not found, something went wrong.. Try to correct your data.'
        );
    }

    const localIdentifiers = await getlocalIdentifiers();
    const orgLocalIdentifier = localIdentifiers.find(
        (li) => li.countryId === orgCountry.id && li.type === EntitiesEnum.organization
    );

    if (!orgLocalIdentifier) {
        throw Error(
            'The org local identifier is not found, something went wrong.. Try to correct your data.'
        );
    }

    const indLocalIdentifier = localIdentifiers.find(
        (li) => li.countryId === orgCountry.id && li.type === EntitiesEnum.individual
    );

    if (!indLocalIdentifier) {
        throw Error(
            'The org local identifier is not found, something went wrong.. Try to correct your data.'
        );
    }

    const createdOrgProviderAddress = await prisma.address.create({
        select: {
            id: true
        },
        data: {
            ...sanitizedOrgProviderAddress,
            createdBy: orgAdmin.id,
            updatedBy: orgAdmin.id,
            country: {
                connect: {
                    id: orgCountry.id
                }
            }
        }
    });

    const createdIndividualProviderAddress = await prisma.address.create({
        select: {
            id: true
        },
        data: {
            ...sanitizedIndividualProviderAddress,
            createdBy: individualAdmin.id,
            updatedBy: individualAdmin.id,
            country: {
                connect: {
                    id: individualCountry.id
                }
            }
        }
    });

    const sanitizedProviderOrganization = {
        ...providerOrg,
        accountId: orgAdmin?.accountId,
        typeId: orgType.id,
        localIdentifierNameId: orgLocalIdentifier.id,
        createdBy: orgAdmin.id,
        updatedBy: orgAdmin.id,
        addressId: createdOrgProviderAddress.id
    };

    const sanitizedProviderIndividual = {
        ...providerInd,
        accountId: individualAdmin?.accountId,
        localIdentifierNameId: indLocalIdentifier.id,
        createdBy: individualAdmin.id,
        updatedBy: individualAdmin.id,
        addressId: createdIndividualProviderAddress.id,
        dob: new Date(dob)
    };

    const createdProviderOrg = await prisma.organization.create({
        relationLoadStrategy: 'join',
        data: sanitizedProviderOrganization
    });

    const sanitizedOrgEmails = providerOrgEmails.map((ipe) => {
        return {
            ...ipe,
            organizationId: createdProviderOrg.id,
            createdBy: orgAdmin.id,
            updatedBy: orgAdmin.id
        };
    });

    await prisma.organizationEmail.createMany({
        data: sanitizedOrgEmails
    });

    const sanitizedOrgPhones = providerOrgPhones.map((pop) => {
        return {
            ...pop,
            organizationId: createdProviderOrg.id,
            createdBy: orgAdmin.id,
            updatedBy: orgAdmin.id
        };
    });

    await prisma.organizationPhone.createMany({
        data: sanitizedOrgPhones
    });

    const createdProviderInd = await prisma.individual.create({
        relationLoadStrategy: 'join',
        data: sanitizedProviderIndividual
    });

    const sanitizedIndividualEmails = individualProviderEmails.map((ipe) => {
        return {
            ...ipe,
            individualId: createdProviderInd.id,
            createdBy: individualAdmin.id,
            updatedBy: individualAdmin.id
        };
    });

    await prisma.individualEmail.createMany({
        data: sanitizedIndividualEmails
    });

    const sanitizedIndividualPhones = individualProviderPhones.map((ipe) => {
        return {
            ...ipe,
            individualId: createdProviderInd.id,
            createdBy: individualAdmin.id,
            updatedBy: individualAdmin.id
        };
    });

    await prisma.individualPhone.createMany({
        data: sanitizedIndividualPhones
    });
}

async function seedCustomers() {
    console.log('Seeding customers with their respective organizations and individuals...');
    const admins = getAdmins();
    return prisma.customer.create({
        data: [...Array(5)].map(() => ({
            organization: {
                create: [{ name: 'bla' }]
            }
        }))
    });
}

// async function seedInvoices() {
//     return new Promise(async (resolve) => {
//       const createTableQuery = `
//         CREATE TABLE IF NOT EXISTS invoices (
//           id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//           customer_id UUID NOT NULL,
//           amount INT NOT NULL,
//           status VARCHAR(255) NOT NULL,
//           date DATE NOT NULL
//         );
//       `;

//       const addInvoicesQueries = invoices.map((invoice) => {
//         return `
//             INSERT INTO invoices (customer_id, amount, status, date)
//             VALUES ('${invoice.customer_id}', ${invoice.amount}, '${invoice.status}', '${invoice.date}')
//             ON CONFLICT (id) DO NOTHING;
//           `;
//       });

//       // Queries
//       const res = await query(client, createTableQuery);
//       console.log(`Created table 'invoices': ${res}`);
//       console.log('Will be adding invoices now...');
//       const promises = addInvoicesQueries.map((q) => {
//         return query(client, q, `Added invoice to table 'invoices'`);
//       });
//       await Promise.all(promises);
//       console.log(`Seeded ${addInvoicesQueries.length} invoices`);
//       resolve();
//     });
// }

// async function seedRevenue() {
//   return new Promise(async (resolve, reject) => {
//     const createTableQuery = `
//       CREATE TABLE IF NOT EXISTS revenue (
//         month VARCHAR(4) NOT NULL UNIQUE,
//         revenue INT NOT NULL
//       );
//     `;

//     const addRevenuesQueries = revenue.map((rev) => {
//       return `
//         INSERT INTO revenue (month, revenue)
//         VALUES ('${rev.month}', ${rev.revenue})
//         ON CONFLICT (month) DO NOTHING;
//         `;
//     });

//     // Queries
//     const res = await query(client, createTableQuery);
//     console.log(`Created table 'revenues': ${res}`);
//     console.log('Will be adding revenues now...');
//     const promises = addRevenuesQueries.map((q) => {
//       return query(client, q, `Added revenue to table 'revenues'`);
//     });
//     await Promise.all(promises);
//     console.log(`Seeded ${addRevenuesQueries.length} revenues`);
//     resolve();
//   });
// }

// async function seedProductTypes() {
//   return new Promise(async (resolve) => {
//     const createTableQuery = `
//       CREATE TABLE IF NOT EXISTS product_types (
//         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//         type VARCHAR(255) NOT NULL UNIQUE
//       );
//     `;

//     const addProductTypesQueries = productTypes.map((pt) => {
//       return `
//         INSERT INTO product_types (id, type)
//         VALUES ('${pt.id}', '${pt.type}')
//         ON CONFLICT (id) DO NOTHING;
//         `;
//     });

//     // Queries
//     const res = await query(client, createTableQuery);
//     console.log(`Created table 'product_types': ${res}`);
//     console.log('Will be adding product types now...');
//     const promises = addProductTypesQueries.map((q) => {
//       return query(client, q, `Added product types to table 'product_types'`);
//     });
//     await Promise.all(promises);
//     console.log(`Seeded ${addProductTypesQueries.length} product_types`);
//     resolve();
//   });
// }

// async function seedProducts() {
//   return new Promise(async (resolve, reject) => {
//     const createTableQuery = `
//       CREATE TABLE IF NOT EXISTS products (
//         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         description TEXT,
//         type_id UUID NOT NULL,
//         code VARCHAR(255),
//         price INT NOT NULL
//       );
//     `;

//     const addProductsQueries = products.map((p) => {
//       return `
//         INSERT INTO products (name, description, type_id, code, price)
//         VALUES ('${p.name}', '${p.description || null}', '${p.typeId}', '${p.code}', ${p.price})
//         ON CONFLICT (id) DO NOTHING;
//         `;
//     });

//     // Queries
//     const res = await query(client, createTableQuery);
//     console.log(`Created table 'products': ${res}`);
//     console.log('Will be adding products now...');
//     const promises = addProductsQueries.map((q) => {
//       return query(client, q, `Added products to table 'product_types'`);
//     });
//     await Promise.all(promises);
//     console.log(`Seeded ${addProductsQueries.length} products`);
//     resolve();
//   });
// }

async function main() {
    // const host = process.env.POSTGRES_HOST;
    // const database = process.env.POSTGRES_DATABASE;
    // const user = process.env.POSTGRES_USER;
    // const password = process.env.POSTGRES_PASSWORD;
    // const port = process.env.POSTGRES_PORT;

    // await deleteAllTables();
    // console.log('All tables are successfully removed');
    // await removeUUIDExtension();
    // console.log('UUID extension is successfully removed.');

    // await createUUIDExtension();
    // console.log("UUID extension is successfully installed.");

    // await seedOrganizationTypes();
    // console.log('--------------------------------');
    // console.log('Seeded organization types');
    // console.log('--------------------------------\n');
    // await seedSuperuser();
    // console.log('--------------------------------');
    // console.log('Seeded superuser');
    // console.log('--------------------------------\n');
    // await seedAccounts();
    // console.log('--------------------------------');
    // console.log('Seeded accounts');
    // console.log('--------------------------------\n');
    // await seedUsers();
    // console.log('--------------------------------');
    // console.log('Seeded users');
    // console.log('--------------------------------\n');
    // await seedProfiles();
    // console.log('--------------------------------');
    // console.log('Seeded profiles');
    // console.log('--------------------------------\n');
    // await seedCountries();
    // console.log('--------------------------------');
    // console.log('Seeded countries');
    // console.log('--------------------------------\n');
    // await seedInventoryTypes();
    // console.log('--------------------------------');
    // console.log('Seeded inventory types');
    // console.log('--------------------------------\n');
    // await seedAccountOrgsOrIndividuals();
    // console.log('--------------------------------');
    // console.log('Seeded account orgs and individuals');
    // console.log('--------------------------------\n');

    await seedCustomers();
    console.log('--------------------------------');
    console.log('Seeded customers and their orgs and individuals');
    console.log('--------------------------------\n');

    //   await seedInvoices(pool);
    //   await seedRevenue(pool);
    //   await seedProductTypes(pool);
    //   await seedProducts(pool);
    await prisma.$disconnect();
}

main().catch(async (err) => {
    console.error('An error occurred while attempting to seed the database:', err);
});
