import { TInventoryTransformed } from '@/app/lib/data/inventory/types';
import { UseFieldArrayRemove } from 'react-hook-form';

export interface IProps {
    index: number;
    count: number;
    inventory: TInventoryTransformed[];
    accountId: string;
    remove: UseFieldArrayRemove;
}
