'use client';

import Provider from '@/app/components/provider/Provider';
import { useApp } from '@/app/context/user/provider';
import { capitalize } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import { StyledProfile } from '../profile/styled';
import UpdateProviderButton from './UpdateProviderButton';
import { StyledAccountAttribute, StyledAccountWrapper } from './styled';
import { IProps } from './types';

const Account: FC<IProps> = () => {
    const t = useI18n();
    const {
        state: { account, provider, providerType }
    } = useApp();

    return (
        <StyledAccountWrapper component='article'>
            <StyledProfile>
                <StyledAccountAttribute>
                    <Typography variant='subtitle2'>
                        {`${capitalize(t('account'))} ${t('id').toLocaleUpperCase()}`}:
                    </Typography>
                    <Typography variant='subtitle1'>{account?.id}</Typography>
                </StyledAccountAttribute>
                <UpdateProviderButton />
                <Typography variant='h6' color='secondary.main'>
                    {capitalize(t('provider'))}:
                </Typography>
                <Provider provider={provider} providerType={providerType} />
            </StyledProfile>
        </StyledAccountWrapper>
    );
};

export default Account;
