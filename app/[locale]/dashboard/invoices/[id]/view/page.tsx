import InvoiceView from '@/app/components/invoice-view/InvoiceView';
import { getInvoiceById } from '@/app/lib/data/invoice';
import { getUserWithRelationsByEmail } from '@/app/lib/data/user';
import { capitalize } from '@/app/lib/utils';
import { auth } from '@/auth';
import { getI18n } from '@/locales/server';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { FC } from 'react';
import { StyledBox } from '../../styled';
import { IProps } from './types';

const Page: FC<IProps> = async ({ params: { id } }) => {
    const t = await getI18n();

    const session = await auth();
    const sessionUser = session?.user;
    if (!session || !sessionUser) redirect('/');

    const dbUser = await getUserWithRelationsByEmail(sessionUser.email);

    if (!dbUser) {
        redirect('/');
    }

    const invoice = await getInvoiceById(id);

    if (!invoice) {
        notFound();
    }

    return (
        <StyledBox component='section'>
            <Typography variant='h1'>
                {capitalize(t('view invoice'))} # {invoice.number}
            </Typography>
            <Breadcrumbs aria-label='breadcrumb'>
                <Link
                    component={NextLink}
                    underline='hover'
                    color='inherit'
                    href='/dashboard/invoices'
                >
                    {capitalize(t('invoices'))}
                </Link>
                <Typography color='text.primary'>{capitalize(t('view invoice'))}</Typography>
            </Breadcrumbs>
            <InvoiceView invoice={invoice} />
        </StyledBox>
    );
};

export default Page;
