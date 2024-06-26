import { DrawerHeader } from '@/app/components/dashboard/navigation/styled';
import RightDrawer from '@/app/components/right-drawer/RightDrawer';
import RightDrawerProvider from '@/app/context/right-drawer/provider';
import { SnackbarProvider } from '@/app/context/snackbar/provider';
import AppProvider from '@/app/context/user/provider';
import { getApp } from '@/app/lib/utils';
import Box from '@mui/material/Box';
import { FC } from 'react';
import Navigation from '../../components/dashboard/navigation/Navigation';
import { TProps } from './types';

const Layout: FC<TProps> = async ({ params: { locale }, children }) => {
    const { account, user, profile, provider, providerType, settings } = await getApp();

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
                        providerType
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
