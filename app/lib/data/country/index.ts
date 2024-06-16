import prisma from '@/app/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';
import { TCountry } from '../../types';
import { FormSchema } from './formSchema';
import { getQueryFilterWhereClause } from './types';

export const CreateCountry = FormSchema.omit({ id: true });
export const UpdateCountry = FormSchema.omit({ id: true });

export async function getCountryById(id: string): Promise<TCountry | null> {
    noStore();
    try {
        const country = await prisma.country.findFirst({
            relationLoadStrategy: 'query',
            where: {
                id
            }
        });

        return country;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('could not get country.');
    }
}

export async function getCountries(): Promise<TCountry[]> {
    noStore();
    try {
        const countries = await prisma.country.findMany({
            relationLoadStrategy: 'query'
        });

        return countries;
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
