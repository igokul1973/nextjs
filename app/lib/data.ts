import { InvoiceStatusEnum } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';
import { LatestInvoice } from './definitions';
import prisma from './prisma';
import { formatCurrency } from './utils';

export async function fetchLatestInvoices(): Promise<LatestInvoice[]> {
    try {
        noStore();

        // const invoices = await prisma.invoice.findMany({
        //     relationLoadStrategy: 'join',
        //     select: {
        //         id: true,
        //         amount: true,
        //         customer: {
        //             select: {
        //                 name: true,
        //                 image_url: true,
        //                 email: true
        //             }
        //         }
        //     },
        //     orderBy: {
        //         date: 'desc'
        //     },
        //     take: 5
        // });

        // const latestInvoices = invoices.map(
        //     ({ id, amount, customer: { name, image_url, email } }) => ({
        //         id,
        //         amount: formatCurrency(amount),
        //         name,
        //         image_url,
        //         email
        //     })
        // );

        // return latestInvoices;

        return [];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch the latest invoices.');
    }
}

export async function fetchCardData() {
    noStore();
    try {
        // You can probably combine these into a single SQL query
        // However, we are intentionally splitting them to demonstrate
        // how to initialize multiple queries in parallel with JS.
        // const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
        // const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
        // const invoiceStatusPromise = sql`SELECT
        //  SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
        //  SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
        //  FROM invoices`;

        const invoiceCountPromise = prisma.invoice.count();
        const customerCountPromise = prisma.customer.count();
        const invoices = await prisma.invoice.findMany({
            include: {
                invoiceItems: true
            }
        });

        const totalPaidInvoicesNum = invoices.reduce((acc, i) => {
            const amount = i.invoiceItems.reduce((acc, ii) => {
                if (i.status === InvoiceStatusEnum.paid) {
                    return acc + ii.price;
                }
                return acc;
            }, 0);
            return acc + amount;
        }, 0);

        const totalPendingInvoicesNum = invoices.reduce((acc, i) => {
            const amount = i.invoiceItems.reduce((acc, ii) => {
                if (i.status === InvoiceStatusEnum.pending) {
                    return acc + ii.price;
                }
                return acc;
            }, 0);
            return acc + amount;
        }, 0);

        // const invoiceStatusPromise = prisma.$queryRaw<{ paid: number; pending: number }[]>`SELECT
        //  SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
        //  SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
        //  FROM invoices`;

        const data = await Promise.all([
            invoiceCountPromise,
            customerCountPromise
            // invoiceStatusPromise
        ]);

        const numberOfInvoices = Number(data[0] ?? '0');
        const numberOfCustomers = Number(data[1] ?? '0');
        const totalPaidInvoices = formatCurrency(totalPaidInvoicesNum ?? '0');
        const totalPendingInvoices = formatCurrency(totalPendingInvoicesNum ?? '0');

        console.log('---------------------------');
        console.log('totalPaidInvoices: ', totalPaidInvoices);
        console.log('totalPendingInvoices: ', totalPendingInvoices);
        console.log('---------------------------');

        return {
            numberOfCustomers,
            numberOfInvoices,
            totalPaidInvoices,
            totalPendingInvoices
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch card data.');
    }
}

export async function getUser(email: string) {
    noStore();
    try {
        const user = await sql`SELECT * FROM users WHERE email=${email}`;
        return user.rows[0] as User;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}
