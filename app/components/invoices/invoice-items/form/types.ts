import { TInventoryTransformed } from '@/app/lib/data/inventory/types';
import { TMeasurementUnit } from '@/app/lib/types';
import { UseFieldArrayRemove } from 'react-hook-form';

export interface IProps {
    index: number;
    count: number;
    inventory: TInventoryTransformed[];
    measurementUnits: TMeasurementUnit[];
    accountId: string;
    remove: UseFieldArrayRemove;
    recalculateTotals: () => void;
}
