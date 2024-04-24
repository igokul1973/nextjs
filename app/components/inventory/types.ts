import { TInventoryType } from '@/app/lib/types';

export interface IInventory {
    id: string;
    name: string;
    description: string | null;
    type: TInventoryType;
    price: string;
    externalCode: string | null;
    internalCode: string | null;
    manufacturerCode: string | null;
    manufacturerPrice: string | null;
}
