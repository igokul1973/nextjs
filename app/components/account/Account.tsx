'use client';

import Provider from '@/app/components/provider/Provider';
import Warning from '@/app/components/warning/Warning';
import { useUser } from '@/app/context/user/provider';
import { useLogo } from '@/app/lib/hooks/useLogo';
import { capitalize } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { FC } from 'react';
import { StyledProfile } from '../profile/styled';
import UpdateProviderButton from './UpdateProviderButton';
import { StyledAccountAttribute, StyledAccountAttributeLogo, StyledAccountWrapper } from './styled';
import { IProps } from './types';

const Account: FC<IProps> = () => {
    const t = useI18n();
    const {
        state: { account, provider, providerType }
    } = useUser();

    const [logoUrl] = useLogo(provider);

    return (
        <StyledAccountWrapper component='article'>
            <StyledProfile>
                {logoUrl && (
                    <StyledAccountAttributeLogo>
                        <Typography variant='h6'>{capitalize(t('logo'))}:</Typography>
                        <Box sx={{ width: '100px', position: 'relative', aspectRatio: '1/1' }}>
                            <Image src={logoUrl} fill alt='Logo' />
                        </Box>
                    </StyledAccountAttributeLogo>
                )}
                <StyledAccountAttribute>
                    <Typography variant='h6'>
                        {`${capitalize(t('account'))} ${t('id').toLocaleUpperCase()}`}:
                    </Typography>
                    <Typography variant='body1'>{account?.id}</Typography>
                </StyledAccountAttribute>
                <UpdateProviderButton />
                <Typography variant='h5' color='secondary.main'>
                    {capitalize(t('provider'))}:
                </Typography>
                {!!provider && !!providerType ? (
                    <Provider provider={provider} providerType={providerType} />
                ) : (
                    <Warning variant='body1'>No provider found. Please create one.</Warning>
                )}
            </StyledProfile>
        </StyledAccountWrapper>
    );
};

export default Account;
