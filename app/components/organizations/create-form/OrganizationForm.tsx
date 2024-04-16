'use client';

import PartialAddressForm from '@/app/components/address/form/PartialAddressForm';
import { ICustomerFormProps } from '@/app/components/customers/create-form/types';
import PartialAttributeForm from '@/app/components/entity-attributes/partial-form/EntityAttributeForm';
import { AttributeTypeEnum } from '@/app/components/entity-attributes/partial-form/types';
import { TOrganizationFormControl } from '@/app/components/organizations/create-form/types';
import PartialPhoneForm from '@/app/components/phones/partial-form/PartialPhoneForm';
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
import { EmailTypeEnum, EntitiesEnum, PhoneTypeEnum } from '@prisma/client';
import NextLink from 'next/link';
import { FC } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { TEntityFormRegister } from '../../customers/types';
import PartialEmailForm from '../../emails/partial-form/PartialEmailForm';
import FormSelect from '../../form-select/FormSelect';
import formSchema from './formSchema';
import { StyledForm } from './styled';
import { TAttribute, TEmail, TOrganizationForm, TPhone } from './types';

//   id                    String               @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
//   name                  String               @db.VarChar(255)
//   description           String               @db.Text
//   typeId                String               @map("type_id") @db.Uuid
//   type                  organizationType     @relation(fields: [typeId], references: [id])
//   isPrivate             Boolean?             @map("is_private") @db.Boolean // as opposed to government
//   isCharity             Boolean?             @map("is_charity") @db.Boolean //
//   localIdentifierNameId String?              @map("local_identifier_name_id") @db.Uuid
//   localIdentifierName   localIdentifierName? @relation(fields: [localIdentifierNameId], references: [id], onDelete: Restrict)
//   localIdentifierValue  String?              @map("local_identifier_value")
//   attributes            Json?                @db.JsonB
//   addressId             String               @map("address_id") @db.Uuid
//   address               address              @relation(fields: [addressId], references: [id])
//   accountId             String               @map("account_id") @db.Uuid
//   account               account              @relation(fields: [accountId], references: [id], onDelete: Cascade)
//   accountRelation       AccountRelationEnum  @map("account_relation")
//   customerId            String?              @unique @map("customer_id") @db.Uuid
//   customer              customer?            @relation(fields: [customerId], references: [id], onDelete: Cascade)
//   emails                organizationEmail[]
//   phones                organizationPhone[]
//   createdAt             DateTime             @default(now()) @map("created_at") @db.Timestamptz(3)
//   updatedAt             DateTime             @updatedAt @map("updated_at") @db.Timestamptz(3)
//   createdBy             String               @map("created_by") @db.Uuid
//   updatedBy             String               @map("updated_by") @db.Uuid

const OrganizationForm: FC<ICustomerFormProps> = ({
    countries,
    userAccountCountry,
    localIdentifierNames,
    organizationTypes
}) => {
    const phonesInitial = [
        { countryCode: '', number: '', type: PhoneTypeEnum.mobile } as unknown as TPhone
    ];
    const emailsInitial = [{ email: '', type: EmailTypeEnum.main } as unknown as TEmail];
    const attributesInitial: TAttribute[] = [];
    const emptyAttribute = { type: AttributeTypeEnum.text, name: '', value: '' };
    const localIdentifierName = localIdentifierNames.find(
        (name) => name.type === EntitiesEnum.organization
    );

    const defaultFormValues: TOrganizationForm = {
        id: '',
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

    const onSubmit = (formData: TOrganizationForm) => {
        console.log('The form data: ', formData);
        const newCustomer = createCustomer(formData, EntitiesEnum.organization);
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
