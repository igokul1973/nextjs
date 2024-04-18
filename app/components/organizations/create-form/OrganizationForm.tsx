'use client';

import {
    getEmailsInitial,
    getEmptyAttribute,
    getPhonesInitial
} from '@/app/[locale]/dashboard/customers/utils';
import PartialAddressForm from '@/app/components/address/form/PartialAddressForm';
import PartialAttributeForm from '@/app/components/entity-attributes/partial-form/EntityAttributeForm';
import { IProps, TOrganizationFormControl } from '@/app/components/organizations/create-form/types';
import PartialPhoneForm from '@/app/components/phones/partial-form/PartialPhoneForm';
import { useData } from '@/app/context/data/provider';
import { useSnackbar } from '@/app/context/snackbar/provider';
import { useUser } from '@/app/context/user/provider';
import { createCustomer } from '@/app/lib/data/customer';
import { useI18n } from '@/locales/client';
import { TTranslationKeys } from '@/locales/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Divider, MenuItem, capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { EmailTypeEnum, PhoneTypeEnum } from '@prisma/client';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { TEntityFormRegister } from '../../customers/types';
import PartialEmailForm from '../../emails/partial-form/PartialEmailForm';
import FormSelect from '../../form-select/FormSelect';
import { getDefaultFormValues } from '../utils';
import formSchema from './formSchema';
import { StyledForm } from './styled';
import { TOrganizationForm } from './types';

const OrganizationForm: FC<IProps> = ({ userAccountCountry, localIdentifierName, form }) => {
    const { countries, organizationTypes } = useData();
    const { user, account } = useUser();
    const userId = user.id;
    const { openSnackbar } = useSnackbar();
    const { push } = useRouter();

    const {
        // watch,
        register,
        handleSubmit,
        formState: { errors, isDirty },
        control
    } = useForm({
        resolver: zodResolver(formSchema.omit({ id: true })),
        reValidateMode: 'onBlur',
        defaultValues:
            form ||
            getDefaultFormValues(account.id, userId, userAccountCountry.id, localIdentifierName.id)
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

    const onSubmit = async (formData: TOrganizationForm) => {
        try {
            await createCustomer(formData);
            openSnackbar('Successfully created customer.');
            push('/dashboard/customers');
        } catch (error) {
            openSnackbar(`Failed to create customer: ${error}`, 'error');
        }
    };

    const isSubmittable = !!isDirty;

    return (
        <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormControl>
                <TextField
                    label={capitalize(t('organization name'))}
                    placeholder={capitalize(t('organization name'))}
                    variant='outlined'
                    required
                    error={!!errors.name}
                    helperText={
                        !!errors.name && capitalize(t(errors.name?.message as TTranslationKeys))
                    }
                    {...register('name')}
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
            <FormSelect
                fullWidth
                name='typeId'
                label={capitalize(t('organization type'))}
                control={control as TOrganizationFormControl}
            >
                {organizationTypes.map((type, index) => {
                    return (
                        <MenuItem key={index} value={type.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {capitalize(type.type)}
                            </Box>
                        </MenuItem>
                    );
                })}
            </FormSelect>
            <FormControl>
                <FormControlLabel
                    label={capitalize(t('is private'))}
                    control={
                        <Controller
                            name={'isPrivate'}
                            control={control}
                            defaultValue={false}
                            render={({ field: props }) => (
                                <Checkbox
                                    {...props}
                                    checked={!!props.value}
                                    onChange={(e) => props.onChange(e.target.checked)}
                                />
                            )}
                        />
                    }
                />
            </FormControl>
            <FormControl>
                <FormControlLabel
                    label={capitalize(t('is charity'))}
                    control={
                        <Controller
                            name={'isCharity'}
                            defaultValue={false}
                            control={control}
                            render={({ field: props }) => (
                                <Checkbox
                                    {...props}
                                    checked={!!props.value}
                                    onChange={(e) => props.onChange(e.target.checked)}
                                />
                            )}
                        />
                    }
                />
            </FormControl>
            <Divider />
            <PartialAddressForm<TOrganizationForm>
                countries={countries}
                register={register as TEntityFormRegister}
                control={control as TOrganizationFormControl}
                errors={errors}
            />
            <Divider />
            {phones.map((phone, index) => (
                <PartialPhoneForm<TOrganizationForm>
                    key={phone.id}
                    index={index}
                    types={phoneTypes}
                    register={register as TEntityFormRegister}
                    control={control as TOrganizationFormControl}
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
                <PartialEmailForm<TOrganizationForm>
                    key={email.id}
                    index={index}
                    types={emailTypes}
                    register={register as TEntityFormRegister}
                    control={control as TOrganizationFormControl}
                    errors={errors}
                    remove={removeEmail}
                />
            ))}
            <Button onClick={() => appendEmail({ ...getEmailsInitial(userId)[0] })}>
                {emails.length > 0
                    ? capitalize(t('add another email'))
                    : capitalize(t('add email'))}
            </Button>
            <Divider />
            {attributes.map((attribute, index) => (
                <PartialAttributeForm<TOrganizationForm>
                    key={attribute.id}
                    index={index}
                    register={register as TEntityFormRegister}
                    control={control as TOrganizationFormControl}
                    errors={errors}
                    remove={removeAttribute}
                />
            ))}
            <Button
                onClick={() => {
                    return appendAttribute(getEmptyAttribute(userId));
                }}
            >
                {attributes.length > 0
                    ? capitalize(t('add another attribute'))
                    : capitalize(t('add attribute'))}
            </Button>

            <Box className='action-buttons'>
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
            </Box>
        </StyledForm>
    );
};
export default OrganizationForm;
