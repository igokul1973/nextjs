'use client';

import { capitalize } from '@/app/lib/utils';
// import { getI18n } from '@/locales/server';
import Typography from '@mui/material/Typography';
// import { setStaticParamsLocale } from 'next-international/server';
import { FC } from 'react';
import { StyledProfile } from '../profile/styled';
// import Provider from '../provider/Provider';
// import Warning from '../warning/Warning';
import Provider from '@/app/components/provider/Provider';
import Warning from '@/app/components/warning/Warning';
import { useUser } from '@/app/context/user/provider';
import { useI18n } from '@/locales/client';
import UpdateProviderButton from './UpdateProviderButton';
import { StyledAccountAttribute, StyledAccountWrapper } from './styled';
import { IProps } from './types';

const Account: FC<IProps> = () => {
    // setStaticParamsLocale(locale);

    // const t = await getI18n();
    const t = useI18n();
    // const { account, provider, providerType } = await getUser();
    const {
        state: { account, provider, providerType }
    } = useUser();

    console.log(account, provider, providerType);

    return (
        <StyledAccountWrapper component='article'>
            <StyledProfile>
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
