import IndividualForm from '@/app/components/individuals/form/IndividualForm';
import { TAttribute, TIndividualForm } from '@/app/components/individuals/form/types';
import { getDefaultFormValues as getDefaultIndividualFormValues } from '@/app/components/individuals/utils';
import OrganizationForm from '@/app/components/organizations/form/OrganizationForm';
import { TOrganizationForm } from '@/app/components/organizations/form/types';
import { getDefaultFormValues as getDefaultOrganizationFormValues } from '@/app/components/organizations/utils';
import Warning from '@/app/components/warning/Warning';
import { getCustomerById } from '@/app/lib/data/customer';
import { getLocalIdentifierNamesByCountryId } from '@/app/lib/data/local-identifier-name';
import { getUserWithRelationsByEmail } from '@/app/lib/data/user';
import { capitalize, getUserProvider, getUserProviderType, populateForm } from '@/app/lib/utils';
import { auth } from '@/auth';
import { getI18n } from '@/locales/server';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { EntitiesEnum } from '@prisma/client';
import NextLink from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { FC } from 'react';
import { StyledBox } from './styled';
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

    const { id: accountId } = dbUser.account;

    const provider = getUserProvider(dbUser);
    const providerType = getUserProviderType(provider);

    const userAccountProvider = provider && providerType && provider[providerType];
    const userAccountCountry = userAccountProvider?.address?.country;
    const localIdentifierNames =
        userAccountCountry && (await getLocalIdentifierNamesByCountryId(userAccountCountry?.id));
    const isDataLoaded = !!userAccountCountry && !!localIdentifierNames;

    if (!isDataLoaded) {
        return (
            <Warning variant='h4'>
                Before creating customers please register yourself as a Provider, seed the Countries
                and Local Identifier names.
            </Warning>
        );
    }

    const individualLocalIdentifierName = localIdentifierNames?.find(
        (name) => name.type === EntitiesEnum.individual
    );

    const organizationLocalIdentifierName = localIdentifierNames?.find(
        (name) => name.type === EntitiesEnum.organization
    );

    if (!individualLocalIdentifierName || !organizationLocalIdentifierName) {
        return (
            <Warning variant='h4'>
                No local identifier names provided. Please create one(s) for organization and/or
                individual customers for the current user&apos;s country.
            </Warning>
        );
    }

    const rawCustomer = await getCustomerById(id);

    if (!rawCustomer) {
        return notFound();
    }

    const { individual, organization } = rawCustomer;
    const entity = individual || organization;

    if (!entity) {
        return notFound();
    }

    const isIndividual = 'firstName' in entity;
    const { address, attributes, customerId, ...entityFields } = entity;
    const { country, ...addressFields } = address;
    // Transforming JSON fields into array-like object
    const attributesFields = attributes
        ? { ...(attributes as Record<string, TAttribute>) }
        : undefined;

    const form = {
        ...entityFields,
        address: {
            ...addressFields
        },
        // Transforming JSON fields into array of objects
        attributes: attributesFields ? Object.values(attributesFields) : []
    };

    const defaultForm = isIndividual
        ? getDefaultIndividualFormValues(
              accountId,
              sessionUser.id,
              userAccountCountry.id,
              individualLocalIdentifierName.id
          )
        : getDefaultOrganizationFormValues(
              accountId,
              sessionUser.id,
              userAccountCountry.id,
              individualLocalIdentifierName.id
          );

    // Since the DB may return some empty (null, undefined) values or not return
    // some keys at all, but the form expects certain values to be set
    // in order to later calculate the dirty values, we need to convert them where
    // appropriate to default values.
    const customerForm = populateForm<TIndividualForm | TOrganizationForm>(defaultForm, form);

    return (
        <StyledBox component='main' className='wrapper'>
            <Typography variant='h1'>{capitalize(t('update customer'))}</Typography>
            <Breadcrumbs aria-label='breadcrumb'>
                <Link
                    component={NextLink}
                    underline='hover'
                    color='inherit'
                    href='/dashboard/customers'
                >
                    {capitalize(t('customers'))}
                </Link>
                <Typography color='text.primary'> {capitalize(t('update customer'))}</Typography>
            </Breadcrumbs>
            {isIndividual ? (
                <IndividualForm
                    userAccountCountry={userAccountCountry}
                    localIdentifierName={individualLocalIdentifierName}
                    form={customerForm as TIndividualForm}
                />
            ) : (
                <OrganizationForm
                    userAccountCountry={userAccountCountry}
                    localIdentifierName={organizationLocalIdentifierName}
                    form={customerForm as TOrganizationForm}
                />
            )}
        </StyledBox>
    );
};

export default Page;
