import BaseFormActionIconButton from '@/app/components/buttons/base/BaseFormActionIconButton';
import {
    signInWithFacebook,
    signInWithGoogle,
    signInWithTwitter
} from '@/app/lib/data/user/actions';

import FacebookIcon from '@mui/icons-material/facebook';
import GoogleIcon from '@mui/icons-material/google';
import TwitterIcon from '@mui/icons-material/twitter';
import { type IconButtonOwnProps } from '@mui/material/IconButton';

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
