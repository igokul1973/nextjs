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
import { useScrollToFormError } from '@/app/lib/hooks/useScrollToFormError';
import { TAppCountry, TAppLocalIdentifierName } from '@/app/lib/types';
import { getLocalIdentifierNameText } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import { Autocomplete, capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { EmailTypeEnum, EntitiesEnum, PhoneTypeEnum } from '@prisma/client';
import { FC, PropsWithChildren, useCallback, useState } from 'react';
import { Control, Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { TEntityFormRegister } from '../../customers/types';
import FileInput from '../../file/FileInput';
import PartialPhoneForm from '../../phones/form/PartialPhoneForm';
import { StyledForm } from './styled';
import {
    IProps,
    TCustomerIndForm,
    TCustomerIndFormOutput,
    TIndividualFormControl,
    TProviderIndForm
} from './types';

const IndividualForm: FC<IProps & PropsWithChildren> = ({
    user,
    providerLocalIdentifierName,
    isCustomer,
    onSubmit,
    children
}) => {
    const t = useI18n();
    const { countries } = useData();
    const userId = user.id;
    const {
        control,
        register,
        formState: { errors },
        setValue,
        handleSubmit
    } = useFormContext<TCustomerIndForm, null, TCustomerIndFormOutput>();

    // If user changes customer country, we need to update the local identifier name
    const [selectedCountryLocalIdentifierName, setSelectedCountryLocalIdentifierName] =
        useState<TAppLocalIdentifierName | null>(null);

    // TODO: For now it is not clear when and how to use the attributes,
    //  so I am turning them off until I figure it out
    const isShowAttributes = false;

    const phoneTypes = Object.values(PhoneTypeEnum);
    const emailTypes = Object.values(EmailTypeEnum);

    const countryIdError = errors.address?.countryId;

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

    const [canFocus, setCanFocus] = useState(true);

    const onError = () => {
        setCanFocus(true);
    };

    useScrollToFormError(errors, canFocus, setCanFocus);

    const onCountryChange = useCallback((country: TAppCountry | null) => {
        const selectedCountryLocalIdentifierName =
            country?.localIdentifierNames.find((lin) => lin.type === EntitiesEnum.individual) ??
            null;
        setSelectedCountryLocalIdentifierName(selectedCountryLocalIdentifierName);
        setValue(
            'localIdentifierNameId',
            selectedCountryLocalIdentifierName?.id ?? providerLocalIdentifierName.id
        );
    }, []);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StyledForm onSubmit={handleSubmit(onSubmit, onError)} noValidate>
                <FormControl fullWidth>
                    <Controller
                        name='address.countryId'
                        control={control}
                        render={({ field: { onChange, ref, value, ...field } }) => {
                            return (
                                <Autocomplete
                                    value={
                                        value
                                            ? countries.find((option) => option.id === value)
                                            : null
                                    }
                                    options={countries}
                                    getOptionLabel={(option) => option.name}
                                    onChange={(_, country) => {
                                        onCountryChange(country);
                                        onChange(country?.id);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            error={!!countryIdError}
                                            helperText={
                                                !!countryIdError?.message &&
                                                capitalize(countryIdError.message)
                                            }
                                            label={capitalize(t('country'))}
                                            placeholder={capitalize(t('select country'))}
                                            inputRef={ref}
                                        />
                                    )}
                                    {...field}
                                />
                            );
                        }}
                    />
                </FormControl>
                {!isCustomer && (
                    <FileInput inputName='logo' label={capitalize(t('logo'))} user={user} />
                )}
                {isCustomer && (
                    <FormControl>
                        <TextField
                            label={capitalize(t('customer number'))}
                            placeholder={capitalize(t('enter customer number'))}
                            variant='outlined'
                            error={!!errors.code}
                            helperText={!!errors.code?.message && capitalize(errors.code.message)}
                            {...register('code')}
                        />
                    </FormControl>
                )}
                <FormControl>
                    <TextField
                        label={capitalize(t('first name'))}
                        placeholder={capitalize(t('first name'))}
                        variant='outlined'
                        error={!!errors.firstName}
                        required
                        helperText={
                            !!errors.firstName?.message && capitalize(errors.firstName.message)
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
                            !!errors.lastName?.message && capitalize(errors.lastName.message)
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
                        label={capitalize(
                            getLocalIdentifierNameText(
                                selectedCountryLocalIdentifierName,
                                providerLocalIdentifierName
                            )
                        )}
                        placeholder={`${capitalize(t('add'))} ${getLocalIdentifierNameText(
                            selectedCountryLocalIdentifierName,
                            providerLocalIdentifierName
                        )}`}
                        variant='outlined'
                        {...register('localIdentifierValue')}
                    />
                </FormControl>
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
                        helperText={capitalize(t('enter the date of birth'))}
                    />
                </FormControl>
                <Divider />
                <Box component={'h5'} sx={{ margin: 0 }}>
                    {capitalize(t('address'))}:
                </Box>
                <PartialAddressForm<TProviderIndForm>
                    countries={countries}
                    register={register as TEntityFormRegister}
                    control={control as TIndividualFormControl}
                    errors={errors}
                />
                <Divider />
                <Box component='h5' sx={{ margin: 0 }}>
                    {capitalize(t('phones'))}:
                </Box>
                {phones.map((phone, index) => (
                    <PartialPhoneForm<TProviderIndForm>
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
                <Box component={'h5'} sx={{ margin: 0 }}>
                    {capitalize(t('email addresses'))}:
                </Box>
                {emails.map((email, index) => (
                    <PartialEmailForm<TProviderIndForm>
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
                {isShowAttributes && (
                    <>
                        <Divider />
                        <Box component={'h5'} sx={{ margin: 0 }}>
                            {capitalize(t('additional attributes'))}:
                        </Box>
                    </>
                )}
                {isShowAttributes &&
                    (attributes.length ? (
                        attributes.map((attribute, index) => (
                            <PartialAttributeForm<TProviderIndForm>
                                key={attribute.id}
                                index={index}
                                register={register as TEntityFormRegister}
                                control={control as TIndividualFormControl}
                                errors={errors}
                                remove={removeAttribute}
                            />
                        ))
                    ) : (
                        <Box>
                            {capitalize(
                                t('you have no attributes. Add one by clicking button below.')
                            )}
                        </Box>
                    ))}
                {isShowAttributes && (
                    <Button onClick={() => appendAttribute(getEmptyAttribute(userId))}>
                        {attributes.length > 0
                            ? capitalize(t('add another attribute'))
                            : capitalize(t('add attribute'))}
                    </Button>
                )}
                {/* The chilren should contain action buttons */}
                {children}
            </StyledForm>
        </LocalizationProvider>
    );
};

export default IndividualForm;
