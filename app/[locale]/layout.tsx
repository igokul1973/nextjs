import GlobalSnackbar from '@/app/components/snackbar/GlobalSnackbar';
import ThemeRegistry from '@/app/components/theme-registry/ThemeRegistry';
import { SnackbarProvider } from '@/app/context/snackbar/provider';
import { PartialAppProvider } from '@/app/context/user/provider';
import { getCountries } from '@/app/lib/data/country';
import { getOrganizationTypes } from '@/app/lib/data/organization-type';
import { getPartialApp } from '@/app/lib/utils';
import '@/app/styles/global.css';
import { I18nProviderClient } from '@/locales/client';
import { getStaticParams } from '@/locales/server';
import { setStaticParamsLocale } from 'next-international/server';
import { FC, PropsWithChildren } from 'react';
import { IProps } from './types';

const RootLayout: FC<IProps & PropsWithChildren> = async ({ params: { locale }, children }) => {
    setStaticParamsLocale(locale);

    const partialAppPromise = getPartialApp();
    const partialCountriesPromise = getCountries();
    const partialOrganizationTypesPromise = getOrganizationTypes();

    const [
        { account, user, profile, provider, providerType, settings },
        countries,
        organizationTypes
    ] = await Promise.all([
        partialAppPromise,
        partialCountriesPromise,
        partialOrganizationTypesPromise
    ]);

    return (
        <html lang='en'>
            <body>
                <ThemeRegistry countries={countries} organizationTypes={organizationTypes}>
                    <I18nProviderClient locale={locale}>
                        <PartialAppProvider
                            userState={{
                                user,
                                profile,
                                account,
                                settings,
                                provider,
                                providerType
                            }}
                        >
                            <SnackbarProvider>
                                {children}
                                <GlobalSnackbar />
                            </SnackbarProvider>
                        </PartialAppProvider>
                    </I18nProviderClient>
                </ThemeRegistry>
            </body>
        </html>
    );
};

export function generateStaticParams() {
    return getStaticParams();
}

export default RootLayout;
