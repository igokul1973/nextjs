'use client';

import { useData } from '@/app/context/data/provider';
import { usePartialApp } from '@/app/context/user/provider';
import { createIndividual } from '@/app/lib/data/indiviidual/actions';
import { createOrganization } from '@/app/lib/data/organization/actions';
import { getFromLocalStorage, populateForm, setLocalStorage } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import BusinessIcon from '@mui/icons-material/Business';
import FaceIcon from '@mui/icons-material/Face';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { EntitiesEnum } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useEffect, useState } from 'react';
import ProviderIndFormData from '../account/form/ProviderIndFormData';
import ProviderOrgFormData from '../account/form/ProviderOrgFormData';
import { TProviderIndForm } from '../individuals/form/types';
import { getProviderIndDefaultFormValues } from '../individuals/utils';
import { TProviderOrgForm } from '../organizations/form/types';
import { getProviderOrgDefaultFormValues } from '../organizations/utils';
import Warning from '../warning/Warning';
import { StyledProviderContainer } from './styled';

const localStorageKey = 'providerData';

const ProviderRegistrationForm: FC = () => {
    const t = useI18n();
    const {
        state: { account, user },
        dispatch: dispatchAppState
    } = usePartialApp();
    const { push } = useRouter();
    const { countries, geoData } = useData();

    // Try to get provider-related data from the local storage
    const lsProviderData = getFromLocalStorage(localStorageKey) ?? {};
    const { providerType: rawProviderType, ...providerData } = lsProviderData;

    let lsProviderType: EntitiesEnum | '' = '';
    if (rawProviderType && rawProviderType in EntitiesEnum) {
        lsProviderType = rawProviderType;
    }
    // To avoid hydration error I am not setting the provider type from the
    // local storage here. It will be set in the useEffect below.
    const [providerType, setProviderType] = useState<EntitiesEnum | ''>('');
    const [defaultIndividualValues, setDefaultIndividualValues] = useState<TProviderIndForm | null>(
        null
    );
    const [defaultOrganizationValues, setDefaultOrganizationValues] =
        useState<TProviderOrgForm | null>(null);

    const entityTypes = Object.values(EntitiesEnum).map((entity) => {
        return {
            name: entity,
            icon: entity === EntitiesEnum.individual ? FaceIcon : BusinessIcon
        };
    });

    // Using this useEffect to initially set the providerType
    // because setting the providerType directly in useState
    // would yield a hydration error.
    useEffect(() => {
        setProviderType(lsProviderType);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Here I am setting the default values for the form.
    // I also set the providerType in the local storage.
    // I also make sure the providerType matches the form data,
    // and if not - I remove the form data from the local storage,
    // thereby resetting the form.
    // I also remove the logo from the local storage and, thereby -
    // the form, as it is not possible to save the file in the local storage.
    useEffect(() => {
        if (providerType && account?.id && user?.id) {
            let internalLsProviderData = getFromLocalStorage(localStorageKey) ?? {};
            // const { providerType: internalProviderType, ...internalProviderData } =
            //     internalLsProviderData;
            if (typeof internalLsProviderData === 'object' && 'logo' in internalLsProviderData) {
                setLocalStorage(
                    localStorageKey,
                    JSON.stringify({
                        ...internalLsProviderData,
                        logo: null
                    })
                );
            }
            internalLsProviderData = getFromLocalStorage(localStorageKey) ?? {};
            // Here the countryId is taken from GEO API unless it is already set
            // in the local storage.
            const geoApiCountryId =
                countries.find((c) =>
                    geoData?.countryName.toLocaleLowerCase().includes(c.name.toLocaleLowerCase())
                )?.id ?? '';
            const countryId =
                'address' in internalLsProviderData && 'countryId' in internalLsProviderData.address
                    ? internalLsProviderData.address.countryId
                    : geoApiCountryId;
            if (providerType === EntitiesEnum.individual) {
                const {
                    providerType: rawProviderType,
                    dob,
                    ...refreshedProviderData
                } = internalLsProviderData;
                const defaultValues = populateForm(
                    getProviderIndDefaultFormValues(account.id, user.id, countryId, ''),
                    { ...refreshedProviderData, dob: dob ? new Date(dob) : null }
                );
                setDefaultOrganizationValues(null);
                setDefaultIndividualValues(defaultValues);
            } else {
                const { providerType: rawProviderType, ...refreshedProviderData } =
                    internalLsProviderData;
                const defaultValues = populateForm(
                    getProviderOrgDefaultFormValues(account.id, user.id, countryId, ''),
                    refreshedProviderData
                );
                setDefaultIndividualValues(null);
                setDefaultOrganizationValues(defaultValues);
            }
        }
    }, [account?.id, providerType, user?.id, geoData, countries]);

    const updateProviderState = useCallback(
        (provider: Awaited<ReturnType<typeof createIndividual | typeof createOrganization>>) => {
            dispatchAppState({
                type: 'update',
                payload: {
                    provider
                }
            });
        },
        [dispatchAppState]
    );

    const isRenderIndForm =
        user && providerType === EntitiesEnum.individual && defaultIndividualValues;

    const isRenderOrgForm =
        user && providerType === EntitiesEnum.organization && defaultOrganizationValues;

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
            {isRenderIndForm ? (
                <ProviderIndFormData
                    user={user}
                    defaultValues={defaultIndividualValues}
                    isEdit={false}
                    updateProviderState={updateProviderState}
                    goBack={() => push('/registration')}
                />
            ) : isRenderOrgForm ? (
                <ProviderOrgFormData
                    user={user}
                    defaultValues={defaultOrganizationValues}
                    isEdit={false}
                    updateProviderState={updateProviderState}
                    goBack={() => push('/registration')}
                />
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
