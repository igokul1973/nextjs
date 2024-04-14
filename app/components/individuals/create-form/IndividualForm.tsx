'use client';

import PartialEmailForm from '@/app/components/emails/partial-form/PartialEmailForm';
import { useI18n } from '@/locales/client';
import { TTranslationKeys } from '@/locales/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { EmailTypeEnum, PhoneTypeEnum } from '@prisma/client';
import NextLink from 'next/link';
import { FC } from 'react';
import { Control, useFieldArray, useForm } from 'react-hook-form';
import PartialAddressForm from '../../address/form/PartialAddressForm';
import { IProps } from '../../customers/create-form/types';
import DateInput from '../../date-input/DateInput';
import PartialPhoneForm from '../../phones/partial-form/PartialPhoneForm';
import FormSchema from './formSchema';
import { StyledForm } from './styled';
import { TEmail, TForm, TIndividualFormControl, TPhone } from './types';

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

const phonesInitial = [
    { countryCode: '', number: '', type: PhoneTypeEnum.mobile } as unknown as TPhone
];
const emailsInitial = [{ email: '', type: EmailTypeEnum.main } as unknown as TEmail];

const IndividualForm: FC<IProps> = ({ countries, userAccountCountry }) => {
    const defaultFormValues: TForm = {
        id: '',
        firstName: '',
        lastName: '',
        dob: null,
        description: '',
        address: {
            addressLine1: '',
            addressLine2: '',
            locality: '',
            region: '',
            postcode: '',
            countryId: userAccountCountry.id
        },
        phones: phonesInitial,
        emails: emailsInitial
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty, isValid, validatingFields },
        control
    } = useForm({
        resolver: zodResolver(FormSchema.omit({ id: true })),
        reValidateMode: 'onBlur',
        defaultValues: defaultFormValues
    });

    const t = useI18n();
    const phoneTypes = Object.values(PhoneTypeEnum);
    const emailTypes = Object.values(EmailTypeEnum);

    const {
        fields: phones,
        append: appendPhone,
        remove: removePhone
    } = useFieldArray({
        name: 'phones',
        control
    });

    const {
        fields: emails,
        append: appendEmail,
        remove: removeEmail
    } = useFieldArray({
        name: 'emails',
        control
    });

    // const useFormValues = () => {
    //     const { getValues } = useFormContext();
    //     return {
    //         ...useWatch(), // subscribe to form value updates
    //         ...getValues() // always merge with latest form values
    //     };
    // };

    // useEffect(() => {
    //     const formData = getValues();
    //     console.log('FormData:', formData);
    //     console.log('Form Data Errors:', errors);
    //     // console.log('Is dirty:', isDirty);
    //     console.log('Is valid:', isValid);
    //     const CreateCustomer = FormSchema.omit({ id: true });
    //     // console.log('Form data: ', formData);
    //     // const dateISOString = new Date().toISOString();
    //     // formData.date = dateISOString;
    //     // Validate form using Zod
    //     const validatedForm = CreateCustomer.safeParse(formData);
    //     if (!validatedForm.success) {
    //         console.log('Validated form errors: ', validatedForm.error.flatten().fieldErrors);
    //     }
    //     if (validatedForm.success) {
    //         console.log('Validated form: ', validatedForm.data);
    //     }
    //     // console.log('Validated form:', validatedForm);
    //     // console.log('Errors:', errors);
    // }, [errors, getValues, isValid, validatingFields]);

    const onSubmit = (formData: TForm) => {
        const CreateCustomer = FormSchema.omit({ id: true });
        // Validate form using Zod
        const validatedForm = CreateCustomer.safeParse(formData);
        if (validatedForm.success) {
            const formData = validatedForm.data;
            console.log('Validated form: ', formData);
        }
    };

    const isSubmittable = !!isDirty;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormControl>
                    <TextField
                        label={capitalize(t('first name'))}
                        placeholder={capitalize(t('first name'))}
                        variant='outlined'
                        error={!!errors.firstName}
                        required
                        helperText={
                            !!errors.firstName &&
                            capitalize(t(errors.firstName?.message as TTranslationKeys))
                        }
                        {...register('firstName')}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label={capitalize(t('last name'))}
                        variant='outlined'
                        placeholder={capitalize(t('last name'))}
                        required
                        error={!!errors.lastName}
                        helperText={
                            !!errors.lastName &&
                            capitalize(t(errors.lastName?.message as TTranslationKeys))
                        }
                        {...register('lastName')}
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
                        label={capitalize(t('date of birth'))}
                        name='dob'
                        control={control as unknown as Control}
                        format='YYYY-MM-DD'
                        helperText={capitalize(t('Enter the date of birth'))}
                    />
                </FormControl>
                <Divider />
                <PartialAddressForm
                    register={register}
                    countries={countries}
                    control={control as TIndividualFormControl}
                    errors={errors}
                />
                <Divider />
                {phones.map((phone, index) => (
                    <PartialPhoneForm
                        key={phone.id}
                        index={index}
                        register={register}
                        control={control as TIndividualFormControl}
                        types={phoneTypes}
                        errors={errors}
                        remove={removePhone}
                    />
                ))}
                <Button onClick={() => appendPhone({ ...phonesInitial[0] })}>
                    Add another phone
                </Button>
                <Divider />
                {emails.map((email, index) => (
                    <PartialEmailForm
                        key={email.id}
                        index={index}
                        register={register}
                        control={control as TIndividualFormControl}
                        types={emailTypes}
                        errors={errors}
                        remove={removeEmail}
                    />
                ))}
                <Button onClick={() => appendEmail({ ...emailsInitial[0] })}>
                    Add another email
                </Button>
                <Box className='action-buttons'>
                    <Button
                        component={NextLink}
                        href='/dashboard/customers'
                        variant='outlined'
                        color='warning'
                    >
                        {capitalize(t('cancel'))}
                    </Button>
                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        disabled={!isSubmittable}
                    >
                        {capitalize(t('create customer'))}
                    </Button>
                </Box>
            </StyledForm>
        </LocalizationProvider>
    );
};

export default IndividualForm;
