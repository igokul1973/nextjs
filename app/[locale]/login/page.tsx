import InvoiceMeLogo from '@/app/components/invoice-me-logo/InvoiceMeLogo';
import LoginForm from '@/app/components/login-form/LoginForm';
import {
    signInWithFacebook,
    signInWithGoogle,
    signInWithTwitter
} from '@/app/lib/data/user/actions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { setStaticParamsLocale } from 'next-international/server';
import { FC } from 'react';
import { IProps } from '../types';

import BaseFormActionIconButton from '@/app/components/buttons/base/BaseFormActionIconButton';
import { capitalize } from '@/app/lib/utils';
import { colors } from '@/app/styles/colors';
import { getI18n } from '@/locales/server';
import FacebookIcon from '@mui/icons-material/facebook';
import GoogleIcon from '@mui/icons-material/google';
import TwitterIcon from '@mui/icons-material/twitter';
import { IconButtonOwnProps } from '@mui/material';
import { headers } from 'next/headers';
import Link from 'next/link';
import { ContainerBox, FormWrapperBox } from './styled';

export const fetchCache = 'force-no-store';

export function GoogleSignInButton({ color }: Readonly<{ color?: IconButtonOwnProps['color'] }>) {
    return (
        <BaseFormActionIconButton
            color={color || 'primary'}
            icon={GoogleIcon}
            action={signInWithGoogle}
            ariaLabel='Google log-in button'
            title='Log in with Google'
        />
    );
}

export function TwitterSignInButton({ color }: Readonly<{ color?: IconButtonOwnProps['color'] }>) {
    return (
        <BaseFormActionIconButton
            color={color || 'primary'}
            icon={TwitterIcon}
            action={signInWithTwitter}
            ariaLabel='Twitter log-in button'
            title='Log in with Twitter'
        />
    );
}

export function FacebookSignInButton({ color }: Readonly<{ color?: IconButtonOwnProps['color'] }>) {
    return (
        <BaseFormActionIconButton
            color={color || 'primary'}
            icon={FacebookIcon}
            action={signInWithFacebook}
            ariaLabel='Facebook log-in button'
            title='Log in with Facebook'
        />
    );
}

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
