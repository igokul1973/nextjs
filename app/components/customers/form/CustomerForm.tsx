'use client';

import { StyledBox } from '@/app/[locale]/dashboard/customers/create/styled';
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
import { FC, useState } from 'react';
import IndividualForm from '../../individuals/form/IndividualForm';
import OrganizationForm from '../../organizations/form/OrganizationForm';
import Warning from '../../warning/Warning';
import { ICustomerFormProps } from './types';

const CustomerForm: FC<ICustomerFormProps> = ({ userAccountCountry, localIdentifierNames }) => {
    const t = useI18n();
    const [customerType, setCustomerType] = useState<EntitiesEnum | ''>('');
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
            {customerType === EntitiesEnum.individual ? (
                <IndividualForm
                    userAccountCountry={userAccountCountry}
                    localIdentifierName={individualLocalIdentifierName}
                />
            ) : customerType === EntitiesEnum.organization ? (
                <OrganizationForm
                    userAccountCountry={userAccountCountry}
                    localIdentifierName={organizationLocalIdentifierName}
                />
            ) : null}
        </StyledBox>
    );
};

export default CustomerForm;
