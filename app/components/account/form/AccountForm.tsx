'use client';

import { TAttribute, TProviderIndForm } from '@/app/components/individuals/form/types';
import { getProviderIndDefaultFormValues } from '@/app/components/individuals/utils';
import { TProviderOrgForm } from '@/app/components/organizations/form/types';
import { getProviderOrgDefaultFormValues } from '@/app/components/organizations/utils';
import Warning from '@/app/components/warning/Warning';
import { useUser } from '@/app/context/user/provider';
import { populateForm } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import { capitalize } from '@mui/material';
import { EntitiesEnum } from '@prisma/client';
import { FC } from 'react';
import ProviderIndFormData from './ProviderIndFormData';
import ProviderOrgFormData from './ProviderOrgFormData';
import { IProps } from './types';

const AccountForm: FC<IProps> = () => {
    const t = useI18n();
    const {
        state: { user, account, provider }
    } = useUser();

    if (!provider) {
        return <Warning>{capitalize(t('please create provider first'))}</Warning>;
    }

    // const providerType = getUserProviderType(provider);
    const isIndividual = !!!provider['name'];

    const { address, attributes, ...entityFields } = provider;
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

    const userAccountCountry = provider.address?.country;
    const localIdentifierNames = userAccountCountry?.localIdentifierNames;

    const localIdentifierName = isIndividual
        ? localIdentifierNames.find((name) => name.type === EntitiesEnum.individual)
        : localIdentifierNames.find((name) => name.type === EntitiesEnum.organization);

    if (!localIdentifierName || !userAccountCountry) {
        return (
            <Warning variant='h4'>
                Before creating customers please register yourself as a Provider, seed the Countries
                and Local Identifier names.
            </Warning>
        );
    }

    const defaultForm = isIndividual
        ? getProviderIndDefaultFormValues(
              account.id,
              user.id,
              userAccountCountry.id,
              localIdentifierName.id
          )
        : getProviderOrgDefaultFormValues(
              account.id,
              user.id,
              userAccountCountry.id,
              localIdentifierName.id
          );

    const defaultValues = populateForm<TProviderIndForm | TProviderOrgForm>(defaultForm, form);

    // FIXME: isEdit === true for now...
    const isEdit = true;

    return isIndividual ? (
        <ProviderIndFormData
            localIdentifierName={localIdentifierName}
            defaultValues={defaultValues as TProviderIndForm}
            isEdit={isEdit}
        />
    ) : (
        <ProviderOrgFormData
            localIdentifierName={localIdentifierName}
            defaultValues={defaultValues as TProviderOrgForm}
            isEdit={isEdit}
        />
    );
};

export default AccountForm;
