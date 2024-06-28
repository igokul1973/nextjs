'use client';

import { TAttribute, TProviderIndForm } from '@/app/components/individuals/form/types';
import { getProviderIndDefaultFormValues } from '@/app/components/individuals/utils';
import { TProviderOrgForm } from '@/app/components/organizations/form/types';
import { getProviderOrgDefaultFormValues } from '@/app/components/organizations/utils';
import Warning from '@/app/components/warning/Warning';
import { useRightDrawerState } from '@/app/context/right-drawer/provider';
import { useApp } from '@/app/context/user/provider';
import { updateIndividual } from '@/app/lib/data/indiviidual/actions';
import { updateOrganization } from '@/app/lib/data/organization/actions';
import { populateForm } from '@/app/lib/utils';
import { EntitiesEnum } from '@prisma/client';
import { FC, useCallback } from 'react';
import ProviderIndFormData from './ProviderIndFormData';
import ProviderOrgFormData from './ProviderOrgFormData';

const UpdateProviderForm: FC = () => {
    const {
        state: { user, account, provider },
        dispatch: dispatchAppState
    } = useApp();

    const updateProviderState = useCallback(
        (provider: Awaited<ReturnType<typeof updateIndividual | typeof updateOrganization>>) =>
            dispatchAppState({
                type: 'update',
                payload: {
                    provider
                }
            }),
        [dispatchAppState]
    );

    const { dispatch: rightDrawerDispatch } = useRightDrawerState();

    const isIndividual = !!provider['firstName'] && !!provider['lastName'];

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

    const userAccountCountry = provider.address.country;
    const localIdentifierNames = userAccountCountry.localIdentifierNames;

    const localIdentifierName = isIndividual
        ? localIdentifierNames.find((name) => name.type === EntitiesEnum.individual)
        : localIdentifierNames.find((name) => name.type === EntitiesEnum.organization);

    if (!localIdentifierName) {
        return (
            <Warning variant='h4'>
                Before updating provider please seed the Local Identifier names.
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

    const goBack = () => {
        rightDrawerDispatch({
            payload: { childComponentName: 'account' },
            type: 'open'
        });
    };

    return isIndividual ? (
        <ProviderIndFormData
            user={user}
            localIdentifierName={localIdentifierName}
            defaultValues={defaultValues as TProviderIndForm}
            isEdit={true}
            updateProviderState={updateProviderState}
            goBack={goBack}
        />
    ) : (
        <ProviderOrgFormData
            user={user}
            localIdentifierName={localIdentifierName}
            defaultValues={defaultValues as TProviderOrgForm}
            isEdit={true}
            updateProviderState={updateProviderState}
            goBack={goBack}
        />
    );
};

export default UpdateProviderForm;
