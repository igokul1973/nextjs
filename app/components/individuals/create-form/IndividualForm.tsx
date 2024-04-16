'use client';

import PartialAddressForm from '@/app/components/address/form/PartialAddressForm';
import { ICustomerFormProps } from '@/app/components/customers/create-form/types';
import DateInput from '@/app/components/date-input/DateInput';
import PartialEmailForm from '@/app/components/emails/partial-form/PartialEmailForm';
import PartialAttributeForm from '@/app/components/entity-attributes/partial-form/EntityAttributeForm';
import { AttributeTypeEnum } from '@/app/components/entity-attributes/partial-form/types';
import { createCustomer } from '@/app/lib/data/customer';
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
import { EmailTypeEnum, EntitiesEnum, PhoneTypeEnum } from '@prisma/client';
import NextLink from 'next/link';
import { FC } from 'react';
import { Control, useFieldArray, useForm } from 'react-hook-form';
import { TEntityFormRegister } from '../../customers/types';
import PartialPhoneForm from '../../phones/partial-form/PartialPhoneForm';
import formSchema from './formSchema';
import { StyledForm } from './styled';
import { TAttribute, TEmail, TIndividualForm, TIndividualFormControl, TPhone } from './types';

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

const IndividualForm: FC<Omit<ICustomerFormProps, 'organizationTypes'>> = ({
    countries,
    userAccountCountry,
    localIdentifierNames
}) => {
    const phonesInitial = [
        { countryCode: '', number: '', type: PhoneTypeEnum.mobile } as unknown as TPhone
    ];
    const emailsInitial = [{ email: '', type: EmailTypeEnum.main } as unknown as TEmail];
    const attributesInitial: TAttribute[] = [];
    const emptyAttribute = { type: AttributeTypeEnum.text, name: '', value: '' };
    const localIdentifierName = localIdentifierNames.find(
        (name) => name.type === EntitiesEnum.individual
    );

    const defaultFormValues: TIndividualForm = {
        id: '',
        firstName: '',
        lastName: '',
        localIdentifierNameId: localIdentifierName?.id,
        localIdentifierValue: '',
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
        emails: emailsInitial,
        attributes: attributesInitial
    };

    const {
        // watch,
        register,
        handleSubmit,
        formState: { errors, isDirty },
        control
    } = useForm({
        resolver: zodResolver(formSchema.omit({ id: true })),
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

    const {
        fields: attributes,
        append: appendAttribute,
        remove: removeAttribute
    } = useFieldArray({
        name: 'attributes',
        control
    });

    // const w = watch();

    // useEffect(() => {
    //     console.log('Watch:', w);
    //     console.error('Errors:', errors);
    // }, [errors, w]);

    const onSubmit = (formData: TIndividualForm) => {
        console.log('The form data: ', formData);
        const newCustomer = createCustomer(formData, EntitiesEnum.individual);
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
                {localIdentifierName && (
                    <FormControl>
                        <TextField
                            label={capitalize(
                                localIdentifierName.abbreviation || localIdentifierName.name
                            )}
                            placeholder={`${capitalize(t('add'))} ${localIdentifierName.name}`}
                            variant='outlined'
                            {...register('localIdentifierValue')}
                        />
                    </FormControl>
                )}
                <FormControl>
                    <TextField
                        multiline
                        minRows={2}
                        maxRows={5}
                        label={capitalize(t('description'))}
                        variant='outlined'
                        placeholder={capitalize(t('description'))}
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
                <PartialAddressForm<TIndividualForm>
                    countries={countries}
                    register={register as TEntityFormRegister}
                    control={control as TIndividualFormControl}
                    errors={errors}
                />
                <Divider />
                {phones.map((phone, index) => (
                    <PartialPhoneForm<TIndividualForm>
                        key={phone.id}
                        index={index}
                        types={phoneTypes}
                        register={register as TEntityFormRegister}
                        control={control as TIndividualFormControl}
                        errors={errors}
                        remove={removePhone}
                    />
                ))}
                <Button onClick={() => appendPhone({ ...phonesInitial[0] })}>
                    {phones.length > 0
                        ? capitalize(t('add another phone'))
                        : capitalize(t('add phone'))}
                </Button>
                <Divider />
                {emails.map((email, index) => (
                    <PartialEmailForm<TIndividualForm>
                        key={email.id}
                        index={index}
                        types={emailTypes}
                        register={register as TEntityFormRegister}
                        control={control as TIndividualFormControl}
                        errors={errors}
                        remove={removeEmail}
                    />
                ))}
                <Button onClick={() => appendEmail({ ...emailsInitial[0] })}>
                    {emails.length > 0
                        ? capitalize(t('add another phone'))
                        : capitalize(t('add phone'))}
                </Button>
                <Divider />
                {attributes.map((attribute, index) => (
                    <PartialAttributeForm<TIndividualForm>
                        key={attribute.id}
                        index={index}
                        register={register as TEntityFormRegister}
                        control={control as TIndividualFormControl}
                        errors={errors}
                        remove={removeAttribute}
                    />
                ))}
                <Button onClick={() => appendAttribute(emptyAttribute)}>
                    {attributes.length > 0
                        ? capitalize(t('add another attribute'))
                        : capitalize(t('add attribute'))}
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
