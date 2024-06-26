'use client';

import IndividualForm from '@/app/components/individuals/form/IndividualForm';
import {
    getIndividualCreateSchema,
    getProviderIndUpdateSchema,
    getProviderIndUpdateSchemaEmptyLogo
} from '@/app/components/individuals/form/formSchema';
import { TProviderIndForm, TProviderIndFormOutput } from '@/app/components/individuals/form/types';
import { useRightDrawerState } from '@/app/context/right-drawer/provider';
import { useSnackbar } from '@/app/context/snackbar/provider';
import { useApp } from '@/app/context/user/provider';
import { createIndividual, updateIndividual } from '@/app/lib/data/indiviidual/actions';
import { TDirtyFields } from '@/app/lib/types';
import { useI18n } from '@/locales/client';
import { TSingleTranslationKey } from '@/locales/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { capitalize } from '@mui/material';
import Button from '@mui/material/Button';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { IProviderIndFormDataProps } from './types';

const ProviderIndFormData: FC<IProviderIndFormDataProps> = ({
    localIdentifierName,
    defaultValues,
    isEdit
}) => {
    const t = useI18n();
    const { openSnackbar } = useSnackbar();
    const { state: user, dispatch: dispatchUserState } = useApp();
    const { dispatch: rightDrawerDispatch } = useRightDrawerState();

    const {
        watch,
        register,
        handleSubmit,
        formState: { errors, isDirty, dirtyFields, ...formState },
        ...methods
    } = useForm<TProviderIndForm, unknown, TProviderIndFormOutput>({
        resolver: zodResolver(
            isEdit
                ? defaultValues.logo
                    ? getProviderIndUpdateSchema(t)
                    : getProviderIndUpdateSchemaEmptyLogo(t)
                : getIndividualCreateSchema(t)
        ),
        reValidateMode: 'onChange',
        defaultValues
    });

    // const w = watch();

    // useEffect(() => {
    //     console.log('Watch:', w);
    //     console.error('Errors:', errors);
    // }, [errors, w]);

    const onSubmit = async (formData: TProviderIndFormOutput) => {
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
                    dirtyFields as TDirtyFields<TProviderIndFormOutput>,
                    logo?.name,
                    logoFormData
                );

                if (!updatedProvider) {
                    throw new Error('could not update provider');
                }
                dispatchUserState({
                    type: 'update',
                    payload: {
                        ...user,
                        provider: updatedProvider
                    }
                });

                openSnackbar(capitalize(t('successfully updated provider')));
            } else {
                const createdProvider = await createIndividual(formData, logoFormData);
                if (!createdProvider) {
                    throw new Error(capitalize(t('could not create provider')));
                }
                dispatchUserState({
                    type: 'update',
                    payload: {
                        ...user,
                        provider: createdProvider
                    }
                });
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
        rightDrawerDispatch({
            payload: { childComponentName: 'account' },
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
