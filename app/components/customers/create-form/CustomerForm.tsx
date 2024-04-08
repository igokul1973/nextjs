'use client';

import { StyledBox } from '@/app/[locale]/dashboard/customers/create/styled';
import OrganizationForm from '@/app/components/organizations/create-form/OrganizationForm';
import Business from '@mui/icons-material/Business';
import Face from '@mui/icons-material/Face';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { EntitiesEnum } from '@prisma/client';
import { useState } from 'react';
import IndividualForm from '../../individuals/create-form/IndividualForm';

export default function CustomerForm() {
    const [customerType, setCustomerType] = useState<EntitiesEnum | ''>('');
    const entities = Object.values(EntitiesEnum).map((entity) => {
        return {
            name: entity,
            icon: entity === EntitiesEnum.individual ? Face : Business
        };
    });

    return (
        <StyledBox component='section'>
            {/* Customer Name */}
            <FormControl fullWidth>
                <InputLabel id='customer-type-label'>Select customer type</InputLabel>
                <Select
                    labelId='customer-type'
                    id='customer-type'
                    name='customerType'
                    value={customerType}
                    label='Select customer type'
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
                                    <span>{capitalize(entity.name)}</span>
                                </Box>
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
            {customerType === EntitiesEnum.individual ? (
                <IndividualForm />
            ) : customerType === EntitiesEnum.organization ? (
                <OrganizationForm />
            ) : null}
        </StyledBox>
    );
}
