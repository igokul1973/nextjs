import { getFilteredCustomersByAccountId } from '@/app/lib/data/customers';
import CustomersTable from './CustomersTable';

interface IProps {
    accountId: string;
    query: string;
    currentPage: number;
}

export interface ICustomer {
    id: string;
    name: string;
    email: string;
}

const TableWrapper = async ({ accountId, query, currentPage }: IProps) => {
    const customers = (await getFilteredCustomersByAccountId(accountId, query, currentPage)).map(
        (customer) => {
            return {
                id: customer.id,
                name: customer.name,
                email: customer.email
            };
        }
    );
    return <CustomersTable customers={customers} />;
};

export default TableWrapper;
