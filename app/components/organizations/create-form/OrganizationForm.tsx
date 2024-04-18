'use client';

import PartialAddressForm from '@/app/components/address/form/PartialAddressForm';
import PartialAttributeForm from '@/app/components/entity-attributes/partial-form/EntityAttributeForm';
import { AttributeTypeEnum } from '@/app/components/entity-attributes/partial-form/types';
import { IProps, TOrganizationFormControl } from '@/app/components/organizations/create-form/types';
import PartialPhoneForm from '@/app/components/phones/partial-form/PartialPhoneForm';
import { useData } from '@/app/context/data/provider';
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
import { AccountRelationEnum, EmailTypeEnum, PhoneTypeEnum } from '@prisma/client';
import NextLink from 'next/link';
import { FC } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { TEntityFormRegister } from '../../customers/types';
import PartialEmailForm from '../../emails/partial-form/PartialEmailForm';
import FormSelect from '../../form-select/FormSelect';
import formSchema from './formSchema';
import { StyledForm } from './styled';
import { TAttribute, TEmail, TOrganizationForm, TPhone } from './types';
import { useUser } from '@/app/context/user/provider';

const OrganizationForm: FC<IProps> = ({ userAccountCountry, localIdentifierName }) => {
    const { countries, organizationTypes } = useData();
    const { user, account } = useUser();
    const userId = user.id;
    const phonesInitial = [
        {
            countryCode: '',
            number: '',
            type: PhoneTypeEnum.mobile,
            createdBy: userId,
            updatedBy: userId
        } as unknown as TPhone
    ];
    const emailsInitial = [
        {
            email: '',
            type: EmailTypeEnum.main,
            createdBy: userId,
            updatedBy: userId
        } as unknown as TEmail
    ];
    const attributesInitial: TAttribute[] = [];
    const emptyAttribute = {
        type: AttributeTypeEnum.text,
        name: '',
        value: '',
        createdBy: userId,
        updatedBy: userId
    };

    const defaultFormValues: TOrganizationForm = {
        id: '',
        accountRelation: AccountRelationEnum.customer,
        accountId: account.id,
        name: '',
        localIdentifierNameId: localIdentifierName?.id,
        localIdentifierValue: '',
        typeId: '',
        description: '',
        isPrivate: false,
        isCharity: false,
        address: {
            addressLine1: '',
            addressLine2: '',
            locality: '',
            region: '',
            postcode: '',
            countryId: userAccountCountry.id,
            createdBy: userId,
            updatedBy: userId
        },
        phones: phonesInitial,
        emails: emailsInitial,
        attributes: attributesInitial,
        createdBy: userId,
        updatedBy: userId
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

    const onSubmit = async (formData: TOrganizationForm) => {
        // TODO: catch database errors and display them
        await createCustomer(formData);
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
                                    checked={props.value}
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
                                    checked={props.value}
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
            <Button onClick={() => appendPhone({ ...phonesInitial[0] })}>
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
            <Button onClick={() => appendEmail({ ...emailsInitial[0] })}>
                {emails.length > 0
                    ? capitalize(t('add another phone'))
                    : capitalize(t('add phone'))}
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
            <Button onClick={() => appendAttribute(emptyAttribute)}>
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