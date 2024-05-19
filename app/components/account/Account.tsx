'use client';

import { capitalize, getUser } from '@/app/lib/utils';
// import { getI18n } from '@/locales/server';
import Typography from '@mui/material/Typography';
// import { setStaticParamsLocale } from 'next-international/server';
import { FC } from 'react';
import { StyledProfile } from '../profile/styled';
// import Provider from '../provider/Provider';
// import Warning from '../warning/Warning';
import Provider from '@/app/components/provider/Provider';
import Warning from '@/app/components/warning/Warning';
import { useI18n } from '@/locales/client';
import UpdateProviderButton from './UpdateProviderButton';
import { StyledAccountAttribute, StyledAccountWrapper } from './styled';
import { IProps } from './types';

const Account: FC<IProps> = async () => {
    // setStaticParamsLocale(locale);

    // const t = await getI18n();
    const t = useI18n();
    const { account, provider, providerType } = await getUser();
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
