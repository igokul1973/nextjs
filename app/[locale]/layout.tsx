import ThemeRegistry from '@/app/components/theme-registry/ThemeRegistry';
import { getCountries } from '@/app/lib/data/country';
import { getOrganizationTypes } from '@/app/lib/data/organization-type';
import '@/app/styles/global.css';
import { FC, PropsWithChildren } from 'react';

const RootLayout: FC<PropsWithChildren> = async ({ children }) => {
    const countries = await getCountries();
    const organizationTypes = await getOrganizationTypes();

    return (
        <html lang='en'>
            <body>
                <ThemeRegistry countries={countries} organizationTypes={organizationTypes}>
                    {children}
                </ThemeRegistry>
            </body>
        </html>
    );
};

export default RootLayout;
