import Loading from '@/app/components/loading/Loading';
import Provider from '@/app/components/provider/Provider';
import Warning from '@/app/components/warning/Warning';
import { TAccount } from '@/app/lib/types';
import { auth } from '@/auth';
import { useI18n } from '@/locales/client';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { EntitiesEnum } from '@prisma/client';
import { FC, useEffect, useState } from 'react';
import { StyledAccountAttribute } from './styled';
import { TProvider } from './types';

const Account: FC = () => {
    const [account, setAccount] = useState<TAccount | null>(null);
    const [provider, setProvider] = useState<TProvider | null>(null);
    const [providerType, setProviderType] = useState<EntitiesEnum | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const t = useI18n();

    useEffect(() => {
        const getAccount = async () => {
            const session = await auth();
            if (session) {
                const account = session.user.account;
                const provider = session.provider;
                const providerType = session.providerType;
                if (providerType && provider && provider[providerType]) {
                    setProvider(provider[providerType] as TProvider);
                    setProviderType(providerType);
                }
                if (account) {
                    setAccount(account);
                }
                setIsLoading(false);
            }
        };
        getAccount();
    }, []);

    return (
        <Box component='article' sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {isLoading ? (
                <Box sx={{ height: '30vh' }}>
                    <Loading />
                </Box>
            ) : (
                <>
                    <StyledAccountAttribute>
                        <Typography variant='h6'>
                            {`${capitalize(t('account'))} ${t('id').toLocaleUpperCase()}`}:
                        </Typography>
                        <Typography variant='body1'>{account?.id}</Typography>
                    </StyledAccountAttribute>
                    <Typography variant='h5' color='secondary.main'>
                        {capitalize(t('provider'))}:
                    </Typography>
                    {!!provider && !!providerType ? (
                        <Provider provider={provider} providerType={providerType} />
                    ) : (
                        <Warning variant='body1'>No provider found. Please create one.</Warning>
                    )}
                </>
            )}
        </Box>
    );
};

export default Account;
