'use client';
import PartialAddressForm from '@/app/components/address/form/PartialAddressForm';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import NextLink from 'next/link';
import { FC } from 'react';
import { Control, Controller, FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';
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

interface IProps {
    name: string;
    label: string;
    control: Control;
}
const DateInput: FC<IProps> = ({ name, label, control }) => {
    const placeholder = 'Enter the date of birth';

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange }, fieldState: { error } }) => (
                <DatePicker
                    label={label}
                    format='YYYY-MM-DD'
                    onChange={(event) => {
                        onChange(event);
                    }}
                    slotProps={{
                        textField: {
                            placeholder,
                            error: !!error,
                            helperText: error?.message
                        }
                    }}
                />
            )}
        />
    );
};

export default function IndividualForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control
    } = useForm();
    // const [state, formAction] = useFormState(createCustomer, initialState);

    const onSubmit = (formData: FieldValues) => {
        const FormSchema = z.object({
            id: z.string(),
            firstName: z.string({
                invalid_type_error: 'Please enter first name'
            }),
            lastName: z.string({
                invalid_type_error: 'Please enter first name'
            }),
            middleName: z
                .string({
                    invalid_type_error: 'Please enter first name'
                })
                .optional(),
            dob: z.coerce.date().optional(),
            addressLine1: z.string({
                invalid_type_error: 'Please enter first name'
            }),
            addressLine2: z
                .string({
                    invalid_type_error: 'Please enter first name'
                })
                .optional(),
            addressLine3: z
                .string({
                    invalid_type_error: 'Please enter first name'
                })
                .optional(),
            locality: z.string({
                invalid_type_error: 'Please enter city/village/locality'
            }),
            region: z.string({
                invalid_type_error: 'Please enter region/state'
            }),
            postalcode: z.string({
                invalid_type_error: 'Please enter zip/postal code'
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
                        label='First name'
                        placeholder='First name'
                        variant='outlined'
                        required
                        {...register('firstName')}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label='Last name'
                        variant='outlined'
                        placeholder='Last name'
                        required
                        {...register('lastName')}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label='Middle name'
                        placeholder='Middle name'
                        variant='outlined'
                        {...register('middleName')}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label='Description'
                        placeholder='Description'
                        variant='outlined'
                        {...register('description')}
                    />
                </FormControl>
                <FormControl>
                    <DateInput label='Date of birth' name='dob' control={control} />
                </FormControl>
                <PartialAddressForm register={register} />
                <Box className='action-buttons'>
                    <Button
                        component={NextLink}
                        href='/dashboard/customers'
                        variant='outlined'
                        color='warning'
                    >
                        Cancel
                    </Button>
                    <Button type='submit' variant='contained' color='primary'>
                        Create Customer
                    </Button>
                </Box>
            </StyledForm>
        </LocalizationProvider>
    );
}
