import InventoryForm from '@/app/components/inventory/form/InventoryForm';
import { TInventoryForm } from '@/app/components/inventory/form/types';
import { getDefaultFormValues } from '@/app/components/inventory/utils';
import Warning from '@/app/components/warning/Warning';
import { getInventoryItemById } from '@/app/lib/data/inventory';
import { getInventoryTypes } from '@/app/lib/data/inventory-type';
import { capitalize, getUser, populateForm } from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import { setStaticParamsLocale } from 'next-international/server';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import { IProps } from './types';

const UpdateInventoryFormData: FC<IProps> = async ({ params: { id, locale } }) => {
    setStaticParamsLocale(locale);

    const t = await getI18n();
    const { user, account } = await getUser();

    const inventoryPromise = getInventoryItemById(id, account.id);
    const typesPromise = getInventoryTypes();

    const [rawInventoryItem, types] = await Promise.all([inventoryPromise, typesPromise]);

    if (!rawInventoryItem) {
        return notFound();
    }

    if (!types.length) {
        return <Warning variant='h4'>{capitalize(t('could not load data'))}</Warning>;
    }

    const {
        price: rawPrice,
        manufacturerPrice: rawManufacturerPrice,
        ...partialInventoryItem
    } = rawInventoryItem;

    const inventoryItem = {
        price: rawPrice / 100,
        manufacturerPrice: rawManufacturerPrice === null ? null : rawManufacturerPrice / 100,
        ...partialInventoryItem
    };

    // Since the DB may return some empty (null, undefined) values or not return
    // some keys at all, but the form expects certain values to be set
    // in order to later calculate the dirty values, we need to convert them where
    // appropriate to default values.
    const defaultValues = populateForm<TInventoryForm>(
        getDefaultFormValues(account.id, user.id),
        inventoryItem
    );

    return <InventoryForm types={types} defaultValues={defaultValues} isEdit={true} />;
};

export default UpdateInventoryFormData;
