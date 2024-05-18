'use client';

import { getDefaultFormValues as getDefaultIndividualFormValues } from '@/app/components/individuals/utils';
import { getDefaultFormValues as getDefaultOrganizationFormValues } from '@/app/components/organizations/utils';
// import { useRightDrawerState } from '@/app/context/right-drawer/provider';
import { useUser } from '@/app/context/user/provider';
import { populateForm } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import { capitalize } from '@mui/material';
import { EntitiesEnum } from '@prisma/client';
import { FC } from 'react';
import IndividualForm from '../../individuals/form/IndividualForm';
import { TAttribute, TIndividualForm } from '../../individuals/form/types';
import OrganizationForm from '../../organizations/form/OrganizationForm';
import { TOrganizationForm } from '../../organizations/form/types';
import Warning from '../../warning/Warning';
import { IProps } from './types';

const AccountForm: FC<IProps> = () => {
    const t = useI18n();
    // const { openSnackbar } = useSnackbar();
    const {
        state: { user, account, provider }
        // dispatch: userDispatch
    } = useUser();

    // const { dispatch: rightDrawerDispatch } = useRightDrawerState();

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
        ? getDefaultIndividualFormValues(
              account.id,
              user.id,
              userAccountCountry.id,
              localIdentifierName.id
          )
        : getDefaultOrganizationFormValues(
              account.id,
              user.id,
              userAccountCountry.id,
              localIdentifierName.id
          );

    const defaultValues = populateForm<TIndividualForm | TOrganizationForm>(defaultForm, form);

    // FIXME: isEdit === true for now...
    const isEdit = true;

    return isIndividual ? (
        <IndividualForm
            localIdentifierName={localIdentifierName}
            defaultValues={defaultValues as TIndividualForm}
            isEdit={isEdit}
            isCustomer={false}
        />
    ) : (
        <OrganizationForm
            localIdentifierName={localIdentifierName}
            defaultValues={defaultValues as TOrganizationForm}
            isEdit={isEdit}
            isCustomer={false}
        />
    );
};

export default AccountForm;
