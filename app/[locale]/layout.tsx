import ThemeRegistry from '@/app/components/theme-registry/ThemeRegistry';
import { getCountries } from '@/app/lib/data/country';
import { getOrganizationTypes } from '@/app/lib/data/organization-type';
import '@/app/styles/global.css';
import { I18nProviderClient } from '@/locales/client';
import { setStaticParamsLocale } from 'next-international/server';
import { FC, PropsWithChildren } from 'react';
import { getStaticParams } from '../../locales/server';
import { IProps } from './types';

const RootLayout: FC<IProps & PropsWithChildren> = async ({ params: { locale }, children }) => {
    setStaticParamsLocale(locale);

    const countries = await getCountries();
    const organizationTypes = await getOrganizationTypes();

    return (
        <html lang='en'>
            <body>
                <ThemeRegistry countries={countries} organizationTypes={organizationTypes}>
                    <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
                </ThemeRegistry>
            </body>
        </html>
    );
};

export function generateStaticParams() {
    return getStaticParams();
}

export default RootLayout;
