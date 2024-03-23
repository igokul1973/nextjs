import dotenv from 'dotenv';
// import {
//     customers,
//     invoices,
//     productTypes,
//     products,
//     revenue,
//     users
// } from "../app/lib/placeholder-data.ts";
import { UserRoleEnum } from '@prisma/client';
import bcrypt from 'bcrypt';
import {
    countries,
    inventoryTypes,
    organizationTypes,
    profiles,
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

async function createUUIDExtension() {
    return prisma.$queryRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
}

async function removeUUIDExtension() {
    return prisma.$queryRaw`DROP EXTENSION IF EXISTS "uuid-ossp"`;
}

async function seedAccounts() {
    return prisma.account.createMany({
        data: [1, 2, 3].map(() => ({}))
    });
}

async function seedUsers() {
    const accounts = await prisma.account.findMany();

    const sanitizedUsers = await Promise.all(
        users.map(async (user, i) => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const index = i <= 2 ? i : 2;
            return { ...user, password: hashedPassword, accountId: accounts[index].id };
        })
    );
    return prisma.user.createMany({
        data: sanitizedUsers
    });
}

async function seedProfiles() {
    const users = await prisma.user.findMany();
    const data = profiles.map((p, i) => {
        const user = users[i];
        return { ...p, userId: user.id, createdBy: user.id, updatedBy: user.id };
    });
    return prisma.profile.createMany({ data });
}

async function seedCountries() {
    return prisma.country.createMany({ data: countries });
}

async function seedOrganizationTypes() {
    return prisma.organizationType.createMany({ data: organizationTypes });
}

async function seedInventoryTypes() {
    const adminUser = await prisma.user.findFirst({
        where: {
            role: UserRoleEnum.superuser
        }
    });

    if (!adminUser) throw Error('The superuser is not found. Please seed the superuser first.');

    const sanitizedInventoryTypes = inventoryTypes.map((it) => ({
        ...it,
        createdBy: adminUser.id,
        updatedBy: adminUser.id
    }));

    return prisma.inventoryType.createMany({ data: sanitizedInventoryTypes });
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

// async function seedCustomers() {
//   return new Promise(async (resolve, reject) => {
//     const createTableQuery = `
//       CREATE TABLE IF NOT EXISTS customers (
//         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         email VARCHAR(255) NOT NULL,
//         image_url VARCHAR(255) NOT NULL
//       );
//     `;

//     const addCustomersQueries = customers.map((customer) => {
//       return `
//         INSERT INTO customers (id, name, email, image_url)
//         VALUES ('${customer.id}', '${customer.name}', '${customer.email}', '${customer.image_url}')
//         ON CONFLICT (id) DO NOTHING;
//         `;
//     });

//     // Queries
//     const res = await query(client, createTableQuery);
//     console.log(`Created table 'customers': ${res}`);
//     console.log('Will be adding customers now...');
//     const promises = addCustomersQueries.map((q) => {
//       return query(client, q, `Added customer to table 'customers'`);
//     });
//     await Promise.all(promises);
//     console.log(`Seeded ${addCustomersQueries.length} customers`);
//     resolve();
//   });
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
    await seedOrganizationTypes();
    await seedCountries();
    await seedAccounts();
    await seedUsers();
    await seedProfiles();
    await seedInventoryTypes();
    //   await seedCustomers();
    //   await seedInvoices(pool);
    //   await seedRevenue(pool);
    //   await seedProductTypes(pool);
    //   await seedProducts(pool);
    await prisma.$disconnect();
}

main().catch(async (err) => {
    console.error('An error occurred while attempting to seed the database:', err);
});
