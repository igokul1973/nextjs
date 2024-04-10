import { DrawerHeader } from '@/app/components/dashboard/navigation/styled';
import RightDrawer from '@/app/components/right-drawer/RightDrawer';
import NavProvider from '@/app/context/navigation/provider';
import { auth } from '@/auth';
import { I18nProviderClient } from '@/locales/client';
import Box from '@mui/material/Box';
import { FC } from 'react';
import Navigation from '../../components/dashboard/navigation/Navigation';
import { TProps } from './types';

const Layout: FC<TProps> = async ({ params: { locale }, children }) => {
    const session = await auth();
    if (!session) return <div>Not logged in</div>;

    return (
        <Box sx={{ display: 'flex' }}>
            <I18nProviderClient locale={locale}>
                <NavProvider>
                    <Navigation provider={session.provider} />
                    <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
                        <DrawerHeader />
                        {children}
                    </Box>
                    <RightDrawer />
                </NavProvider>
            </I18nProviderClient>
        </Box>
    );
};

export default Layout;
