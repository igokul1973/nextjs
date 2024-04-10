'use client';

import { StyledBox } from '@/app/[locale]/dashboard/customers/create/styled';
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
import IndividualForm from '../../individuals/create-form/IndividualForm';
import { IProps } from './types';
import OrganizationForm from '../../organizations/create-form/OrganizationForm';

const CustomerForm: FC<IProps> = ({ countries, userAccountCountry }) => {
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
                    labelId='customer-type-label'
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
                <IndividualForm countries={countries} userAccountCountry={userAccountCountry} />
            ) : customerType === EntitiesEnum.organization ? (
                <OrganizationForm countries={countries} />
            ) : null}
        </StyledBox>
    );
};

export default CustomerForm;
