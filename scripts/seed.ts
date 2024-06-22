import { AccountRelationEnum, EntitiesEnum, Prisma, UserRoleEnum } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import { readFile, readdirSync, writeFile } from 'fs';
import path from 'path';
import {
    getEntityFirstEmailString,
    getEntityFirstPhoneString,
    getEntityName,
    getProviderName,
    getUserCustomersPerEntity,
    getUserProvider
} from '../app/lib/commonUtils.ts';
import { TCustomerPayload } from '../app/lib/data/customer/types.ts';
import {
    TGetUserWithRelationsAndInventoryPayload,
    getUserWithRelationsAndInventory
} from '../app/lib/data/user/types.ts';
import {
    countries,
    customerIndividuals,
    customerOrganizations,
    inventory,
    inventoryTypes,
    invoices,
    measurementUnits,
    organizationTypes,
    profiles,
    providerIndividual,
    providerOrganization,
    users
} from '../app/lib/placeholder-data.ts';
import prisma from '../app/lib/prisma.ts';
import { TEntities, TEntity, TEntityWithNonNullableCustomer } from '../app/lib/types';
import { seedSuperuser } from './seedSuperuser.ts';

dotenv.config();

const { hash } = bcrypt;

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
        include: getUserWithRelationsAndInventory,
        where: {
            role: UserRoleEnum.admin
        }
    });

    if (!admins.length) {
        throw Error('The admin users are not found. Please seed the admin users first.');
    }

    return admins;
}

async function getWriters() {
    const admins = await prisma.user.findMany({
        include: getUserWithRelationsAndInventory,
        where: {
            role: UserRoleEnum.writer
        }
    });

    if (!admins.length) {
        throw Error('The writer users are not found. Please seed the admin users first.');
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
        throw Error('The local identifiers are not found. Please seed them first.');
    }
    return localIdentifiers;
}

async function getInventoryTypes() {
    const inventoryTypes = await prisma.inventoryType.findMany();

    if (!inventoryTypes.length) {
        throw Error('The inventory types are not found. Please seed them first.');
    }
    return inventoryTypes;
}

// async function createUUIDExtension() {
//     console.log('Creating UUID Extension...');
//     return prisma.$queryRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
// }

async function seedAccounts() {
    console.log('Seeding accounts...');
    return prisma.account.createMany({
        data: [...Array(2)].map(() => ({}))
    });
}

async function seedUsers() {
    console.log('Seeding users...');
    // Should return 2 accounts
    const accounts = (await prisma.account.findMany({ include: { users: true } })).filter(
        (a) => !a.users.length
    );
    if (!accounts.length && accounts.length !== 2) {
        throw Error('The accounts are not found or found more than 2, something went wrong..');
    }

    const sanitizedUsers = await Promise.all(
        users.map(async (user, i) => {
            const hashedPassword = await hash(user.password, 10);
            const index = i === 0 ? i : 1;
            // First user connects to first account, 4 other users
            // to the second (multiuser account set-up)
            return { ...user, password: hashedPassword, accountId: accounts[index].id };
        })
    );
    return prisma.user.createMany({
        data: sanitizedUsers
    });
}

async function seedMeasurementUnits() {
    console.log('Seeding measurement units...');
    const admins = await getAdmins();
    if (!admins.length) {
        throw Error('The admins are not found, something went wrong..');
    }

    const updatePromises = admins.map(async (admin) => {
        const data: Prisma.accountUpdateInput = {
            measurementUnits: {
                create: measurementUnits.map((m) => ({
                    ...m,
                    createdBy: admin.id,
                    updatedBy: admin.id
                }))
            }
        };
        return prisma.account.update({
            data,
            where: { id: admin.accountId }
        });
    });

    return Promise.all(updatePromises);
}

async function seedProfiles() {
    console.log('Seeding profiles...');
    const users = (await getNotSuperuserUsers()).sort((u1) => {
        return u1.phone.startsWith('+1') ? -1 : u1.phone.startsWith('+46') ? 1 : 0;
    });
    const data = profiles.map((p, i) => {
        const user = users[i];
        return { ...p, userId: user.id, createdBy: user.id, updatedBy: user.id };
    });
    return prisma.profile.createMany({ data });
}

