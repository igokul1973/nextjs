import InvoiceMeLogo from '@/app/components/invoice-me-logo/InvoiceMeLogo';
import Loading from '@/app/components/loading/Loading';
import ProfileRegistrationForm from '@/app/components/registration/ProfileRegistrationForm';
import ProviderRegistrationForm from '@/app/components/registration/ProviderRegistrationForm';
import SettingsRegistrationForm from '@/app/components/registration/SettingsRegistrationForm';
import UserRegistrationForm from '@/app/components/registration/UserRegistrationForm';
import { getPartialApp } from '@/app/lib/utils';
import { colors } from '@/app/styles/colors';
import { auth } from '@/auth';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { setStaticParamsLocale } from 'next-international/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FC, Suspense } from 'react';
import { IProps } from '../../types';
import { ContainerBox, FormWrapperBox } from './styled';

export const fetchCache = 'force-no-store';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const pageMap = [
    {
        name: 'user',
        component: (props: { userEmail: string }) => <UserRegistrationForm {...props} />
    },
    {
        name: 'profile',
        component: () => <ProfileRegistrationForm />
    },
    // {
    //     name: 'country',
    //     component: () => <CountryRegistrationFormData />
    // },
    {
        name: 'provider',
        component: () => <ProviderRegistrationForm />
    },
    {
        name: 'settings',
        component: () => <SettingsRegistrationForm />
    }
] as const;

const validateAppState = async (page: string) => {
    const { account, profile, provider, settings, user } = await getPartialApp();
    if (account && user && profile && provider && settings) {
        return redirect('/dashboard');
    } else if (account && user && profile && provider) {
        if (page !== 'settings') {
            return redirect('/registration/settings');
        }
    } else if (account && user && profile) {
        if (page !== 'provider') {
            return redirect('/registration/provider');
        }
    } else if (account && user) {
        if (page !== 'profile') {
            return redirect('/registration/profile');
        }
    } else {
        if (page !== 'user') {
            return redirect('/registration/user');
        }
    }
};

const RegistrationPage: FC<IProps> = async ({ params: { locale, page } }) => {
    setStaticParamsLocale(locale);
    if (!page || (page[0] && !pageMap.find((p) => p.name === page[0]))) {
        return redirect('/registration/user');
    }

    await validateAppState(page[0]);

    const session = await auth();
    if (!session?.user?.email) {
        return redirect('/');
    }

    const userEmail = session.user.email;
    const userFullName = session.user.name;

    let currentPageIndex = pageMap.findIndex((p) => p.name === page[0]);

    if (currentPageIndex === -1) {
        currentPageIndex = 0;
    }

    const props = { userEmail };
    const CurrentFormComponent = pageMap[currentPageIndex].component(props);

    return (
        <ContainerBox component='main'>
            <Box className='headline-wrapper'>
                <Box component='header' className='header'>
                    <Box component={Link} href='/' sx={{ textDecoration: 'none' }}>
                        <InvoiceMeLogo color={colors.orange} />
                    </Box>
                </Box>
                <FormWrapperBox component='article' className='form-wrapper'>
                    <Typography variant='h4'>Welcome {userFullName}!</Typography>
                    <Suspense fallback={<Loading />}>{CurrentFormComponent}</Suspense>
                </FormWrapperBox>
            </Box>
        </ContainerBox>
    );
};
export default RegistrationPage;
