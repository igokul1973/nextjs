import { TInventory, TInventoryType } from '@/app/lib/types';
import { UseFieldArrayRemove } from 'react-hook-form';

export interface IProps {
    index: number;
    count: number;
    inventory: (TInventory & { type: TInventoryType })[];
    accountId: string;
    remove: UseFieldArrayRemove;
}
