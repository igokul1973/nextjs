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

import { createInvoice } from '@/app/lib/data/invoices';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { InvoiceStatusEnum } from '@prisma/client';
import { ChangeEvent, useState } from 'react';
import { useFormState } from 'react-dom';
import styles from './create-form.module.scss';

export default function Form({ customers }: { customers: TGetCustomersPayload[] }) {
    const [touched, setTouched] = useState(false);
    const [status, setStatus] = useState(InvoiceStatusEnum.pending);
    const initialState = { message: null, errors: {}, touched: false };
    const [state, formAction] = useFormState(createInvoice, initialState);
    const [customerId, setCustomerId] = useState<string>();
    const [amount, setAmount] = useState<string>();

    const handleCustomerStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
        setStatus((event.target as HTMLInputElement).value);
    };

    return (
        <form action={formAction} className={styles.form}>
            {/* Customer Name */}
            <FormControl fullWidth>
                <InputLabel id='customer'>Select a customer</InputLabel>
                <Select
                    labelId='customer'
                    id='customer-select'
                    name='customeId'
                    value={customerId}
                    label='Choose customer'
                    onChange={(event: SelectChangeEvent) => setCustomerId(event.target.value)}
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
            {/* <div>
                    <label htmlFor='amount'>Choose an amount</label>
                    <div>
                        <div>
                            <input
                                id='amount'
                                name='amount'
                                type='text'
                                step='0.01'
                                placeholder='Enter USD amount'
                            />
                            <AttachMoney />
                        </div>
                    </div>
                </div> */}

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
                <Button
                    type='submit'
                    disabled={!touched || !!state.errors?.customerId}
                    variant='outlined'
                >
                    Create Invoice
                </Button>
            </Box>
        </form>
    );
}
