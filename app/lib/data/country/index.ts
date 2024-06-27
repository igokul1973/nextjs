import prisma from '@/app/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';
import { FormSchema } from './formSchema';
import { getQueryFilterWhereClause } from './types';

export const CreateCountry = FormSchema.omit({ id: true });
export const UpdateCountry = FormSchema.omit({ id: true });

export async function getCountries() {
    noStore();
    try {
        return await prisma.country.findMany({
            relationLoadStrategy: 'query',
            include: {
                localIdentifierNames: true
            }
        });
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('could not get countries.');
    }
}

export async function getFilteredCountries(query: string) {
    noStore();

    try {
        const countries = await prisma.country.findMany({
            relationLoadStrategy: 'join',
            include: {
                localIdentifierNames: true
            },
            orderBy: {
                name: 'asc'
            },
            where: getQueryFilterWhereClause(query)
        });

        return countries;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('could not get inventory.');
    }
}

export async function getFilteredCountriesCount(query: string) {
    noStore();

    try {
        const count = await prisma.country.count({
            where: getQueryFilterWhereClause(query)
        });

        return count;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('could not get total number of inventory.');
    }
}
