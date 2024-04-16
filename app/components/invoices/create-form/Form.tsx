'use client';

import AttachMoney from '@mui/icons-material/AttachMoney';
import Face from '@mui/icons-material/Face';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import TextField from '@mui/material/TextField';
import NextLink from 'next/link';

import { createInvoice } from '@/app/lib/data/invoice';
import { TFlattenedCustomer } from '@/app/lib/utils';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { InvoiceStatusEnum } from '@prisma/client';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { StyledForm } from './styled';

export default function Form({ customers }: { customers: TFlattenedCustomer[] }) {
    const [status, setStatus] = useState<InvoiceStatusEnum>(InvoiceStatusEnum.pending);
    const initialState = { message: null, errors: {}, touched: false };
    const [state, formAction] = useFormState(createInvoice, initialState);
    const [customerId, setCustomerId] = useState<string>();
    const [amount, setAmount] = useState<string>();

    const handleCustomerStatusChange = (event: SelectChangeEvent<HTMLInputElement>) => {
        setStatus(event.target.value as InvoiceStatusEnum);
    };

    return (
        <StyledForm action={formAction}>
            {/* Customer Name */}
            <FormControl fullWidth>
                <InputLabel id='customer'>Select a customer</InputLabel>
                <Select
                    labelId='customer'
                    id='customer-select'
                    name='customerId'
                    value={customerId}
                    label='Choose customer'
                    onChange={(event) => setCustomerId(event.target.value)}
                    inputProps={{
                        startAdornment: <Face />
                    }}
                >
                    {customers.map((customer) => (
                        <MenuItem key={customer.id} value={customer.id}>
                            {customer.name}
                        </MenuItem>
                    ))}
                </Select>
                <Face />
            </FormControl>

            {/* Invoice Amount */}
            <TextField
                label='Choose an amount'
                variant='outlined'
                placeholder={'Enter USD amount'}
                name='amount'
                value={amount}
                type='number'
                onChange={(e) => {
                    setAmount(e.target.value);
                }}
                inputProps={{ step: '0.01' }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position='start'>
                            <AttachMoney />
                        </InputAdornment>
                    )
                }}
            />

            {/* Invoice Status */}
            <Box component={'fieldset'} sx={{ borderRadius: 1, borderColor: 'divider' }}>
                <legend>Invoice status</legend>
                <FormControl>
                    <RadioGroup
                        aria-labelledby='invoice-status'
                        name='status'
                        value={status}
                        onChange={handleCustomerStatusChange}
                    >
                        <FormControlLabel
                            value={InvoiceStatusEnum.pending}
                            control={<Radio />}
                            label={capitalize(InvoiceStatusEnum.pending)}
                        />
                        <FormControlLabel
                            value={InvoiceStatusEnum.paid}
                            control={<Radio />}
                            label={capitalize(InvoiceStatusEnum.paid)}
                        />
                    </RadioGroup>
                </FormControl>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <Button component={NextLink} href='/dashboard/invoices' variant='outlined'>
                    Cancel
                </Button>
                <Button type='submit' disabled={!!state.errors?.customerId} variant='outlined'>
                    Create Invoice
                </Button>
            </Box>
        </StyledForm>
    );
}
