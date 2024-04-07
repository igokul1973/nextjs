'use client';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { FC } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';

interface IProps {
    register: UseFormRegister<FieldValues>;
}

const PartialAddressForm: FC<IProps> = ({ register }) => {
    return (
        <>
            <FormControl>
                <TextField
                    label='Street Address'
                    placeholder='Enter street address and building number'
                    variant='outlined'
                    required
                    {...register('addressLine1')}
                />
            </FormControl>
            <FormControl>
                <TextField
                    label='Address (line 2)'
                    placeholder='Continue street address and/or apartment number'
                    variant='outlined'
                    {...register('addressLine2')}
                />
            </FormControl>
            <FormControl>
                <TextField
                    label='Address (line 3)'
                    placeholder='Continue street address and/or apartment number'
                    variant='outlined'
                    {...register('addressLine3')}
                />
            </FormControl>
            <FormControl>
                <TextField
                    label='City or locality'
                    placeholder='Enter city, village or locality'
                    variant='outlined'
                    required
                    {...register('locality')}
                />
            </FormControl>
            <FormControl>
                <TextField
                    label='State or region'
                    placeholder='Enter state or region'
                    variant='outlined'
                    {...register('region')}
                />
            </FormControl>
            <FormControl>
                <TextField
                    label='Postal code'
                    placeholder='Enter postal/zip code'
                    variant='outlined'
                    {...register('postalcode')}
                />
            </FormControl>
        </>
    );
};

export default PartialAddressForm;
