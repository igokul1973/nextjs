import { Prisma } from '@prisma/client';

export const getInventoryTypesSelect = {
    id: true,
    type: true
} satisfies Prisma.inventoryTypeSelect;

export type TGetInventoryTypePayload = Prisma.inventoryTypeGetPayload<{
    select: typeof getInventoryTypesSelect;
}>;
