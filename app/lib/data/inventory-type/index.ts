'use server';

import prisma from '@/app/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';
import { TGetInventoryTypePayload, getInventoryTypesSelect } from './types';

export async function getInventoryTypeById(id: string): Promise<TGetInventoryTypePayload | null> {
    noStore();
    try {
        const inventoryTypeType = await prisma.inventoryType.findFirst({
            relationLoadStrategy: 'query',
            select: getInventoryTypesSelect,
            where: {
                id
            }
        });

        return inventoryTypeType;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('could not get inventoryTypeType.');
    }
}

export async function getInventoryTypes(): Promise<TGetInventoryTypePayload[]> {
    noStore();
    try {
        const inventoryTypeTypes = await prisma.inventoryType.findMany({
            relationLoadStrategy: 'query',
            orderBy: {
                type: 'asc'
            }
        });

        return inventoryTypeTypes;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('could not get inventoryTypeTypes.');
    }
}
