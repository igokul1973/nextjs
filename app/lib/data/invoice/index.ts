import { DEFAULT_ITEMS_PER_PAGE } from '@/app/[locale]/dashboard/invoices/constants';
import prisma from '@/app/lib/prisma';
import { IBaseDataFilterArgs } from '@/app/lib/types';
import { flattenCustomer, getInvoiceTotal } from '@/app/lib/utils';
import { unstable_noStore as noStore } from 'next/cache';
import {
    TGetInvoiceWithRelationsPayloadRaw,
    TTransformedInvoice,
    getQueryFilterWhereClause,
    invoicesInclude
} from './types';

const transformInvoice = (invoice: TGetInvoiceWithRelationsPayloadRaw): TTransformedInvoice => {
    const { invoiceItems: rawInvoiceItems, customer: rawCustomer, ...partialInvoice } = invoice;
    const invoiceItems = rawInvoiceItems.map((ii) => {
        return {
            ...ii,
            price: Number(ii.price)
        };
    });

    const customer = flattenCustomer(rawCustomer);

    const amount = getInvoiceTotal(invoiceItems);

    return {
        ...partialInvoice,
        amount,
        customer,
        invoiceItems
    };
};

export async function getInvoiceById(
    id: string,
    accountId: string,
    isAdmin = false
): Promise<TTransformedInvoice | null> {
    noStore();
    try {
        const invoice = await prisma.invoice.findFirst({
            relationLoadStrategy: 'query',
            include: invoicesInclude,
            where: {
                id,
                createdByUser: !isAdmin
                    ? {
                          is: {
                              account: {
                                  is: {
                                      id: accountId
                                  }
                              }
                          }
                      }
                    : undefined
            }
        });

        if (!invoice) {
            return null;
        }

        return transformInvoice(invoice);
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('could not get invoice.');
    }
}

export async function getFilteredInvoicesByAccountId({
    accountId,
    query,
    page = 0,
    itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
    orderBy = 'number',
    order = 'asc'
}: IBaseDataFilterArgs) {
    noStore();

    const offset = page * itemsPerPage;

    try {
        const invoices = await prisma.invoice.findMany({
            relationLoadStrategy: 'join',
            take: itemsPerPage,
            skip: offset,
            orderBy: {
                [orderBy]: order
            },
            include: invoicesInclude,
            where: getQueryFilterWhereClause(accountId, query)
        });

        // Adding invoice amount and returning
        return invoices.map((invoice) => {
            return transformInvoice(invoice);
        });
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('could not get invoices.');
    }
}

export async function getFilteredInvoicesByAccountIdCount(accountId: string, query: string) {
    noStore();

    try {
        return await prisma.invoice.count({
            where: getQueryFilterWhereClause(accountId, query)
        });
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('could not get total number of invoices.');
    }
}
