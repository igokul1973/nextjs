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
import { useScrollToFormError } from '@/app/lib/hooks/useScrollToFormError';
import { useI18n } from '@/locales/client';
import { TPluralTranslationKey, TSingleTranslationKey } from '@/locales/types';
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
import { FC, useState } from 'react';
import { Control, FieldError, FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { TEntityFormRegister } from '../../customers/types';
import FileInput from '../../file/FileInput';
import PartialPhoneForm from '../../phones/form/PartialPhoneForm';
import {
    individualCreateSchema,
    individualUpdateSchema,
    individualUpdateSchemaEmptyLogo
} from './formSchema';
import { StyledForm } from './styled';
import { IProps, TIndividualForm, TIndividualFormControl, TIndividualFormOutput } from './types';

const IndividualForm: FC<IProps> = ({ localIdentifierName, defaultValues, isEdit, isCustomer }) => {
    const t = useI18n();
    const { openSnackbar } = useSnackbar();
    const { countries } = useData();
    const {
        state: { user }
    } = useUser();
    const userId = user.id;
    const { push } = useRouter();

    // TODO: take care of this...
    console.log(isCustomer);

    const {
        watch,
        register,
        handleSubmit,
        formState: { errors, isDirty, dirtyFields, ...formState },
        control,
        ...methods
    } = useForm<TIndividualForm, unknown, TIndividualFormOutput>({
        resolver: zodResolver(
            isEdit
                ? defaultValues.logo
                    ? individualUpdateSchema
                    : individualUpdateSchemaEmptyLogo
                : individualCreateSchema
        ),
        reValidateMode: 'onChange',
        defaultValues
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

    // const w = watch();

    // useEffect(() => {
    //     console.log('DirtyFields:', dirtyFields);
    //     console.log('Watch:', w);
    //     console.error('Errors:', errors);
    // }, [errors, w, dirtyFields]);

    const [canFocus, setCanFocus] = useState(true);

    const onError = () => {
        setCanFocus(true);
    };

    useScrollToFormError(errors, canFocus, setCanFocus);

    const onSubmit = async (formData: TIndividualFormOutput) => {
        try {
            if (isEdit) {
                await updateCustomer(formData, dirtyFields, userId);
                openSnackbar('Successfully updated customer.');
            } else {
                await createIndividualCustomer(formData);
                openSnackbar('Successfully created customer.');
            }
            push('/dashboard/customers');
        } catch (error) {
            if (error instanceof Error) {
                openSnackbar(error.message, 'error');
            }
        }
    };

    const isSubmittable = isDirty;

    const logoError = errors.logo;
    const getLogoErrorMessage = (error: NonNullable<typeof logoError>) => {
        if ('message' in error) {
            return capitalize(t(error.message as TSingleTranslationKey));
        } else if ('id' in error && error.id) {
            return capitalize(t(error.id.message as TSingleTranslationKey));
        } else if ('name' in error && error.name) {
            return capitalize(t(error.name.message as TSingleTranslationKey));
        } else if ('size' in error && error.size) {
            return capitalize(t(error.size.message as TSingleTranslationKey));
        } else if ('type' in error && error.type) {
            return capitalize(t((error.type as FieldError).message as TSingleTranslationKey));
        } else if ('data' in error && error.data) {
            return capitalize(t(error.data.message as TPluralTranslationKey, { count: 200 }));
        } else {
            return '';
        }
    };

    return (
        <FormProvider
            control={control}
            watch={watch}
            register={register}
            handleSubmit={handleSubmit}
            formState={{ errors, dirtyFields, isDirty, ...formState }}
            {...methods}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StyledForm onSubmit={handleSubmit(onSubmit, onError)} noValidate>
                    <FileInput
                        inputName='logo'
                        label={capitalize(t('logo'))}
                        user={user}
                        maxFileSize={200}
                    />
                    <FormControl>
                        <TextField
                            label={capitalize(t('first name'))}
                            placeholder={capitalize(t('first name'))}
                            variant='outlined'
                            error={!!errors.firstName}
                            required
                            helperText={
                                !!errors.firstName &&
                                capitalize(t(errors.firstName?.message as TSingleTranslationKey))
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
                                capitalize(t(errors.lastName?.message as TSingleTranslationKey))
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
                            {capitalize(t(isEdit ? 'update customer' : 'create customer'))}
                        </Button>
                    </Box>
                </StyledForm>
            </LocalizationProvider>
        </FormProvider>
    );
};

export default IndividualForm;
