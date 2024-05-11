import InvoiceForm from '@/app/components/invoices/form/InvoiceForm';
import { TInvoiceForm } from '@/app/components/invoices/form/types';
import { getDefaultFormValues } from '@/app/components/invoices/utils';
import Warning from '@/app/components/warning/Warning';
import { getCustomersByAccountId } from '@/app/lib/data/customer';
import { getFilteredInventoryByAccountIdRaw } from '@/app/lib/data/inventory';
import { getInvoiceById } from '@/app/lib/data/invoice';
import { getUserWithRelationsByEmail } from '@/app/lib/data/user';
import { capitalize, getUserProvider, getUserProviderType, populateForm } from '@/app/lib/utils';
import { auth } from '@/auth';
import { getI18n } from '@/locales/server';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { StyledBox } from '../../styled';

const Page = async ({ params: { id } }: { params: { id: string } }) => {
    const t = await getI18n();

    const session = await auth();
    const sessionUser = session?.user;
    if (!session || !sessionUser) redirect('/');
    const accountId = session.user.accountId;

    const dbUser = await getUserWithRelationsByEmail(sessionUser.email);

    if (!dbUser) {
        redirect('/');
    }

    const provider = getUserProvider(dbUser);
    const providerType = getUserProviderType(provider);

    const userAccountProvider = provider && providerType && provider[providerType];
    const isDataLoaded = !!userAccountProvider;

    if (!isDataLoaded) {
        return (
            <Warning variant='h4'>
                Before creating invoices please register yourself as a Provider.
            </Warning>
        );
    }

    const invoicePromise = getInvoiceById(id);
    const customersPromise = getCustomersByAccountId(session.user.accountId);
    const inventoryPromise = getFilteredInventoryByAccountIdRaw(accountId, '', 0, 50);
    const [invoice, customers, rawInventory] = await Promise.all([
        invoicePromise,
        customersPromise,
        inventoryPromise
    ]);

    if (!invoice) {
        notFound();
    }

    const inventory = rawInventory.map((rawInventoryItem) => {
        const {
            price: rawPrice,
            manufacturerPrice: rawManufacturerPrice,
            ...partialInventoryItem
        } = rawInventoryItem;

        return {
            price: rawPrice / 100,
            manufacturerPrice: rawManufacturerPrice === null ? null : rawManufacturerPrice / 100,
            ...partialInventoryItem
        };
    });

    const {
        date,
        invoiceItems,
        customerId,
        customerName,
        customerAddressLine1,
        customerAddressLine2,
        customerAddressLine3,
        customerLocality,
        customerRegion,
        customerPostCode,
        customerCountry,
        customerPhone,
        customerEmail,
        ...formRaw
    } = invoice;

    const preparedInvoiceItems = invoiceItems.map((invoiceItem) => {
        const { price: rawPrice, ...partialInvoiceItem } = invoiceItem;

        return {
            price: rawPrice / 100,
            inventoryItem: {
                id: partialInvoiceItem.inventoryId,
                name: partialInvoiceItem.name
            },
            ...partialInvoiceItem
        };
    });

    const customer = {
        customerId,
        customerName,
        customerAddressLine1,
        customerAddressLine2,
        customerAddressLine3,
        customerLocality,
        customerRegion,
        customerPostCode,
        customerCountry,
        customerPhone,
        customerEmail
    };

    const form = { ...formRaw, customer, date: new Date(date), invoiceItems: preparedInvoiceItems };

    const firstProviderPhone = userAccountProvider.phones[0];
    const firstProviderEmail = userAccountProvider.emails[0];

    // Since the DB may return some empty (null, undefined) values or not return
    // some keys at all, but the form expects certain values to be set
    // in order to later calculate the dirty values, we need to convert them where
    // appropriate to default values.
    const defaultValues = populateForm<TInvoiceForm>(
        getDefaultFormValues(
            sessionUser.id,
            `${firstProviderPhone.countryCode}-${firstProviderPhone.number}`,
            firstProviderEmail.email
        ),
        form
    );

    return (
        <StyledBox component='section'>
            <Typography variant='h1'>{capitalize(t('update invoice'))}</Typography>
            <Breadcrumbs aria-label='breadcrumb'>
                <Link
                    component={NextLink}
                    underline='hover'
                    color='inherit'
                    href='/dashboard/invoices'
                >
                    {capitalize(t('invoices'))}
                </Link>
                <Typography color='text.primary'>{capitalize(t('update invoice'))}</Typography>
            </Breadcrumbs>
            <InvoiceForm
                customers={customers}
                inventory={inventory}
                accountId={accountId}
                providerPhones={userAccountProvider.phones}
                providerEmails={userAccountProvider.emails}
                defaultValues={defaultValues}
                isEdit={true}
            />
        </StyledBox>
    );
};

export default Page;