async function seedSettings() {
    console.log('Seeding account settings...');
    const admins = await getAdmins();
    const queryPromises = admins.map((admin, index) => {
        return prisma.settings.create({
            data: {
                accountId: admin.account.id,
                isDisplayCustomerLocalIdentifier: index === 0,
                isDisplayProviderLocalIdentifier: index === 0,
                isObfuscateCustomerLocalIdentifier: index === 0,
                isObfuscateProviderLocalIdentifier: index === 0,
                dateFormat: index === 0 ? 'DD/MM/YYYY' : 'YYYY/MM/DD',
                salesTax: index === 0 ? 0 : 25,
                paymentTerms: index === 0 ? '30 days from the invoice date' : '',
                createdBy: admin.id,
                updatedBy: admin.id
            }
        });
    });

    return Promise.all(queryPromises);
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

async function seedAccountOrgsOrIndividualProviders() {
    console.log(
        'Seeding accounts with their respective organizations and individuals as providers...'
    );

    const admins = await getAdmins();

    const individualAdmin = admins.find((a) => a.email.includes('admin1'));
    if (!individualAdmin) {
        throw Error('The individual admin is not found, something went wrong..');
    }

    const orgAdmin = admins.find((a) => a.email.includes('admin2'));
    if (!orgAdmin) {
        throw Error('The org admin is not found, something went wrong..');
    }

    const {
        type,
        address: orgAddressRawData,
        emails: orgEmailsRawData,
        phones: orgPhonesRawData,
        ...orgProviderData
    } = providerOrganization;

    const { country: orgCountryName, ...orgProviderAdress } = orgAddressRawData;

    const {
        address: indAddressRawData,
        emails: indEmailsRawData,
        phones: indPhonesRawData,
        dob,
        ...indProviderData
    } = providerIndividual;

    const { country: indCountryName, ...indProviderAddress } = indAddressRawData;

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
        c.name.toLowerCase().includes(indCountryName.toLowerCase())
    );

    console.log('Coutries found:', countries, orgCountry, individualCountry, indCountryName);

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
        (li) => li.countryId === individualCountry.id && li.type === EntitiesEnum.individual
    );

    if (!indLocalIdentifier) {
        throw Error(
            'The org local identifier is not found, something went wrong.. Try to correct your data.'
        );
    }

    const sanitizedOrgProviderAddress = {
        ...orgProviderAdress,
        createdBy: orgAdmin.id,
        updatedBy: orgAdmin.id,
        country: {
            connect: {
                id: orgCountry.id
            }
        }
    };

    const createdOrgProviderAddress = await prisma.address.create({
        select: {
            id: true
        },
        data: sanitizedOrgProviderAddress
    });

    const sanitizedOrgPhones = orgPhonesRawData.map((pop) => {
        return {
            ...pop,
            createdBy: orgAdmin.id,
            updatedBy: orgAdmin.id
        };
    });

    const sanitizedOrgEmails = orgEmailsRawData.map((poe) => {
        return {
            ...poe,
            createdBy: orgAdmin.id,
            updatedBy: orgAdmin.id
        };
    });

    const sanitizedProviderOrganization = {
        ...orgProviderData,
        accountId: orgAdmin?.accountId,
        typeId: orgType.id,
        localIdentifierNameId: orgLocalIdentifier.id,
        createdBy: orgAdmin.id,
        updatedBy: orgAdmin.id,
        addressId: createdOrgProviderAddress.id,
        phones: {
            createMany: {
                data: sanitizedOrgPhones
            }
        },
        emails: {
            createMany: {
                data: sanitizedOrgEmails
            }
        }
    };

    const createOrgPromise = prisma.organization.create({
        relationLoadStrategy: 'join',
        data: sanitizedProviderOrganization
    });

    const sanitizedIndProviderAddress = {
        ...indProviderAddress,
        createdBy: individualAdmin.id,
        updatedBy: individualAdmin.id,
        country: {
            connect: {
                id: individualCountry.id
            }
        }
    };

    const createdIndProviderAddress = await prisma.address.create({
        select: {
            id: true
        },
        data: sanitizedIndProviderAddress
    });

    const sanitizedIndividualEmails = indEmailsRawData.map((ipe) => {
        return {
            ...ipe,
            createdBy: individualAdmin.id,
            updatedBy: individualAdmin.id
        };
    });

    const sanitizedIndividualPhones = indPhonesRawData.map((ipe) => {
        return {
            ...ipe,
            createdBy: individualAdmin.id,
            updatedBy: individualAdmin.id
        };
    });

    const sanitizedProviderIndividual = {
        ...indProviderData,
        accountId: individualAdmin?.accountId,
        localIdentifierNameId: indLocalIdentifier.id,
        createdBy: individualAdmin.id,
        updatedBy: individualAdmin.id,
        addressId: createdIndProviderAddress.id,
        dob: new Date(dob),
        phones: {
            createMany: {
                data: sanitizedIndividualPhones
            }
        },
        emails: {
            createMany: {
                data: sanitizedIndividualEmails
            }
        }
    };

    const createIndPromise = prisma.individual.create({
        relationLoadStrategy: 'join',
        data: sanitizedProviderIndividual
    });

    return Promise.all([createOrgPromise, createIndPromise]);
}

