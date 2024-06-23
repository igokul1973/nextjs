import BaseLinkButton from '@/app/components/buttons/base/BaseLinkButton';
import InvoiceMeLogo from '@/app/components/invoice-me-logo/InvoiceMeLogo';
import LanguageSwitcher from '@/app/components/language-switcher/LanguageSwitcher';
import { colors } from '@/app/styles/colors';
import { auth } from '@/auth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { setStaticParamsLocale } from 'next-international/server';
import Link from 'next/link';
import { FC, Suspense } from 'react';
import BaseFormActionIconButton from '../components/buttons/base/BaseFormActionIconButton';
import BaseLinkIconButton from '../components/buttons/base/BaseLinkIconButton';
import { logOut } from '../lib/data/user/actions';
import { ContainerBox } from './styled';
import { IProps } from './types';

const Page: FC<IProps> = async ({ params: { locale } }) => {
    setStaticParamsLocale(locale);

    const session = await auth();

    const isLoggedIn = !!session?.user;

    return (
        <ContainerBox className='container'>
            <Box component='main' className='main'>
                <Box className='headline-wrapper'>
                    <Box component='header' className='header'>
                        <InvoiceMeLogo color={colors.orange} />
                        <Box component='nav' className='nav'>
                            <Suspense>
                                <LanguageSwitcher />
                            </Suspense>
                            <Typography component={Link} href='#about'>
                                About
                            </Typography>
                            <Typography component={Link} href='#pricing'>
                                Prices
                            </Typography>
                            {isLoggedIn ? (
                                <>
                                    <BaseLinkIconButton
                                        icon={DashboardIcon}
                                        href='/dashboard'
                                        ariaLabel='Link to dashboard'
                                        title='Go to Dashboard'
                                    />
                                    <BaseFormActionIconButton
                                        icon={LogoutIcon}
                                        action={logOut}
                                        ariaLabel='Log-out button'
                                        title='Log out'
                                    />
                                </>
                            ) : (
                                <BaseLinkButton name='Log in' href='/login' variant='outlined' />
                            )}
                        </Box>
                    </Box>
                    <Box component='section' className='headline'>
                        <Typography variant='h1' sx={{ fontWeight: 'bold' }}>
                            Invoice solution for your flourising business
                        </Typography>
                        <Typography variant='h4'>
                            Give yourself and your customers ease of mind
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box component='section' className='about' id='about'>
                <Typography variant='h2' sx={{ color: colors.blue }}>
                    About
                </Typography>
                <Box className='about--steps'>
                    <Box>Register</Box>
                    <Box>Add your services and products</Box>
                    <Box>Create Invoices</Box>
                    {/* <Image
                        src='/hero-desktop.png'
                        width={1000}
                        height={760}
                        alt='Screenshots whatever'
                    />
                    <Image
                        src='/hero-mobile.png'
                        width={560}
                        height={620}
                        alt='Screenshots whatever mobile'
                    /> */}
                </Box>
            </Box>
            <Box component='section' className='pricing' id='pricing'>
                <Typography variant='h2' sx={{ color: colors.blue }}>
                    Pricing
                </Typography>
                <Box className='pricing--plans'>
                    <Box>Free</Box>
                    <Box>Pro</Box>
                </Box>
            </Box>
        </ContainerBox>
    );
};
export default Page;
