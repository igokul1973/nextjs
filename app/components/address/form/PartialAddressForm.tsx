'use client';

import { useI18n } from '@/locales/client';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { capitalize } from '@mui/material/utils';
import FormSelect from '../../form-select/FormSelect';
import { IProps } from './types';

const PartialAddressForm = <T,>({ register /* , countries, control */, errors }: IProps<T>) => {
    const t = useI18n();

    const addressLine1Error = errors.address?.addressLine1;
    const localityError = errors.address?.locality;
    const postCodeError = errors.address?.postcode;
    // const countryIdError = errors.address?.countryId;

    return (
        <>
            <FormControl>
                <TextField
                    label={capitalize(t('street address'))}
                    placeholder={capitalize(t('enter street address and building number'))}
                    autoComplete='street-address'
                    variant='outlined'
                    required
                    error={!!addressLine1Error}
                    helperText={
                        !!addressLine1Error?.message && capitalize(addressLine1Error.message)
                    }
                    {...register('address.addressLine1')}
                />
            </FormControl>
            <FormControl>
                <TextField
                    label={capitalize(t('address (line 2)'))}
                    autoComplete='address-line2'
                    placeholder={capitalize(t('continue street address and/or apartment number'))}
                    variant='outlined'
                    {...register('address.addressLine2')}
                />
            </FormControl>
            <FormControl>
                <TextField
                    label={capitalize(t('address (line 3)'))}
                    autoComplete='address-line3'
                    placeholder={capitalize(t('continue street address and/or apartment number'))}
                    variant='outlined'
                    {...register('address.addressLine3')}
                />
            </FormControl>
            <FormControl>
                <TextField
                    label={capitalize(t('city or locality'))}
                    placeholder={capitalize(t('enter city, village or locality'))}
                    autoComplete='address-level2'
                    variant='outlined'
                    required
                    error={!!localityError}
                    helperText={!!localityError?.message && capitalize(localityError.message)}
                    {...register('address.locality')}
                />
            </FormControl>
            <FormControl>
                <TextField
                    label={capitalize(t('state or region'))}
                    autoComplete='address-level1'
                    placeholder={capitalize(t('enter state or region'))}
                    variant='outlined'
                    {...register('address.region')}
                />
            </FormControl>
            <FormControl>
                <TextField
                    label={capitalize(t('postal code'))}
                    placeholder={capitalize(t('enter postal/zip code'))}
                    autoComplete='postal-code'
                    variant='outlined'
                    required
                    error={!!postCodeError}
                    helperText={!!postCodeError?.message && capitalize(postCodeError.message)}
                    {...register('address.postcode')}
                />
            </FormControl>
        </>
    );
};

export default PartialAddressForm;
