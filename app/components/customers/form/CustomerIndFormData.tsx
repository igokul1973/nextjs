'use client';

import IndividualForm from '@/app/components/individuals/form/IndividualForm';
import {
    getIndividualCreateSchema,
    getIndividualUpdateSchema,
    getIndividualUpdateSchemaEmptyLogo
} from '@/app/components/individuals/form/formSchema';
import { TIndividualForm, TIndividualFormOutput } from '@/app/components/individuals/form/types';
import { useSnackbar } from '@/app/context/snackbar/provider';
import { useUser } from '@/app/context/user/provider';
import {
    createIndividualCustomer,
    updateIndividualCustomer
} from '@/app/lib/data/customer/actions';
import { TDirtyFields } from '@/app/lib/types';
import { useI18n } from '@/locales/client';
import { TSingleTranslationKey } from '@/locales/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, capitalize } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ICustomerIndFormDataProps } from './types';

const CustomerIndFormData: FC<ICustomerIndFormDataProps> = ({
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

    const logoFile = !rawDefaultValues?.logo
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
    } = useForm<TIndividualForm, unknown, TIndividualFormOutput>({
        resolver: zodResolver(
            isEdit
                ? defaultValues.logo
                    ? getIndividualUpdateSchema(t)
                    : getIndividualUpdateSchemaEmptyLogo(t)
                : getIndividualCreateSchema(t)
        ),
        reValidateMode: 'onChange',
        defaultValues
    });

    // const w = watch();

    // useEffect(() => {
    // console.log('Dirty fields: ', dirtyFields);
    // console.log('Is dirty: ', isDirty);
    // console.log('Watch:', w);
    // console.error('Errors:', errors);
    // }, [errors, w]);

    const onSubmit = async (formData: TIndividualFormOutput) => {
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
                const updatedCustomer = await updateIndividualCustomer(
                    t,
                    formDataWithoutLogo,
                    dirtyFields as TDirtyFields<TIndividualFormOutput>,
                    userId,
                    logoFormData
                );
                if (!updatedCustomer) {
                    throw new Error('could not update customer');
                }
                openSnackbar(capitalize(t('successfully updated customer')));
            } else {
                const createdCustomer = await createIndividualCustomer(
                    t,
                    formData,
                    userId,
                    logoFormData
                );
                if (!createdCustomer) {
                    throw new Error(capitalize(t('could not create customer')));
                }
                openSnackbar(capitalize(t('successfully created customer')));
            }
            push('/dashboard/customers');
        } catch (error) {
            if (error instanceof Error) {
                openSnackbar(capitalize(t(error.message as TSingleTranslationKey)), 'error');
            }
        }
    };

    return (
        <FormProvider
            watch={watch}
            formState={{ errors, dirtyFields, isDirty, ...formState }}
            {...methods}
        >
            <IndividualForm
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
            </IndividualForm>
        </FormProvider>
    );
};
export default CustomerIndFormData;
