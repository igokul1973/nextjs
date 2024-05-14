import Provider from '@/app/components/provider/Provider';
import Warning from '@/app/components/warning/Warning';
import { useUser } from '@/app/context/user/provider';
import { useI18n } from '@/locales/client';
import { capitalize } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import { StyledProfile } from '../profile/styled';
import { StyledAccountAttribute, StyledAccountWrapper } from './styled';

const Account: FC = () => {
    const t = useI18n();
    const {
        state: { account, provider, providerType }
    } = useUser();

    const onUpdateAccount = () => {
        console.log('Updating account...');
    };

    return (
        <StyledAccountWrapper component='article'>
            <Button type='button' variant='outlined' onClick={onUpdateAccount}>
                {capitalize(t('update account'))}
            </Button>
            <StyledProfile>
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
            </StyledProfile>
        </StyledAccountWrapper>
    );
};

export default Account;
