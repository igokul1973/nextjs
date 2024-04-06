import { getFilteredInventoryByAccountId } from '@/app/lib/data/inventory';
import InventoryTable from './inventory-table/InventoryTable';
import { IProps } from './types';

const TableWrapper = async ({ accountId, query }: IProps) => {
    const inventory = await getFilteredInventoryByAccountId(accountId, query);
    return <InventoryTable inventory={inventory} />;
};

export default TableWrapper;