async function seedCountries() {
    console.log('Seeding countries...');
    const supervisor = await getSupervisor();
    const queries = countries.map((c) => {
        const { localIdentifierNames, ...country } = c;
        const sanitizedLocalIdentifierNames = c.localIdentifierNames.map((lin) => ({
            ...lin,
            createdBy: supervisor.id,
            updatedBy: supervisor.id
        }));
        return prisma.country.create({
            data: {
                ...country,
                localIdentifierNames: {
                    create: sanitizedLocalIdentifierNames
                }
            }
        });
    });

    return Promise.all(queries);
}

async function seedCustomers() {
    console.log('Seeding customers with their respective organizations and individuals...');

    const admins = await getAdmins();
    const localIdentifiers = await getlocalIdentifiers();
    const customerCreatePromises = admins.map((admin) => {
        // Finding the admin user's provider org or individual data
        const adminAccountProviderOrg = admin.account.organizations.find(
            (o) => (o.accountRelation = AccountRelationEnum.provider)
        );
        const adminAccountProviderIndividual = admin.account.individuals.find(
            (o) => (o.accountRelation = AccountRelationEnum.provider)
        );

        const adminCountry =
            (adminAccountProviderOrg && adminAccountProviderOrg.address.country) ||
            (adminAccountProviderIndividual && adminAccountProviderIndividual.address.country);

        if (!adminCountry) {
            throw Error(
                'The admin user does not have provider org or individual connected to its account. Please seed that data first.'
            );
        }

        // Finding customer orgs from seeding data who belong to the same country as the admins' account.
        const customerOrgs = customerOrganizations.filter(
            (o) => o.address.country.toLowerCase() === adminCountry.name.toLowerCase()
        );

        // There must be at least some..
        if (!customerOrgs.length) {
            throw Error(
                `There are no customer organizations with countries that match the admin's country. Please fix your data.`
            );
        }
        // Finding customer individuals from seeding data who belong to the same country as the admins' account.
        const customerInds = customerIndividuals.filter(
            (o) => o.address.country.toLowerCase() === adminCountry.name.toLowerCase()
        );
        // There must be at least some..
        if (!customerInds.length) {
            throw Error(
                `There are no customer individuals with countries that match the admin' country. Please fix your data.`
            );
        }

        // Now, let's try creating organization customers for the current admin
        const customerOrgCreatePromises = customerOrgs.map(async (customerOrgData, index) => {
            const {
                type,
                address: orgAddress,
                emails: orgEmails,
                phones: orgPhones,
                ...customerOrg
            } = customerOrgData;

            const { country, ...sanitizedOrgAddress } = orgAddress;

            const createdOrgAddress = await prisma.address.create({
                select: {
                    id: true
                },
                data: {
                    ...sanitizedOrgAddress,
                    createdBy: admin.id,
                    updatedBy: admin.id,
                    country: {
                        connect: {
                            id: adminCountry.id
                        }
                    }
                }
            });

            const orgLocalIdentifier = localIdentifiers.find(
                (li) => li.countryId === adminCountry.id && li.type === EntitiesEnum.organization
            );

            if (!orgLocalIdentifier) {
                throw Error(
                    'The org local identifier is not found, something went wrong.. Try to correct your data.'
                );
            }

            const orgTypes = await getOrganizationTypes();
            const orgType = orgTypes.find((ot) => ot.type.includes(type));

            if (!orgType) {
                throw Error(
                    'The org type is not found, something went wrong.. Try to correct your data.'
                );
            }

            const sanitizedOrgEmails = orgEmails.map((oe) => {
                return {
                    ...oe,
                    createdBy: admin.id,
                    updatedBy: admin.id
                };
            });

            const sanitizedOrgPhones = orgPhones.map((op) => {
                return {
                    ...op,
                    createdBy: admin.id,
                    updatedBy: admin.id
                };
            });

            const sanitizedCustomerOrganization = {
                ...customerOrg,
                accountId: admin.accountId,
                typeId: orgType.id,
                localIdentifierNameId: orgLocalIdentifier.id,
                createdBy: admin.id,
                updatedBy: admin.id,
                addressId: createdOrgAddress.id,
                emails: {
                    createMany: {
                        data: sanitizedOrgEmails
                    }
                },
                phones: {
                    createMany: {
                        data: sanitizedOrgPhones
                    }
                }
            };

            return prisma.customer.create({
                data: {
                    code: `O-${index + 1}`,
                    organization: {
                        create: sanitizedCustomerOrganization
                    }
                }
            });
        });

        // Now, let's try creating individual customers for the current admin
        const customerIndCreatePromises = customerInds.map(
            async (customerIndividualData, index) => {
                const indLocalIdentifier = localIdentifiers.find(
                    (li) => li.countryId === adminCountry.id && li.type === EntitiesEnum.individual
                );

                if (!indLocalIdentifier) {
                    throw Error(
                        'The individual local identifier is not found, something went wrong.. Try to correct your data.'
                    );
                }

                const {
                    address: indAddress,
                    emails: indEmails,
                    phones: indPhones,
                    dob,
                    ...customerIndividual
                } = customerIndividualData;

                const { country, ...sanitizedIndividualAddress } = indAddress;

                const createdIndividualAddress = await prisma.address.create({
                    select: {
                        id: true
                    },
                    data: {
                        ...sanitizedIndividualAddress,
                        createdBy: admin.id,
                        updatedBy: admin.id,
                        country: {
                            connect: {
                                id: adminCountry.id
                            }
                        }
                    }
                });

                const sanitizedIndividualEmails = indEmails.map((ie) => {
                    return {
                        ...ie,
                        createdBy: admin.id,
                        updatedBy: admin.id
                    };
                });

                const sanitizedIndividualPhones = indPhones.map((ip) => {
                    return {
                        ...ip,
                        createdBy: admin.id,
                        updatedBy: admin.id
                    };
                });

                const sanitizedCustomerIndividual = {
                    ...customerIndividual,
                    accountId: admin?.accountId,
                    localIdentifierNameId: indLocalIdentifier.id,
                    createdBy: admin.id,
                    updatedBy: admin.id,
                    addressId: createdIndividualAddress.id,
                    dob: new Date(dob),
                    emails: {
                        createMany: {
                            data: sanitizedIndividualEmails
                        }
                    },
                    phones: {
                        createMany: {
                            data: sanitizedIndividualPhones
                        }
                    }
                };

                return prisma.customer.create({
                    data: {
                        code: `I-${index + 1}`,
                        individual: {
                            create: sanitizedCustomerIndividual
                        }
                    }
                });
            }
        );
        return customerOrgCreatePromises.concat(customerIndCreatePromises);
    });

    return Promise.all(customerCreatePromises.flat());
}

