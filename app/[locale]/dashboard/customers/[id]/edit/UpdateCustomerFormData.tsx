import CustomerIndFormData from '@/app/components/customers/form/CustomerIndFormData';
import CustomerOrgFormData from '@/app/components/customers/form/CustomerOrgFormData';
import { TAttribute, TProviderIndForm } from '@/app/components/individuals/form/types';
import { getCustomerIndDefaultFormValues } from '@/app/components/individuals/utils';
import { TProviderOrgForm } from '@/app/components/organizations/form/types';
import { getCustomerOrgDefaultFormValues } from '@/app/components/organizations/utils';
import Warning from '@/app/components/warning/Warning';
import { getCustomerById } from '@/app/lib/data/customer';
import { getApp, populateForm } from '@/app/lib/utils';
import { EntitiesEnum } from '@prisma/client';
import { setStaticParamsLocale } from 'next-international/server';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import { IProps } from './types';

const UpdateCustomerFormData: FC<IProps> = async ({ params: { id, locale } }) => {
    setStaticParamsLocale(locale);

    const { user, provider, account } = await getApp();

    const userAccountCountry = provider.address.country;
    const localIdentifierNames = userAccountCountry.localIdentifierNames;

    if (!localIdentifierNames.length) {
        return (
            <Warning variant='h4'>
                Before updating customers please seed the Local Identifier names.
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
    const entity = individual ?? organization;

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
        ? getCustomerIndDefaultFormValues(
              account.id,
              user.id,
              userAccountCountry.id,
              individualLocalIdentifierName.id
          )
        : getCustomerOrgDefaultFormValues(
              account.id,
              user.id,
              userAccountCountry.id,
              individualLocalIdentifierName.id
          );

    // Since the DB may return some empty (null, undefined) values or not return
    // some keys at all, but the form expects certain values to be set
    // in order to later calculate the dirty values, we need to convert them where
    // appropriate to default values.
    const defaultValues = populateForm<TProviderIndForm | TProviderOrgForm>(defaultForm, form);

    return isIndividual ? (
        <CustomerIndFormData
            localIdentifierName={individualLocalIdentifierName}
            rawDefaultValues={defaultValues as TProviderIndForm}
            isEdit
        />
    ) : (
        <CustomerOrgFormData
            localIdentifierName={individualLocalIdentifierName}
            rawDefaultValues={defaultValues as TProviderOrgForm}
            isEdit
        />
    );
};

export default UpdateCustomerFormData;
