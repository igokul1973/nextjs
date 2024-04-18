import { DrawerHeader } from '@/app/components/dashboard/navigation/styled';
import RightDrawer from '@/app/components/right-drawer/RightDrawer';
import GlobalSnackbar from '@/app/components/snackbar/GlobalSnackbar';
import NavProvider from '@/app/context/navigation/provider';
import { SnackbarProvider } from '@/app/context/snackbar/provider';
import UserProvider from '@/app/context/user/provider';
import { getUserProfile } from '@/app/lib/data/profile';
import { auth } from '@/auth';
import { I18nProviderClient } from '@/locales/client';
import Box from '@mui/material/Box';
import { FC } from 'react';
import Navigation from '../../components/dashboard/navigation/Navigation';
import { TProps } from './types';

const Layout: FC<TProps> = async ({ params: { locale }, children }) => {
    const session = await auth();
    const sessionUser = session?.user;
    if (!session || !sessionUser) return <div>Not logged in</div>;
    const { account, ...user } = sessionUser;
    const profile = await getUserProfile(session.user.id);
    if (!profile) return <div>The user has no profile. Please create one.</div>;
    const provider = session.provider;
    const providerType = session.providerType;

    return (
        <Box sx={{ display: 'flex' }}>
            <I18nProviderClient locale={locale}>
                <NavProvider>
                    <UserProvider value={{ user, profile, account, provider, providerType }}>
                        <SnackbarProvider>
                            <Navigation />
                            <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
                                <DrawerHeader />
                                {children}
                                <RightDrawer />
                            </Box>
                            <GlobalSnackbar />
                        </SnackbarProvider>
                    </UserProvider>
                </NavProvider>
            </I18nProviderClient>
        </Box>
    );
};

export default Layout;