async function seedInventory() {
    const admins = await getAdmins();
    const inventoryTypes = await getInventoryTypes();

    const createInventoryPromises = admins.map((admin) => {
        const sanitizedInventory = inventory.map((inventoryItem) => {
            const { type, ...inventoryItemWithoutType } = inventoryItem;
            const inventoryType = inventoryTypes.find((it) => it.type === type);
            if (!inventoryType) {
                throw Error('The inventory type is not found. Please correct your seed data...');
            }
            return {
                ...inventoryItemWithoutType,
                typeId: inventoryType?.id,
                accountId: admin.accountId,
                createdBy: admin.id,
                updatedBy: admin.id
            };
        });
        return prisma.inventory.createMany({
            data: sanitizedInventory
        });
    });

    return Promise.all(createInventoryPromises);
}

async function seedInvoices() {
    const admins = await getAdmins();
    const writers = await getWriters();
    const inventoryTypes = await getInventoryTypes();
    const serviceTypeId = inventoryTypes.find((it) => it.type === 'miscellaneous')?.id;
    if (!serviceTypeId) {
        throw Error(`The 'service' inventory type is not found. Please correct your seed data...`);
    }
    const miscellaneousTypeId = inventoryTypes.find((it) => it.type === 'miscellaneous')?.id;
    if (!miscellaneousTypeId) {
        throw Error(
            `The 'miscellaneous' inventory type is not found. Please correct your seed data...`
        );
    }

    const createCustomerInvoiceData = (
        user: TGetUserWithRelationsAndInventoryPayload,
        provider: TEntities<TCustomerPayload['individual'], TCustomerPayload['organization']>,
        customers: TEntityWithNonNullableCustomer[]
    ) => {
        const concreteProvider = provider.individual ?? provider.organization;
        if (!concreteProvider) {
            throw Error('The provider is not found. Please seed one first.');
        }
        const inventory = user.account.inventory;
        const measurementUnits = user.account.measurementUnits;
        if (!inventory.length) {
            throw Error('The account does not have inventory. Please seed one first.');
        }

        let invoiceNumber = 1;

        return customers
            .map((customer) => {
                const name = getEntityName(customer);
                if (!name) {
                    throw Error('The customer does not have a name. Please seed one first.');
                }
                const address = customer.address;
                const customerPhone = getEntityFirstPhoneString(customer);
                const customerCode = customer.customer.code;

                const customerEmail = getEntityFirstEmailString(customer);
                // Provider info has to be remembered on the invoice
                // as providers tend to change names, addresses, etc.
                const providerLogo = concreteProvider.logo;
                let providerLogoData: Omit<NonNullable<typeof providerLogo>, 'id'> | undefined;
                if (providerLogo) {
                    const { id, ...rest } = providerLogo;
                    providerLogoData = rest;
                }
                const providerName = getProviderName(concreteProvider);
                const providerAddressLine1 = concreteProvider.address.addressLine1;
                const providerAddressLine2 = concreteProvider.address.addressLine2;
                const providerAddressLine3 = concreteProvider.address.addressLine3;
                const providerLocality = concreteProvider.address.locality;
                const providerRegion = concreteProvider.address.region;
                const providerPostCode = concreteProvider.address.postcode;
                const providerCountry = concreteProvider.address.country.name;

                const providerPhone = getEntityFirstPhoneString(
                    concreteProvider as unknown as TEntity
                );
                const providerEmail = getEntityFirstEmailString(
                    concreteProvider as unknown as TEntity
                );
                const providerLocalIdentifierNameAbbrev =
                    concreteProvider.localIdentifierName.abbreviation;
                const providerLocalIdentifierValue = concreteProvider.localIdentifierValue;

                return invoices.map((invoice) => {
                    const invoiceItems = inventory.map((inventoryItem, index) => {
                        return {
                            name: inventoryItem.name,
                            price: inventoryItem.price,
                            // If service or miscellaneous, quantity is 1, otherwise random number between 1 and 3
                            quantity:
                                inventoryItem.typeId === serviceTypeId ||
                                inventoryItem.typeId === miscellaneousTypeId
                                    ? 1000
                                    : (Math.floor(Math.random() * 3) + 1) * 1000,
                            inventoryId: inventoryItem.id,
                            salesTax: index % 2 === 0 ? 8000 : index % 3 === 0 ? 3000 : 0,
                            measurementUnitId:
                                measurementUnits[
                                    Math.floor(Math.random() * measurementUnits.length)
                                ].id,
                            discount: index % 2 === 0 ? 1000 : index % 3 === 0 ? 2000 : 0,
                            createdBy: user.id,
                            updatedBy: user.id
                        };
                    });

                    const date = new Date(invoice.date);

                    const data: Prisma.invoiceCreateInput = {
                        ...invoice,
                        number: String(invoiceNumber++),
                        date,
                        payBy: new Date(invoice.payBy),
                        paidOn: invoice.paidOn && new Date(invoice.paidOn),
                        customerName: name,
                        customerAddressLine1: address.addressLine1,
                        customerAddressLine2: address.addressLine2,
                        customerAddressLine3: address.addressLine3,
                        customerLocality: address.locality,
                        customerRegion: address.region,
                        customerPostCode: address.postcode,
                        customerCountry: address.country.name,
                        customerPhone,
                        customerEmail,
                        customerCode,
                        customerLocalIdentifierNameAbbrev:
                            customer.localIdentifierName.abbreviation,
                        customerLocalIdentifierValue: customer.localIdentifierValue,
                        customerRef: 'Some customer reference',
                        providerLocalIdentifierNameAbbrev,
                        providerLocalIdentifierValue,
                        providerLogo: {
                            create: providerLogoData
                        },
                        providerRef: 'Some provider reference',
                        providerName,
                        providerAddressLine1,
                        providerAddressLine2,
                        providerAddressLine3,
                        providerLocality,
                        providerRegion,
                        providerPostCode,
                        providerCountry,
                        providerPhone,
                        providerEmail,
                        createdAt: date,
                        invoiceItems: {
                            createMany: {
                                data: invoiceItems
                            }
                        },
                        customer: {
                            connect: {
                                id: customer.customer.id
                            }
                        },
                        createdByUser: {
                            connect: {
                                id: user.id
                            }
                        },
                        updatedByUser: {
                            connect: {
                                id: user.id
                            }
                        }
                    };

                    return data;
                });
            })
            .flat();
    };

    const adminCreateInvoicePromises = admins
        .map((admin) => {
            const { indCustomers, orgCustomers } = getUserCustomersPerEntity(admin);
            const customers = [
                ...indCustomers,
                ...orgCustomers
            ] as TEntityWithNonNullableCustomer[];
            const provider = getUserProvider(admin);
            const sanitizedInvoices = provider
                ? createCustomerInvoiceData(admin, provider, customers)
                : [];

            return sanitizedInvoices.map((invoice) => {
                return prisma.invoice.create({
                    data: invoice,
                    select: {
                        id: true
                    }
                });
            });
        })
        .flat();

    await Promise.all(adminCreateInvoicePromises);

    const writer = writers[0];
    if (!writer) {
        throw Error(`The writer is not found. Please correct your seed data...`);
    }

    // Assign some invoices (those after the beginning of 2024) to writers
    const updateInvoicesPromises = writers.map((writer) => {
        const { indCustomers, orgCustomers } = getUserCustomersPerEntity(writer);
        const writersCustomerIds = [...indCustomers, ...orgCustomers].map((customer) => {
            return customer.customer.id;
        });

        return prisma.invoice.updateMany({
            where: {
                AND: [
                    {
                        customerId: {
                            in: writersCustomerIds
                        }
                    },
                    {
                        date: {
                            gte: new Date('2024-01-01')
                        }
                    }
                ]
            },
            data: {
                createdBy: writer.id,
                updatedBy: writer.id
            }
        });
    });

    return Promise.all(updateInvoicesPromises);
}

