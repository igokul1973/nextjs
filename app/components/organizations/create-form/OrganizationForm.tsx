'use client';

import { createCustomer } from '@/app/lib/data/customers';
import { TCountry } from '@/app/lib/types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import NextLink from 'next/link';
import { useFormState } from 'react-dom';
import { StyledForm } from './styled';
import { FC } from 'react';
import { IProps } from './types';

const OrganizationForm: FC<IProps> = ({ countries }) => {
    const initialState = { message: null, errors: {}, touched: false };
    const [state, formAction] = useFormState(createCustomer, initialState);
    return (
        <StyledForm action={formAction}>
            <FormControl fullWidth>
                <TextField fullWidth label='Name' variant='outlined' placeholder='Name' />
            </FormControl>
            <Box className='action-buttons'>
                <Button
                    component={NextLink}
                    href='/dashboard/customers'
                    variant='outlined'
                    color='warning'
                >
                    Cancel
                </Button>
                <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    disabled={!!state.errors?.customerId}
                >
                    Create Customer
                </Button>
            </Box>
        </StyledForm>
    );
};
export default OrganizationForm;
