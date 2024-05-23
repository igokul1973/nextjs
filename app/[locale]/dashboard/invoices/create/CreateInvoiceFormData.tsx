import InvoiceForm from '@/app/components/invoices/form/InvoiceForm';
import { getDefaultFormValues } from '@/app/components/invoices/utils';
import Warning from '@/app/components/warning/Warning';
import { getCustomersByAccountId } from '@/app/lib/data/customer';
import { getFilteredInventoryByAccountIdRaw } from '@/app/lib/data/inventory';
import { getUser } from '@/app/lib/utils';
import { setStaticParamsLocale } from 'next-international/server';
import { FC } from 'react';
import { IProps } from './types';

const CreateInvoiceFormData: FC<IProps> = async ({ params: { locale } }) => {
    setStaticParamsLocale(locale);
    const { user, provider, account } = await getUser();

    const userAccountCountry = provider && provider.address?.country;

    if (!userAccountCountry) {
        return (
            <Warning variant='h4'>
                Before creating invoices please register yourself as a Provider.
            </Warning>
        );
    }

    const customersPromise = getCustomersByAccountId(account.id);
    const inventoryPromise = getFilteredInventoryByAccountIdRaw({
        accountId: account.id,
        query: '',
        page: 0,
        itemsPerPage: 50
    });
    const [customers, inventory] = await Promise.all([customersPromise, inventoryPromise]);

    const defaultValues = getDefaultFormValues(user.id, provider);

    return (
        <InvoiceForm
            customers={customers}
            inventory={inventory}
            accountId={account.id}
            locale={userAccountCountry.locale}
            providerPhones={provider.phones}
            providerEmails={provider.emails}
            defaultValues={defaultValues}
            isEdit={false}
        />
    );
};
export default CreateInvoiceFormData;
