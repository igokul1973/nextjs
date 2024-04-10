'use client';

import PartialAddressForm from '@/app/components/address/form/PartialAddressForm';
import { useI18n } from '@/locales/client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { capitalize } from '@mui/material/utils';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import NextLink from 'next/link';
import { FC } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';
import { IProps } from '../../customers/create-form/types';
import DateInput from '../../date-input/DateInput';
import { StyledForm } from './styled';

/*

  firstName             String               @map("first_name") @db.VarChar(255)
  lastName              String               @map("last_name") @db.VarChar(255)
  middleName            String?              @map("middle_name") @db.VarChar(255)
  localIdentifierNameId String?              @map("local_identifier_name_id") @db.Uuid
  localIdentifierName   localIdentifierName? @relation(fields: [localIdentifierNameId], references: [id], onDelete: Restrict)
  localIdentifierValue  String?              @map("local_identifier_value")
  dob                   DateTime?            @db.Date
  description           String?              @db.Text
  attributes            Json?                @db.JsonB
  addressId             String               @map("address_id") @db.Uuid
  address               address              @relation(fields: [addressId], references: [id])
  accountId             String               @map("account_id") @db.Uuid
  account               account              @relation(fields: [accountId], references: [id], onDelete: Cascade)
  accountRelation       AccountRelationEnum  @map("account_relation")
  customerId            String?              @unique @map("customer_id") @db.Uuid
  customer              customer?            @relation(fields: [customerId], references: [id], onDelete: Cascade)
  emails                individualEmail[]
  phones                individualPhone[]
*/

const IndividualForm: FC<IProps> = ({ countries, userAccountCountry }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control
    } = useForm();
    // const [state, formAction] = useFormState(createCustomer, initialState);
    const t = useI18n();

    const onSubmit = (formData: FieldValues) => {
        const FormSchema = z.object({
            id: z.string(),
            firstName: z.string({
                invalid_type_error: 'Please enter first name'
            }),
            lastName: z.string({
                invalid_type_error: 'Please enter last name'
            }),
            middleName: z.string().optional(),
            dob: z.coerce.date().optional(),
            addressLine1: z.string({
                invalid_type_error: 'Please enter the address'
            }),
            addressLine2: z.string().optional(),
            addressLine3: z.string().optional(),
            locality: z.string({
                invalid_type_error: 'Please enter city/village/locality'
            }),
            region: z.string({
                invalid_type_error: 'Please enter region/state'
            }),
            postalcode: z.string({
                invalid_type_error: 'Please enter zip/postal code'
            }),
            country: z.string({
                invalid_type_error: 'Please enter the country'
            })
        });
        const CreateCustomer = FormSchema.omit({ id: true });
        console.log('Form data: ', formData);
        const dateISOString = new Date().toISOString();
        formData.date = dateISOString;
        // Validate form using Zod
        const validatedForm = CreateCustomer.safeParse(formData);
        console.log('Validated form:', validatedForm);
        console.log('Errors:', errors);
        if (!validatedForm.success) {
            return {
                errors: validatedForm.error.flatten().fieldErrors,
                message: 'Missing fields, failed to create customer'
            };
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StyledForm onSubmit={handleSubmit(onSubmit)}>
                <FormControl>
                    <TextField
                        label={capitalize(t('first name'))}
                        placeholder={capitalize(t('first name'))}
                        variant='outlined'
                        required
                        {...register('firstName', { required: 'Please enter first name' })}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label={capitalize(t('last name'))}
                        variant='outlined'
                        placeholder={capitalize(t('last name'))}
                        required
                        {...register('lastName', { required: 'Please enter last name' })}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label={capitalize(t('middle name'))}
                        placeholder={capitalize(t('middle name'))}
                        variant='outlined'
                        {...register('middleName')}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label={capitalize(t('description'))}
                        placeholder={capitalize(t('description'))}
                        variant='outlined'
                        {...register('description')}
                    />
                </FormControl>
                <FormControl>
                    <DateInput
                        label={capitalize(t('dob'))}
                        name='dob'
                        control={control}
                        format='YYYY-MM-DD'
                    />
                </FormControl>
                <PartialAddressForm
                    register={register}
                    countries={countries}
                    userAccountCountry={userAccountCountry}
                    control={control}
                />
                <Box className='action-buttons'>
                    <Button
                        component={NextLink}
                        href='/dashboard/customers'
                        variant='outlined'
                        color='warning'
                    >
                        {capitalize(t('cancel'))}
                    </Button>
                    <Button type='submit' variant='contained' color='primary'>
                        {capitalize(t('create customer'))}
                    </Button>
                </Box>
            </StyledForm>
        </LocalizationProvider>
    );
};

export default IndividualForm;
