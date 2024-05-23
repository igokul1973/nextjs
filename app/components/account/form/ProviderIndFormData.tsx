'use client';

import {
    individualCreateSchema,
    individualUpdateSchema,
    individualUpdateSchemaEmptyLogo
} from '@/app/components/individuals/form/formSchema';
import { TIndividualForm, TIndividualFormOutput } from '@/app/components/individuals/form/types';
import { useRightDrawerState } from '@/app/context/right-drawer/provider';
import { useSnackbar } from '@/app/context/snackbar/provider';
import { useUser } from '@/app/context/user/provider';
import { createIndividual, updateIndividual } from '@/app/lib/data/indiviidual/actions';
import { TDirtyFields } from '@/app/lib/types';
import { useI18n } from '@/locales/client';
import { TSingleTranslationKey } from '@/locales/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { capitalize } from '@mui/material';
import Button from '@mui/material/Button';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { components } from '../../dashboard/avatar-menu/constants';
import IndividualForm from '../../individuals/form/IndividualForm';
import { IProviderIndFormDataProps } from './types';

const ProviderIndFormData: FC<IProviderIndFormDataProps> = ({
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
    const { dispatch: rightDrawerDispatch } = useRightDrawerState();

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
        register,
        handleSubmit,
        formState: { errors, isDirty, dirtyFields, ...formState },
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

    // const w = watch();

    // useEffect(() => {
    //     console.log('Watch:', w);
    //     console.error('Errors:', errors);
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
                const updatedProvider = await updateIndividual(
                    formDataWithoutLogo,
                    dirtyFields as TDirtyFields<TIndividualFormOutput>,
                    userId,
                    logoFormData
                );

                if (!updatedProvider) {
                    throw new Error('could not update provider');
                }

                openSnackbar(capitalize(t('successfully updated provider')));
            } else {
                const createdProvider = await createIndividual(formData, userId, logoFormData);
                if (!createdProvider) {
                    throw new Error(capitalize(t('could not create provider')));
                }
                openSnackbar(capitalize(t('successfully created provider')));
            }
            goBack();
        } catch (error) {
            if (error instanceof Error) {
                openSnackbar(capitalize(t(error.message as TSingleTranslationKey)), 'error');
            }
        }
    };

    const goBack = () => {
        const { component, title, icon } = components.account;

        rightDrawerDispatch({
            payload: { childComponent: component, title, icon },
            type: 'open'
        });
    };

    return (
        <FormProvider
            watch={watch}
            register={register}
            handleSubmit={handleSubmit}
            formState={{ errors, dirtyFields, isDirty, ...formState }}
            {...methods}
        >
            <IndividualForm
                localIdentifierName={localIdentifierName}
                isEdit={isEdit}
                isCustomer={false}
                onSubmit={onSubmit}
            >
                <Button type='button' onClick={goBack} variant='outlined' color='warning'>
                    {capitalize(t('cancel'))}
                </Button>
            </IndividualForm>
        </FormProvider>
    );
};
export default ProviderIndFormData;
