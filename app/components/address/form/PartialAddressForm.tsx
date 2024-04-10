'use client';

import { useI18n } from '@/locales/client';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { capitalize } from '@mui/material/utils';
import { FC } from 'react';
import FormSelect from '../../form-select/FormSelect';
import { IProps } from './types';

const PartialAddressForm: FC<IProps> = ({ register, countries, control, userAccountCountry }) => {
    const t = useI18n();
    return (
        <>
            <FormControl>
                <TextField
                    label='Street Address'
                    placeholder={capitalize(t('enter street address and building number'))}
                    variant='outlined'
                    required
                    {...register('addressLine1')}
                />
            </FormControl>
            <FormControl>
                <TextField
                    label={capitalize(t('address (line 2)'))}
                    placeholder={capitalize(t('continue street address and/or apartment number'))}
                    variant='outlined'
                    {...register('addressLine2')}
                />
            </FormControl>
            <FormControl>
                <TextField
                    label={capitalize(t('address (line 3)'))}
                    placeholder={capitalize(t('continue street address and/or apartment number'))}
                    variant='outlined'
                    {...register('addressLine3')}
                />
            </FormControl>
            <FormControl>
                <TextField
                    label={capitalize(t('city or locality'))}
                    placeholder={capitalize(t('enter city, village or locality'))}
                    variant='outlined'
                    required
                    {...register('locality')}
                />
            </FormControl>
            <FormControl>
                <TextField
                    label={capitalize(t('state or region'))}
                    placeholder={capitalize(t('enter state or region'))}
                    variant='outlined'
                    {...register('region')}
                />
            </FormControl>
            <FormControl>
                <TextField
                    label={capitalize(t('postal code'))}
                    placeholder={capitalize(t('enter postal/zip code'))}
                    variant='outlined'
                    {...register('postalcode')}
                />
            </FormControl>
            <FormSelect
                name='country'
                label={capitalize(t('country'))}
                control={control}
                defaultValue={[userAccountCountry.name]}
            >
                {countries.map((country) => {
                    return (
                        <MenuItem key={country.id} value={country.name}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span>{capitalize(country.name)}</span>
                            </Box>
                        </MenuItem>
                    );
                })}
            </FormSelect>
        </>
    );
};

export default PartialAddressForm;
