import { getFilteredCustomersByAccountId } from '@/app/lib/data/customers';
import CustomersTable from './customers-table/CustomersTable';
import { IProps } from './types';

const TableWrapper = async ({ accountId, query, currentPage }: IProps) => {
    const customers = (await getFilteredCustomersByAccountId(accountId, query, currentPage)).map(
        (customer) => {
            return {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone
            };
        }
    );
    return <CustomersTable customers={customers} />;
};

export default TableWrapper;
