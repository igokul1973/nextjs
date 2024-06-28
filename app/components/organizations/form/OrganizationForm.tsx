'use client';

import {
    getEmailsInitial,
    getEmptyAttribute,
    getPhonesInitial
} from '@/app/[locale]/dashboard/customers/utils';
import PartialAddressForm from '@/app/components/address/form/PartialAddressForm';
import PartialEmailForm from '@/app/components/emails/form/PartialEmailForm';
import PartialAttributeForm from '@/app/components/entity-attributes/partial-form/EntityAttributeForm';
import FileInput from '@/app/components/file/FileInput';
import FormSelect from '@/app/components/form-select/FormSelect';
import {
    IProps,
    TCustomerOrgForm,
    TCustomerOrgFormOutput,
    TOrganizationFormControl
} from '@/app/components/organizations/form/types';
import PartialPhoneForm from '@/app/components/phones/form/PartialPhoneForm';
import { useData } from '@/app/context/data/provider';
import { useScrollToFormError } from '@/app/lib/hooks/useScrollToFormError';
import { useI18n } from '@/locales/client';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { EmailTypeEnum, PhoneTypeEnum } from '@prisma/client';
import { FC, PropsWithChildren, useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { TEntityFormRegister } from '../../customers/types';
import { StyledForm } from './styled';
import { TProviderOrgForm } from './types';

const OrganizationForm: FC<IProps & PropsWithChildren> = ({
    user,
    localIdentifierName,
    isEdit,
    isCustomer,
    onSubmit,
    children
}) => {
    const t = useI18n();
    const { countries, organizationTypes } = useData();
    const userId = user.id;
    const {
        control,
        register,
        formState: { errors },
        handleSubmit
    } = useFormContext<TCustomerOrgForm, null, TCustomerOrgFormOutput>();

    // TODO: For now it is not clear when and how to use the attributes,
    //  so I am turning them off until I figure it out
    const isShowAttributes = false;

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

    const [canFocus, setCanFocus] = useState(true);

    const onError = () => {
        setCanFocus(true);
    };

    useScrollToFormError(errors, canFocus, setCanFocus);

    return (
        <StyledForm onSubmit={handleSubmit(onSubmit, onError)} noValidate>
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
                    label={capitalize(t('organization name'))}
                    placeholder={capitalize(t('organization name'))}
                    variant='outlined'
                    required
                    error={!!errors.name}
                    helperText={!!errors.name?.message && capitalize(errors.name.message)}
                    {...register('name')}
                />
            </FormControl>
            {localIdentifierName && (
                <FormControl>
                    <TextField
                        label={capitalize(
                            localIdentifierName.abbreviation ?? localIdentifierName.name
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
                {organizationTypes.map((type) => {
                    return (
                        <MenuItem key={type.id} value={type.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {capitalize(type.type)}
                            </Box>
                        </MenuItem>
                    );
                })}
            </FormSelect>
            <FormControl fullWidth={false}>
                <Tooltip
                    title={capitalize(
                        t('check the box if your company is not owned by government')
                    )}
                >
                    <FormControlLabel
                        sx={{ alignSelf: 'flex-start' }}
                        label={capitalize(t('is private'))}
                        control={
                            <Controller
                                name='isPrivate'
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
                </Tooltip>
            </FormControl>
            <FormControl>
                <Tooltip title={capitalize(t('check the box if your company is a charity'))}>
                    <FormControlLabel
                        sx={{ alignSelf: 'flex-start' }}
                        label={capitalize(t('is charity'))}
                        control={
                            <Controller
                                name='isCharity'
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
                </Tooltip>
            </FormControl>
            <Divider />
            <Box component={'h5'} sx={{ margin: 0 }}>
                {capitalize(t('address'))}:
            </Box>
            <PartialAddressForm<TProviderOrgForm>
                countries={countries}
                register={register as TEntityFormRegister}
                control={control as TOrganizationFormControl}
                errors={errors}
            />
            <Divider />
            <Box component='h5' sx={{ margin: 0 }}>
                {capitalize(t('phones'))}:
            </Box>
            {phones.map((phone, index) => (
                <PartialPhoneForm<TProviderOrgForm>
                    key={phone.id}
                    index={index}
                    types={phoneTypes}
                    count={phones.length}
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
            <Box component={'h5'} sx={{ margin: 0 }}>
                {capitalize(t('email addresses'))}:
            </Box>
            {emails.map((email, index) => (
                <PartialEmailForm<TProviderOrgForm>
                    key={email.id}
                    index={index}
                    types={emailTypes}
                    count={emails.length}
                    register={register as TEntityFormRegister}
                    control={control as TOrganizationFormControl}
                    errors={errors}
                    remove={removeEmail}
                />
            ))}
            <Button onClick={() => appendEmail({ ...getEmailsInitial(userId)[0] })}>
                {emails.length > 0
                    ? capitalize(t('add another email address'))
                    : capitalize(t('add email address'))}
            </Button>

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
                        <PartialAttributeForm<TProviderOrgForm>
                            key={attribute.id}
                            index={index}
                            register={register as TEntityFormRegister}
                            control={control as TOrganizationFormControl}
                            errors={errors}
                            remove={removeAttribute}
                        />
                    ))
                ) : (
                    <Box>
                        {capitalize(t('you have no attributes. Add one by clicking button below.'))}
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
    );
};
export default OrganizationForm;
