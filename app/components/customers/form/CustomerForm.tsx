'use client';

import { StyledBox } from '@/app/[locale]/dashboard/customers/create/styled';
import { TProviderIndForm } from '@/app/components/individuals/form/types';
import { getCustomerIndDefaultFormValues } from '@/app/components/individuals/utils';
import { TProviderOrgForm } from '@/app/components/organizations/form/types';
import { getCustomerOrgDefaultFormValues } from '@/app/components/organizations/utils';
import Warning from '@/app/components/warning/Warning';
import { useUser } from '@/app/context/user/provider';
import { useI18n } from '@/locales/client';
import Business from '@mui/icons-material/Business';
import Face from '@mui/icons-material/Face';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { EntitiesEnum } from '@prisma/client';
import { FC, useEffect, useState } from 'react';
import CustomerIndFormData from './CustomerIndFormData';
import CustomerOrgFormData from './CustomerOrgFormData';
import { ICustomerFormProps } from './types';

const CustomerForm: FC<ICustomerFormProps> = ({ userAccountCountry, localIdentifierNames }) => {
    const t = useI18n();
    const {
        state: { user, account }
    } = useUser();
    const [customerType, setCustomerType] = useState<EntitiesEnum | ''>('');

    const [defaultIndividualValues, setDefaultIndividualValues] = useState<TProviderIndForm | null>(
        null
    );
    const [defaultOrganizationValues, setDefaultOrganizationValues] =
        useState<TProviderOrgForm | null>(null);

    const entities = Object.values(EntitiesEnum).map((entity) => {
        return {
            name: entity,
            icon: entity === EntitiesEnum.individual ? Face : Business
        };
    });

    const individualLocalIdentifierName = localIdentifierNames.find(
        (name) => name.type === EntitiesEnum.individual
    );

    const organizationLocalIdentifierName = localIdentifierNames.find(
        (name) => name.type === EntitiesEnum.organization
    );

    useEffect(() => {
        if (customerType && individualLocalIdentifierName && organizationLocalIdentifierName) {
            if (customerType === EntitiesEnum.individual) {
                const defaultValues = getCustomerIndDefaultFormValues(
                    account.id,
                    user.id,
                    userAccountCountry.id,
                    individualLocalIdentifierName.id
                );
                setDefaultOrganizationValues(null);
                setDefaultIndividualValues(defaultValues);
            } else {
                const defaultValues = getCustomerOrgDefaultFormValues(
                    account.id,
                    user.id,
                    userAccountCountry.id,
                    organizationLocalIdentifierName.id
                );
                setDefaultIndividualValues(null);
                setDefaultOrganizationValues(defaultValues);
            }
        }
    }, [
        account.id,
        customerType,
        individualLocalIdentifierName,
        organizationLocalIdentifierName,
        user.id,
        userAccountCountry.id
    ]);

    if (!individualLocalIdentifierName || !organizationLocalIdentifierName) {
        return (
            <Warning variant='h4'>
                No local identifier names provided. Please create one(s) for organization and/or
                individual customers for the current user&apos;s country.
            </Warning>
        );
    }

    return (
        <StyledBox component='section'>
            {/* Customer Name */}
            <FormControl fullWidth>
                <InputLabel id='customer-type-label'>
                    {capitalize(t('select customer type'))}
                </InputLabel>
                <Select
                    labelId='customer-type-label'
                    id='customer-type'
                    name='customerType'
                    value={customerType}
                    label={capitalize(t('select customer type'))}
                    onChange={(event: SelectChangeEvent) =>
                        setCustomerType(event.target.value as EntitiesEnum)
                    }
                >
                    {entities.map((entity, index) => {
                        const Icon = entity.icon;
                        return (
                            <MenuItem key={index} value={entity.name}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Icon />
                                    <span>{capitalize(t(entity.name))}</span>
                                </Box>
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
            {customerType === EntitiesEnum.individual && defaultIndividualValues ? (
                <CustomerIndFormData
                    localIdentifierName={individualLocalIdentifierName}
                    rawDefaultValues={defaultIndividualValues}
                    isEdit={false}
                />
            ) : customerType === EntitiesEnum.organization && defaultOrganizationValues ? (
                <CustomerOrgFormData
                    localIdentifierName={organizationLocalIdentifierName}
                    rawDefaultValues={defaultOrganizationValues}
                    isEdit={false}
                />
            ) : null}
        </StyledBox>
    );
};

export default CustomerForm;
