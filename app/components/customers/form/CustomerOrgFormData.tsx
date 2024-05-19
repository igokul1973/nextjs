'use client';

import OrganizationForm from '@/app/components/organizations/form/OrganizationForm';
import {
    organizationCreateSchema,
    organizationUpdateSchema,
    organizationUpdateSchemaEmptyLogo
} from '@/app/components/organizations/form/formSchema';
import {
    TOrganizationForm,
    TOrganizationFormOutput
} from '@/app/components/organizations/form/types';
import { useSnackbar } from '@/app/context/snackbar/provider';
import { useUser } from '@/app/context/user/provider';
import { createOrganizationCustomer, updateOrganizationCustomer } from '@/app/lib/data/customer';
import { useI18n } from '@/locales/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, capitalize } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ICustomerOrgFormDataProps } from './types';

const CustomerOrgFormData: FC<ICustomerOrgFormDataProps> = ({
    localIdentifierName,
    rawDefaultValues,
    isEdit
}) => {
    const t = useI18n();
    const {
        state: { user }
    } = useUser();
    const userId = user.id;
    const { openSnackbar } = useSnackbar();
    const { push } = useRouter();

    const logoFile = !rawDefaultValues.logo
        ? null
        : new File([rawDefaultValues.logo.data], rawDefaultValues.logo.name, {
              type: rawDefaultValues.logo.type
          });

    const defaultValues = {
        ...rawDefaultValues,
        logo:
            rawDefaultValues.logo === null || logoFile === null
                ? null
                : { ...rawDefaultValues.logo, data: logoFile }
    };

    const {
        watch,
        formState: { errors, dirtyFields, ...formState },
        ...methods
    } = useForm<TOrganizationForm, unknown, TOrganizationFormOutput>({
        resolver: zodResolver(
            isEdit
                ? defaultValues.logo
                    ? organizationUpdateSchema
                    : organizationUpdateSchemaEmptyLogo
                : organizationCreateSchema
        ),
        reValidateMode: 'onChange',
        defaultValues
    });

    // const w = watch();

    // useEffect(() => {
    //     console.log('Watch:', w);
    //     console.error('Errors:', errors);
    // }, [errors, w]);

    const onSubmit = async (formData: TOrganizationFormOutput) => {
        try {
            const { logo, ...formDataWithoutLogo } = formData;
            let logoFormData: FormData | undefined = undefined;
            if (logo) {
                logoFormData = new FormData();
                Object.entries(logo).forEach(([key, value]) => {
                    (logoFormData as FormData).append(key, value as FormDataEntryValue);
                });
            }
            if (isEdit) {
                const updatedCustomer = await updateOrganizationCustomer(
                    formDataWithoutLogo,
                    dirtyFields,
                    userId,
                    logoFormData
                );

                if (!updatedCustomer) {
                    throw new Error('Could not update customer.');
                }

                openSnackbar('Successfully updated customer.');
            } else {
                const createdCustomer = await createOrganizationCustomer(
                    formData,
                    userId,
                    logoFormData
                );
                if (!createdCustomer) {
                    throw new Error('Could not create customer.');
                }
                openSnackbar('Successfully created customer.');
            }
            push('/dashboard/customers');
        } catch (error) {
            if (error instanceof Error) {
                openSnackbar(error.message, 'error');
            }
        }
    };

    return (
        <FormProvider watch={watch} formState={{ errors, dirtyFields, ...formState }} {...methods}>
            <OrganizationForm
                localIdentifierName={localIdentifierName}
                isEdit={isEdit}
                isCustomer
                onSubmit={onSubmit}
            >
                <Button
                    component={NextLink}
                    href='/dashboard/customers'
                    variant='outlined'
                    color='warning'
                >
                    {capitalize(t('cancel'))}
                </Button>
            </OrganizationForm>
        </FormProvider>
    );
};
export default CustomerOrgFormData;
