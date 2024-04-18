import Provider from '@/app/components/provider/Provider';
import Warning from '@/app/components/warning/Warning';
import { useUser } from '@/app/context/user/provider';
import { useI18n } from '@/locales/client';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import { StyledAccountAttribute } from './styled';

const Account: FC = () => {
    const t = useI18n();
    const { account, provider, providerType } = useUser();

    return (
        <Box component='article' sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
        </Box>
    );
};

export default Account;
