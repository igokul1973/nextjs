'use client';

import {
    getEmailsInitial,
    getEmptyAttribute,
    getPhonesInitial
} from '@/app/[locale]/dashboard/customers/utils';
import PartialAddressForm from '@/app/components/address/form/PartialAddressForm';
import DateInput from '@/app/components/date-input/DateInput';
import PartialEmailForm from '@/app/components/emails/form/PartialEmailForm';
import PartialAttributeForm from '@/app/components/entity-attributes/partial-form/EntityAttributeForm';
import { useData } from '@/app/context/data/provider';
import { useSnackbar } from '@/app/context/snackbar/provider';
import { useUser } from '@/app/context/user/provider';
import { createIndividualCustomer, updateCustomer } from '@/app/lib/data/customer';
import { useI18n } from '@/locales/client';
import { TSingleTranslationKeys } from '@/locales/types';
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
import { useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';
import { Control, useFieldArray, useForm } from 'react-hook-form';
import { TEntityFormRegister } from '../../customers/types';
import PartialPhoneForm from '../../phones/form/PartialPhoneForm';
import { getDefaultFormValues } from '../utils';
import { individualCreateSchema, individualUpdateSchema } from './formSchema';
import { StyledForm } from './styled';
import { IProps, TIndividualForm, TIndividualFormControl, TIndividualFormOutput } from './types';

const IndividualForm: FC<IProps> = ({ userAccountCountry, localIdentifierName, form }) => {
    const t = useI18n();
    const { openSnackbar } = useSnackbar();
    const { countries } = useData();
    const { user, account } = useUser();
    const userId = user.id;
    const accountId = account.id;
    const { push } = useRouter();

    const {
        watch,
        register,
        handleSubmit,
        formState: { errors, isDirty, dirtyFields },
        control
    } = useForm<TIndividualForm, unknown, TIndividualFormOutput>({
        resolver: zodResolver(form ? individualUpdateSchema : individualCreateSchema),
        reValidateMode: 'onChange',
        defaultValues:
            form ||
            getDefaultFormValues(accountId, userId, userAccountCountry.id, localIdentifierName.id)
    });

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

    const w = watch();

    useEffect(() => {
        console.log('DirtyFields:', dirtyFields);
        console.log('Watch:', w);
        console.error('Errors:', errors);
    }, [errors, w, dirtyFields]);

    const onSubmit = async (formData: TIndividualFormOutput) => {
        try {
            if (formData.id) {
                await updateCustomer(formData, dirtyFields, userId);
                openSnackbar('Successfully updated customer.');
            } else {
                await createIndividualCustomer(formData);
                openSnackbar('Successfully created customer.');
            }
            push('/dashboard/customers');
        } catch (error) {
            openSnackbar(error as string, 'error');
        }
    };

    console.log('Form:', form);

    // const isSubmittable = anyTrue(dirtyFields);
    const isSubmittable = isDirty;

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
                            capitalize(t(errors.firstName?.message as TSingleTranslationKeys))
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
                            capitalize(t(errors.lastName?.message as TSingleTranslationKeys))
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
                        helperText={capitalize(t('enter the date of birth'))}
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
                        count={phones.length}
                        types={phoneTypes}
                        register={register as TEntityFormRegister}
                        control={control as TIndividualFormControl}
                        errors={errors}
                        remove={removePhone}
                    />
                ))}
                <Button onClick={() => appendPhone({ ...getPhonesInitial(userId)[0] })}>
                    {phones.length > 0
                        ? capitalize(t('add another phone'))
                        : capitalize(t('add phone'))}
                </Button>
                <Divider />
                {emails.map((email, index) => (
                    <PartialEmailForm<TIndividualForm>
                        key={email.id}
                        index={index}
                        count={emails.length}
                        types={emailTypes}
                        register={register as TEntityFormRegister}
                        control={control as TIndividualFormControl}
                        errors={errors}
                        remove={removeEmail}
                    />
                ))}
                <Button onClick={() => appendEmail({ ...getEmailsInitial(userId)[0] })}>
                    {emails.length > 0
                        ? capitalize(t('add another email address'))
                        : capitalize(t('add email address'))}
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
                <Button onClick={() => appendAttribute(getEmptyAttribute(userId))}>
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
                        {capitalize(t(form ? 'update customer' : 'create customer'))}
                    </Button>
                </Box>
            </StyledForm>
        </LocalizationProvider>
    );
};

export default IndividualForm;
