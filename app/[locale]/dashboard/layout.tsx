import { DrawerHeader } from '@/app/components/dashboard/navigation/styled';
import RightDrawer from '@/app/components/right-drawer/RightDrawer';
import GlobalSnackbar from '@/app/components/snackbar/GlobalSnackbar';
import RightDrawerProvider from '@/app/context/right-drawer/provider';
import { SnackbarProvider } from '@/app/context/snackbar/provider';
import UserProvider from '@/app/context/user/provider';
import { getUserWithRelationsByEmail } from '@/app/lib/data/user';
import { getUserProvider, getUserProviderType } from '@/app/lib/utils';
import { auth } from '@/auth';
import { I18nProviderClient } from '@/locales/client';
import Box from '@mui/material/Box';
import { redirect } from 'next/navigation';
import { FC } from 'react';
import Navigation from '../../components/dashboard/navigation/Navigation';
import { TProps } from './types';
import { TEntity } from '@/app/lib/types';

const Layout: FC<TProps> = async ({ params: { locale }, children }) => {
    const session = await auth();
    const sessionUser = session?.user;
    if (!session || !sessionUser) redirect('/');

    const dbUser = await getUserWithRelationsByEmail(sessionUser.email);

    if (!dbUser) {
        redirect('/');
    }

    const { account, profile, ...user } = dbUser;

    const provider = getUserProvider(dbUser);
    const concreteProvider = provider?.individual || provider?.organization;

    const providerType = getUserProviderType(provider);

    return (
        <Box sx={{ display: 'flex' }}>
            <I18nProviderClient locale={locale}>
                <RightDrawerProvider>
                    <UserProvider
                        userState={{
                            user,
                            profile,
                            account,
                            provider: concreteProvider as TEntity,
                            providerType
                        }}
                    >
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
                </RightDrawerProvider>
            </I18nProviderClient>
        </Box>
    );
};

export default Layout;
