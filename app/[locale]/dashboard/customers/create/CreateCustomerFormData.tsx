import CustomerForm from '@/app/components/customers/form/CustomerForm';
import Warning from '@/app/components/warning/Warning';
import { getLocalIdentifierNamesByCountryId } from '@/app/lib/data/local-identifier-name';
import { getApp } from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import { setStaticParamsLocale } from 'next-international/server';
import { FC } from 'react';
import { IProps } from './types';

const CreateCustomerFormData: FC<IProps> = async ({ params: { locale } }) => {
    setStaticParamsLocale(locale);

    const t = await getI18n();
    const { provider } = await getApp();

    const userAccountCountry = provider.address.country;
    const localIdentifierNames =
        userAccountCountry && (await getLocalIdentifierNamesByCountryId(userAccountCountry?.id));

    if (!localIdentifierNames.length) {
        return (
            <Warning variant='h4'>
                No local identifier names provided. Please create one(s) for organization and/or
                individual customers for the current user&apos;s country.
            </Warning>
        );
    }

    return (
        <CustomerForm
            userAccountCountry={userAccountCountry}
            localIdentifierNames={localIdentifierNames}
        />
    );
};

export default CreateCustomerFormData;
