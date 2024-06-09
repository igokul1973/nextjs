import prisma from '@/app/lib/prisma';
import { IBaseDataFilterArgs, TMeasurementUnit } from '@/app/lib/types';
import { unstable_noStore as noStore } from 'next/cache';
import { DEFAULT_ITEMS_PER_PAGE } from './constants';

export async function getFilteredMeasurementUnitsByAccount({
    accountId,
    query = '',
    page = 0,
    itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
    orderBy = 'name',
    order = 'asc'
}: IBaseDataFilterArgs): Promise<TMeasurementUnit[]> {
    noStore();

    const offset = page * itemsPerPage;

    try {
        return await prisma.measurementUnit.findMany({
            relationLoadStrategy: 'query',
            take: itemsPerPage,
            skip: offset,
            orderBy: {
                [orderBy]: order
            },
            where: {
                AND: [
                    {
                        accountId: {
                            equals: accountId
                        }
                    },
                    {
                        OR: [
                            {
                                name: {
                                    contains: query,
                                    mode: 'insensitive'
                                }
                            },
                            {
                                abbreviation: {
                                    contains: query,
                                    mode: 'insensitive'
                                }
                            }
                        ]
                    }
                ]
            }
        });
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to get measurementUnits.');
    }
}