async function seedDatabase() {
    console.log('Starting to seed the DB...');
    await seedOrganizationTypes();
    console.log('--------------------------------');
    console.log('Seeded organization types');
    console.log('--------------------------------\n');
    await seedSuperuser();
    console.log('--------------------------------');
    console.log('Seeded superuser');
    console.log('--------------------------------\n');
    await seedAccounts();
    console.log('--------------------------------');
    console.log('Seeded accounts');
    console.log('--------------------------------\n');
    await seedUsers();
    console.log('--------------------------------');
    console.log('Seeded users');
    console.log('--------------------------------\n');
    await seedMeasurementUnits();
    console.log('--------------------------------');
    console.log('Seeded measurement units');
    console.log('--------------------------------\n');
    await seedProfiles();
    console.log('--------------------------------');
    console.log('Seeded profiles');
    console.log('--------------------------------\n');
    await seedCountries();
    console.log('--------------------------------');
    console.log('Seeded countries');
    console.log('--------------------------------\n');
    await seedInventoryTypes();
    console.log('--------------------------------');
    console.log('Seeded inventory types');
    console.log('--------------------------------\n');
    await seedAccountOrgsOrIndividualProviders();
    console.log('--------------------------------');
    console.log('Seeded account orgs and individuals');
    console.log('--------------------------------\n');
    await seedSettings();
    console.log('--------------------------------');
    console.log('Seeded account settings');
    console.log('--------------------------------\n');
    await seedCustomers();
    console.log('--------------------------------');
    console.log('Seeded customers and their orgs and individuals');
    console.log('--------------------------------\n');
    await seedInventory();
    console.log('--------------------------------');
    console.log('Seeded inventory');
    console.log('--------------------------------\n');
    await seedInvoices();
    console.log('--------------------------------');
    console.log('Seeded invoices');
    console.log('--------------------------------\n');
}

