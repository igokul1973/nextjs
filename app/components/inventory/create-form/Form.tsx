'use client';

import { createInventoryItem } from '@/app/lib/data/inventory';
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
    const [state, formAction] = useFormState(createInventoryItem, initialState);
    const [inventoryItemType, setInventoryType] = useState<string>();
    const entities = Object.values(EntitiesEnum).map((entity) => {
        return {
            name: entity,
            icon: entity === EntitiesEnum.individual ? Face : Business
        };
    });

    return (
        <form action={formAction} className={styles.form}>
            {/* Inventory Name */}
            <FormControl fullWidth>
                <InputLabel id='inventoryItem'>Select customer type</InputLabel>
                <Select
                    labelId='inventoryItem'
                    id='inventoryItem-select'
                    name='customeId'
                    value={inventoryItemType}
                    label='Select inventoryItem type'
                    onChange={(event: SelectChangeEvent) => setInventoryType(event.target.value)}
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
                <Button component={NextLink} href='/dashboard/inventory' variant='outlined'>
                    Cancel
                </Button>
                <Button
                    type='submit'
                    disabled={!touched || !!state.errors?.name}
                    variant='outlined'
                >
                    Create Inventory
                </Button>
            </Box>
        </form>
    );
}
