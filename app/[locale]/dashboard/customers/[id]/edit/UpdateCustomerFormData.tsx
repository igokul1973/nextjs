import CustomerIndFormData from '@/app/components/customers/form/CustomerIndFormData';
import CustomerOrgFormData from '@/app/components/customers/form/CustomerOrgFormData';
import { TAttribute, TIndividualForm } from '@/app/components/individuals/form/types';
import { getDefaultFormValues as getDefaultIndividualFormValues } from '@/app/components/individuals/utils';
import { TOrganizationForm } from '@/app/components/organizations/form/types';
import { getDefaultFormValues as getDefaultOrganizationFormValues } from '@/app/components/organizations/utils';
import Warning from '@/app/components/warning/Warning';
import { getCustomerById } from '@/app/lib/data/customer';
import { getLocalIdentifierNamesByCountryId } from '@/app/lib/data/local-identifier-name';
import { getUser, populateForm } from '@/app/lib/utils';
import { EntitiesEnum } from '@prisma/client';
import { setStaticParamsLocale } from 'next-international/server';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import { IProps } from './types';

const UpdateCustomerFormData: FC<IProps> = async ({ params: { id, locale } }) => {
    setStaticParamsLocale(locale);

    const { user, provider, account } = await getUser();

    const userAccountCountry = provider?.address?.country;
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

    const rawCustomer = await getCustomerById(id, account.id);

    if (!rawCustomer) {
        return notFound();
    }

    const { code, individual, organization } = rawCustomer;
    const entity = individual || organization;

    if (!entity) {
        return notFound();
    }

    const isIndividual = 'firstName' in entity;
    const { address, attributes, ...entityFields } = entity;
    const { country, ...addressFields } = address;
    // Transforming JSON fields into array-like object
    const attributesFields = attributes
        ? { ...(attributes as Record<string, TAttribute>) }
        : undefined;

    const form = {
        code,
        ...entityFields,
        address: {
            ...addressFields
        },
        // Transforming JSON fields into array of objects
        attributes: attributesFields ? Object.values(attributesFields) : []
    };

    const defaultForm = isIndividual
        ? getDefaultIndividualFormValues(
              account.id,
              user.id,
              userAccountCountry.id,
              individualLocalIdentifierName.id
          )
        : getDefaultOrganizationFormValues(
              account.id,
              user.id,
              userAccountCountry.id,
              individualLocalIdentifierName.id
          );

    // Since the DB may return some empty (null, undefined) values or not return
    // some keys at all, but the form expects certain values to be set
    // in order to later calculate the dirty values, we need to convert them where
    // appropriate to default values.
    const defaultValues = populateForm<TIndividualForm | TOrganizationForm>(defaultForm, form);

    return isIndividual ? (
        <CustomerIndFormData
            localIdentifierName={individualLocalIdentifierName}
            rawDefaultValues={defaultValues as TIndividualForm}
            isEdit
        />
    ) : (
        <CustomerOrgFormData
            localIdentifierName={individualLocalIdentifierName}
            rawDefaultValues={defaultValues as TOrganizationForm}
            isEdit
        />
    );
};

export default UpdateCustomerFormData;