async function addExtensionToInitialMigrationFile() {
    const rootPath = path.resolve('./');
    const migrationsDir = 'prisma/migrations';
    const absMigrationsDirPath = path.join(rootPath, migrationsDir);
    return new Promise((resolve, reject) => {
        try {
            const files = readdirSync(absMigrationsDirPath);
            const nameRe = /.*_initial$/i;
            // Finding directory with initial migration
            const initialMigrationDirName = files.find((f) => {
                return f.match(nameRe);
            });
            if (!initialMigrationDirName) {
                throw Error('No initial migration found');
            }
            const migrationFileAbsPath = path.join(
                absMigrationsDirPath,
                initialMigrationDirName,
                'migration.sql'
            );
            console.log(migrationFileAbsPath);
            readFile(migrationFileAbsPath, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                }
                const uuidExtension = 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";';
                writeFile(migrationFileAbsPath, `${uuidExtension}\n\n${data}`, 'utf8', (err) => {
                    if (err) {
                        reject(err);
                    }
                    const successMessage = 'Successfully added extension to initial migration';
                    console.log(successMessage);
                    resolve(successMessage);
                });
            });
        } catch (error) {
            reject(error);
        }
    });
}

async function runMigrateCommand() {
    return new Promise((resolve, reject) => {
        try {
            exec(`npx prisma migrate dev`, (err, stdout) => {
                if (err) {
                    reject(err);
                }
                stdout && console.log(stdout);

                const successMessage = 'Successfully created migration file';
                console.log(successMessage);
                resolve(successMessage);
            });
        } catch (error) {
            reject(error);
        }
    });
}

async function runGeneratePrismaClientCommand() {
    return new Promise((resolve, reject) => {
        try {
            exec(`npx prisma generate`, (err, stdout) => {
                if (err) {
                    reject(err);
                }
                stdout && console.log(stdout);

                const successMessage = 'Successfully generated Prisma Client.';
                console.log(successMessage);
                resolve(successMessage);
            });
        } catch (error) {
            reject(error);
        }
    });
}

async function main() {
    await addExtensionToInitialMigrationFile();
    await runMigrateCommand();
    console.log('Successfully prepared migrations!\n');
    await runGeneratePrismaClientCommand();
    await seedDatabase();
    console.log('\nFinished seeding the database!\n');

    await prisma.$disconnect();
}

main().catch(async (err) => {
    console.error('An error occurred while attempting to seed the database:', err);
});
