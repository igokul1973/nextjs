import { DrawerHeader } from '@/app/components/dashboard/navigation/styled';
import RightDrawer from '@/app/components/right-drawer/RightDrawer';
import RightDrawerProvider from '@/app/context/right-drawer/provider';
import AppProvider from '@/app/context/user/provider';
import { getCountries } from '@/app/lib/data/country';
import { getOrganizationTypes } from '@/app/lib/data/organization-type';
import { getApp } from '@/app/lib/utils';
import Box from '@mui/material/Box';
import { FC, PropsWithChildren } from 'react';
import Navigation from '../../components/dashboard/navigation/Navigation';

const Layout: FC<PropsWithChildren> = async ({ children }) => {
    const appPromise = getApp();
    const partialCountriesPromise = getCountries();
    const partialOrganizationTypesPromise = getOrganizationTypes();

    const [
        { account, user, profile, provider, providerType, settings },
        countries,
        organizationTypes
    ] = await Promise.all([appPromise, partialCountriesPromise, partialOrganizationTypesPromise]);

    return (
        <Box sx={{ display: 'flex' }}>
            <RightDrawerProvider>
                <AppProvider
                    appState={{
                        user,
                        profile,
                        account,
                        settings,
                        provider,
                        providerType,
                        countries,
                        organizationTypes
                    }}
                >
                    <Navigation />
                    <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
                        {/* This header is for purposes of pushing the dashboard HTML content down */}
                        <DrawerHeader />
                        {children}
                        <RightDrawer />
                    </Box>
                </AppProvider>
            </RightDrawerProvider>
        </Box>
    );
};

export default Layout;
