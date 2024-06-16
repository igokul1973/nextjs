'use client';

import OrganizationForm from '@/app/components/organizations/form/OrganizationForm';
import {
    getCustomerOrgUpdateSchema,
    getCustomerOrgUpdateSchemaEmptyLogo,
    getOrganizationCreateSchema,
    getOrganizationUpdateSchema,
    getOrganizationUpdateSchemaEmptyLogo
} from '@/app/components/organizations/form/formSchema';
import {
    TOrganizationForm,
    TOrganizationFormOutput
} from '@/app/components/organizations/form/types';
import { useSnackbar } from '@/app/context/snackbar/provider';
import {
    createOrganizationCustomer,
    updateOrganizationCustomer
} from '@/app/lib/data/customer/actions';
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
        formState: { errors, dirtyFields, isDirty, ...formState },
        ...methods
    } = useForm<TOrganizationForm, unknown, TOrganizationFormOutput>({
        resolver: zodResolver(
            isEdit
                ? defaultValues.logo
                    ? getCustomerOrgUpdateSchema(t)
                    : getCustomerOrgUpdateSchemaEmptyLogo(t)
                : getOrganizationCreateSchema(t)
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
                    logo?.name,
                    logoFormData
                );

                if (!updatedCustomer) {
                    throw new Error('could not update customer');
                }

                openSnackbar(capitalize(t('successfully updated customer')));
            } else {
                const createdCustomer = await createOrganizationCustomer(formData, logoFormData);
                if (!createdCustomer) {
                    throw new Error(capitalize(t('could not create customer')));
                }
                openSnackbar(capitalize(t('successfully created customer')));
            }
            push('/dashboard/customers');
        } catch (error) {
            if (error instanceof Error) {
                openSnackbar(capitalize(error.message), 'error');
            }
        }
    };

    return (
        <FormProvider
            watch={watch}
            formState={{ errors, dirtyFields, isDirty, ...formState }}
            {...methods}
        >
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
