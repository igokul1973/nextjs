import IndividualForm from '@/app/components/individuals/create-form/IndividualForm';
import { TAttribute, TIndividualForm } from '@/app/components/individuals/create-form/types';
import OrganizationForm from '@/app/components/organizations/create-form/OrganizationForm';
import { TOrganizationForm } from '@/app/components/organizations/create-form/types';
import Warning from '@/app/components/warning/Warning';
import { getCustomerById } from '@/app/lib/data/customer';
import { getLocalIdentifierNamesByCountryId } from '@/app/lib/data/local-identifier-name';
import { capitalize } from '@/app/lib/utils';
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
    if (!session) redirect('/');
    const { provider, providerType } = session;
    const userAccountProvider = provider && providerType && provider[providerType];
    const userAccountCountry = userAccountProvider && userAccountProvider.address?.country;
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
        notFound();
    }

    const { individual, organization } = rawCustomer;
    const entity = individual || organization;

    if (!entity) {
        notFound();
    }

    const isIndividual = 'firstName' in entity;
    const { address, attributes, ...entityFields } = entity;
    const { country, ...addressFields } = address;
    const { ...attributesFields } = attributes as Record<string, TAttribute>;

    const form: TIndividualForm | TOrganizationForm = isIndividual
        ? {
              ...entityFields,
              address: {
                  ...addressFields
              },
              attributes: Object.values(attributesFields)
          }
        : {
              ...entityFields,
              address: {
                  ...addressFields
              },
              attributes: Object.values(attributesFields)
          };

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
                    form={form as TIndividualForm}
                />
            ) : (
                <OrganizationForm
                    userAccountCountry={userAccountCountry}
                    localIdentifierName={organizationLocalIdentifierName}
                    form={form as TOrganizationForm}
                />
            )}
        </StyledBox>
    );
};

export default Page;
