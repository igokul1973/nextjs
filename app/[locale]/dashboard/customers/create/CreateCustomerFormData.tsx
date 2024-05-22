import CustomerForm from '@/app/components/customers/form/CustomerForm';
import Warning from '@/app/components/warning/Warning';
import { getLocalIdentifierNamesByCountryId } from '@/app/lib/data/local-identifier-name';
import { capitalize, getUser } from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import { setStaticParamsLocale } from 'next-international/server';
import { FC } from 'react';
import { IProps } from './types';

const CreateCustomerFormData: FC<IProps> = async ({ params: { locale } }) => {
    setStaticParamsLocale(locale);

    const t = await getI18n();
    const { provider } = await getUser();

    const userAccountCountry = provider && provider.address?.country;
    const localIdentifierNames =
        userAccountCountry && (await getLocalIdentifierNamesByCountryId(userAccountCountry?.id));
    const isDataLoaded = !!userAccountCountry && !!localIdentifierNames;

    if (!isDataLoaded) {
        return (
            <Warning variant='h4'>
                {capitalize(
                    t('before creating customers please register yourself as a Service Provider')
                )}
                .
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
