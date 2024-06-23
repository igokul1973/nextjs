import { DrawerHeader } from '@/app/components/dashboard/navigation/styled';
import RightDrawer from '@/app/components/right-drawer/RightDrawer';
import GlobalSnackbar from '@/app/components/snackbar/GlobalSnackbar';
import RightDrawerProvider from '@/app/context/right-drawer/provider';
import { SnackbarProvider } from '@/app/context/snackbar/provider';
import UserProvider from '@/app/context/user/provider';
import { getUserWithRelationsByEmail } from '@/app/lib/data/user';
import { TEntity } from '@/app/lib/types';
import { getUserProvider, getUserProviderType } from '@/app/lib/utils';
import { auth } from '@/auth';
import Box from '@mui/material/Box';
import { redirect } from 'next/navigation';
import { FC } from 'react';
import Navigation from '../../components/dashboard/navigation/Navigation';
import { TProps } from './types';

const Layout: FC<TProps> = async ({ params: { locale }, children }) => {
    const session = await auth();
    const sessionUser = session?.user;
    if (!session || !sessionUser) redirect('/');

    const dbUser = await getUserWithRelationsByEmail(sessionUser.email);

    // If the session user is present but the dbUser is not, redirect
    // to the registration page.

    if (!dbUser) {
        if (sessionUser.id && sessionUser.email) {
            redirect('/registration');
        } else {
            redirect('/');
        }
    }

    const { account: rawAccount, profile, ...user } = dbUser;
    const { settings, ...account } = rawAccount;

    const provider = getUserProvider(dbUser);
    const concreteProvider = provider?.individual ?? provider?.organization;
    // TODO: Somewhere here I should make sure the concrete provider and
    // settings are never undefined. If so, however, here I should probably
    // redirect back to registration form.

    const providerType = getUserProviderType(provider);

    return (
        <Box sx={{ display: 'flex' }}>
            {/* <I18nProviderClient locale={locale}> */}
            <RightDrawerProvider>
                <UserProvider
                    userState={{
                        user,
                        profile,
                        account,
                        settings,
                        provider: concreteProvider as TEntity | undefined,
                        providerType
                    }}
                >
                    <SnackbarProvider>
                        <Navigation />
                        <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
                            {/* This header is for purposes of pushing the content down */}
                            <DrawerHeader />
                            {children}
                            <RightDrawer />
                        </Box>
                        <GlobalSnackbar />
                    </SnackbarProvider>
                </UserProvider>
            </RightDrawerProvider>
            {/* </I18nProviderClient> */}
        </Box>
    );
};

export default Layout;
