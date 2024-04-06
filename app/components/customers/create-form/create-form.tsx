'use client';

import { createCustomer } from '@/app/lib/data/customers';
import Business from '@mui/icons-material/Business';
import Face from '@mui/icons-material/Face';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { EntitiesEnum } from '@prisma/client';
import NextLink from 'next/link';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import styles from './create-form.module.scss';

export default function Form() {
    const [touched, setTouched] = useState(false);
    const initialState = { message: null, errors: {}, touched: false };
    const [state, formAction] = useFormState(createCustomer, initialState);
    const [customerType, setCustomerType] = useState<string>();
    const entities = Object.values(EntitiesEnum).map((entity) => {
        return {
            name: entity,
            icon: entity === EntitiesEnum.individual ? Face : Business
        };
    });

    return (
        <form action={formAction} className={styles.form}>
            {/* Customer Name */}
            <FormControl fullWidth>
                <InputLabel id='customer'>Select customer type</InputLabel>
                <Select
                    labelId='customer'
                    id='customer-select'
                    name='customeId'
                    value={customerType}
                    label='Select customer type'
                    onChange={(event: SelectChangeEvent) => setCustomerType(event.target.value)}
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <Button component={NextLink} href='/dashboard/customers' variant='outlined'>
                    Cancel
                </Button>
                <Button
                    type='submit'
                    disabled={!touched || !!state.errors?.customerId}
                    variant='outlined'
                >
                    Create Customer
                </Button>
            </Box>
        </form>
    );
}
