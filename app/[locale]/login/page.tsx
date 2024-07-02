import InvoiceMeLogo from '@/app/components/invoice-me-logo/InvoiceMeLogo';
import LoginForm from '@/app/components/login-form/LoginForm';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { setStaticParamsLocale } from 'next-international/server';
import { FC } from 'react';
import { IProps } from '../types';
import {
    FacebookSignInButton,
    GoogleSignInButton,
    TwitterSignInButton
} from '@/app/components/buttons/login/buttons';
import { capitalize } from '@/app/lib/utils';
import { colors } from '@/app/styles/colors';
import { getI18n } from '@/locales/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { ContainerBox, FormWrapperBox } from './styled';

export const fetchCache = 'force-no-store';

const LoginPage: FC<IProps> = async ({ params: { locale } }) => {
    setStaticParamsLocale(locale);

    const t = await getI18n();
    const host = headers().get('x-forwarded-host')?.split(':')[0];

    return (
        <ContainerBox component='main'>
            <Box className='headline-wrapper'>
                <Box component='header' className='header'>
                    <Box component={Link} href='/' sx={{ textDecoration: 'none' }}>
                        <InvoiceMeLogo color={colors.orange} />
                    </Box>
                </Box>
                <FormWrapperBox component='article' className='form-wrapper'>
                    {host === 'localhost' && <LoginForm />}
                    <Typography variant='subtitle1'>
                        {capitalize(t('click on the icons below to sign in with social apps'))}...
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                        <GoogleSignInButton color='warning' />
                        <TwitterSignInButton color='warning' />
                        <FacebookSignInButton color='warning' />
                    </Box>
                </FormWrapperBox>
            </Box>
        </ContainerBox>
    );
};
export default LoginPage;
