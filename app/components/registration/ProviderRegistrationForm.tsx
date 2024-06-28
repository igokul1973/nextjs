'use client';

import { usePartialApp } from '@/app/context/user/provider';
import { getCountries } from '@/app/lib/data/country';
import { createIndividual } from '@/app/lib/data/indiviidual/actions';
import { createOrganization } from '@/app/lib/data/organization/actions';
import { useI18n } from '@/locales/client';
import BusinessIcon from '@mui/icons-material/Business';
import FaceIcon from '@mui/icons-material/Face';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { EntitiesEnum } from '@prisma/client';
import { FC, useCallback, useEffect, useState } from 'react';
import ProviderIndFormData from '../account/form/ProviderIndFormData';
import ProviderOrgFormData from '../account/form/ProviderOrgFormData';
import { TProviderIndForm } from '../individuals/form/types';
import { getProviderIndDefaultFormValues } from '../individuals/utils';
import { TProviderOrgForm } from '../organizations/form/types';
import { getProviderOrgDefaultFormValues } from '../organizations/utils';
import Warning from '../warning/Warning';
import { StyledProviderContainer } from './styled';

const ProviderRegistrationForm: FC = () => {
    const t = useI18n();
    const {
        state: { account, user, countries },
        dispatch: dispatchAppState
    } = usePartialApp();
    const [providerType, setProviderType] = useState<EntitiesEnum | ''>('');
    const [countryId, setCountryId] = useState<string>('');
    const [country, setCountry] = useState<Awaited<ReturnType<typeof getCountries>>[number]>();
    const [defaultIndividualValues, setDefaultIndividualValues] = useState<TProviderIndForm | null>(
        null
    );
    const [defaultOrganizationValues, setDefaultOrganizationValues] =
        useState<TProviderOrgForm | null>(null);

    useEffect(() => {
        if (countries) {
            setCountry(countries.find((c) => c.id === countryId));
        }
    }, [countryId, countries]);

    const localIdentifierNames = country?.localIdentifierNames ?? [];

    const entityTypes = Object.values(EntitiesEnum).map((entity) => {
        return {
            name: entity,
            icon: entity === EntitiesEnum.individual ? FaceIcon : BusinessIcon
        };
    });

    const individualLocalIdentifierName = localIdentifierNames.find(
        (name) => name.type === EntitiesEnum.individual
    );

    const organizationLocalIdentifierName = localIdentifierNames.find(
        (name) => name.type === EntitiesEnum.organization
    );

    useEffect(() => {
        if (
            providerType &&
            individualLocalIdentifierName &&
            organizationLocalIdentifierName &&
            account?.id &&
            user?.id &&
            countryId
        ) {
            if (providerType === EntitiesEnum.individual) {
                const defaultValues = getProviderIndDefaultFormValues(
                    account.id,
                    user.id,
                    countryId,
                    individualLocalIdentifierName.id
                );
                setDefaultOrganizationValues(null);
                setDefaultIndividualValues(defaultValues);
            } else {
                const defaultValues = getProviderOrgDefaultFormValues(
                    account.id,
                    user.id,
                    countryId,
                    organizationLocalIdentifierName.id
                );
                setDefaultIndividualValues(null);
                setDefaultOrganizationValues(defaultValues);
            }
        }
    }, [
        account?.id,
        providerType,
        individualLocalIdentifierName,
        organizationLocalIdentifierName,
        user?.id,
        countryId
    ]);

    const updateProviderState = useCallback(
        (provider: Awaited<ReturnType<typeof createIndividual | typeof createOrganization>>) =>
            dispatchAppState({
                type: 'update',
                payload: {
                    provider
                }
            }),
        [dispatchAppState]
    );

    const isRenderIndForm =
        user &&
        providerType === EntitiesEnum.individual &&
        defaultIndividualValues &&
        individualLocalIdentifierName;

    const isRenderOrgForm =
        user &&
        providerType === EntitiesEnum.organization &&
        defaultOrganizationValues &&
        organizationLocalIdentifierName;

    return (
        <StyledProviderContainer component='section'>
            {/* Provider Type */}
            <FormControl fullWidth>
                <InputLabel id='provider-type-label'>
                    {capitalize(t('select provider type'))}
                </InputLabel>
                <Select
                    labelId='provider-type-label'
                    id='provider-type'
                    name='providerType'
                    value={providerType}
                    label={capitalize(t('select provider type'))}
                    onChange={(event: SelectChangeEvent) =>
                        setProviderType(event.target.value as EntitiesEnum)
                    }
                >
                    {entityTypes.map((entityType) => {
                        const Icon = entityType.icon;
                        return (
                            <MenuItem key={entityType.name} value={entityType.name}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Icon />
                                    <span>{capitalize(t(entityType.name))}</span>
                                </Box>
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id='country-label'>{capitalize(t('select country'))}</InputLabel>
                <Select
                    labelId='country-label'
                    id='country'
                    name='country'
                    value={countryId}
                    label={capitalize(t('select country'))}
                    onChange={(event: SelectChangeEvent) => setCountryId(event.target.value)}
                >
                    {countries.map((country) => {
                        return (
                            <MenuItem key={country.name} value={country.id}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <span>{capitalize(country.name)}</span>
                                </Box>
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
            {isRenderIndForm ? (
                <ProviderIndFormData
                    user={user}
                    localIdentifierName={individualLocalIdentifierName}
                    defaultValues={defaultIndividualValues}
                    isEdit={false}
                    updateProviderState={updateProviderState}
                >
                    {/* <Button type='submit' variant='contained' color='primary' disabled={!isValid}> */}
                    <Button type='submit' variant='contained' color='primary'>
                        {capitalize(t('next'))}
                    </Button>
                </ProviderIndFormData>
            ) : isRenderOrgForm ? (
                <ProviderOrgFormData
                    user={user}
                    localIdentifierName={organizationLocalIdentifierName}
                    defaultValues={defaultOrganizationValues}
                    isEdit={false}
                    updateProviderState={updateProviderState}
                >
                    {/* <Button type='submit' variant='contained' color='primary' disabled={!isValid}> */}
                    <Button type='submit' variant='contained' color='primary'>
                        {capitalize(t('next'))}
                    </Button>
                </ProviderOrgFormData>
            ) : (
                <Warning variant='h6'>
                    {capitalize(
                        t(
                            'select provider type and country above in order to see provider registration form'
                        )
                    )}
                    .
                </Warning>
            )}
        </StyledProviderContainer>
    );
};

export default ProviderRegistrationForm;
