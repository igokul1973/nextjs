'use client';

import { StyledBox } from '@/app/[locale]/dashboard/customers/create/styled';
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
import IndividualForm from '../../individuals/form/IndividualForm';
import { TIndividualForm } from '../../individuals/form/types';
import { getDefaultFormValues as getDefaultIndividualFormValues } from '../../individuals/utils';
import OrganizationForm from '../../organizations/form/OrganizationForm';
import { TOrganizationForm } from '../../organizations/form/types';
import { getDefaultFormValues as getDefaultOrganizationFormValues } from '../../organizations/utils';
import Warning from '../../warning/Warning';
import { ICustomerFormProps } from './types';

const CustomerForm: FC<ICustomerFormProps> = ({ userAccountCountry, localIdentifierNames }) => {
    const t = useI18n();
    const { user, account } = useUser();
    const [customerType, setCustomerType] = useState<EntitiesEnum | ''>('');

    const [defaultIndividualValues, setDefaultIndividualValues] = useState<TIndividualForm | null>(
        null
    );
    const [defaultOrganizationValues, setDefaultOrganizationValues] =
        useState<TOrganizationForm | null>(null);

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
            if (customerType !== EntitiesEnum.individual) {
                const defaultValues = getDefaultIndividualFormValues(
                    account.id,
                    user.id,
                    userAccountCountry.id,
                    individualLocalIdentifierName.id
                );
                setDefaultOrganizationValues(null);
                setDefaultIndividualValues(defaultValues);
            } else {
                const defaultValues = getDefaultOrganizationFormValues(
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
                <IndividualForm
                    userAccountCountry={userAccountCountry}
                    localIdentifierName={individualLocalIdentifierName}
                    defaultValues={defaultIndividualValues}
                    isEdit={false}
                />
            ) : customerType === EntitiesEnum.organization && defaultOrganizationValues ? (
                <OrganizationForm
                    userAccountCountry={userAccountCountry}
                    localIdentifierName={organizationLocalIdentifierName}
                    defaultValues={defaultOrganizationValues}
                    isEdit={false}
                />
            ) : null}
        </StyledBox>
    );
};

export default CustomerForm;
