import InventoryForm from '@/app/components/inventory/form/InventoryForm';
import { getDefaultFormValues } from '@/app/components/inventory/utils';
import Warning from '@/app/components/warning/Warning';
import { getInventoryTypes } from '@/app/lib/data/inventory-type';
import { capitalize, getUser } from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import { setStaticParamsLocale } from 'next-international/server';
import { FC } from 'react';
import { IProps } from './types';

const CreateInventoryFormData: FC<IProps> = async ({ params: { locale } }) => {
    setStaticParamsLocale(locale);

    const t = await getI18n();
    const { user, account } = await getUser();

    const types = await getInventoryTypes();
    const isDataLoaded = !!types.length;

    const defaultValues = getDefaultFormValues(account.id, user.id);

    if (!isDataLoaded) {
        return <Warning variant='h4'>{capitalize(t('could not load data'))}</Warning>;
    }

    return <InventoryForm types={types} defaultValues={defaultValues} isEdit={false} />;
};

export default CreateInventoryFormData;
