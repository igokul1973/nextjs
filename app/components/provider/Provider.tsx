import { useI18n } from '@/locales/client';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { EntitiesEnum } from '@prisma/client';
import { FC } from 'react';
import Warning from '../warning/Warning';
import { StyledProviderAttribute } from './styled';
import { IProps } from './types';

const Provider: FC<IProps> = ({ provider, providerType }) => {
    const t = useI18n();
    const providerEntity = provider && provider[providerType];

    if (!providerEntity) {
        return <Warning variant='body1'>No provider found. Please create one.</Warning>;
    }

    return (
        <Box component='article' sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <StyledProviderAttribute>
                <Typography variant='h6'>{capitalize(t('provider type'))}:</Typography>
                <Typography variant='body1'>{capitalize(t(providerType))}</Typography>
            </StyledProviderAttribute>
            <StyledProviderAttribute>
                <Typography variant='h6'>
                    {`${capitalize(t('provider'))} ${t('id').toLocaleUpperCase()}`}:
                </Typography>
                <Typography variant='body1'>{provider?.id}</Typography>
            </StyledProviderAttribute>
            {providerType === EntitiesEnum.organization && 'name' in providerEntity && (
                <>
                    <StyledProviderAttribute>
                        <Typography variant='h6'>{capitalize(t('name'))}:</Typography>
                        <Typography variant='body1'>{providerEntity.name}</Typography>
                    </StyledProviderAttribute>
                    {providerEntity.type && (
                        <StyledProviderAttribute>
                            <Typography variant='h6'>
                                {capitalize(t('organization type'))}:
                            </Typography>
                            <Typography variant='body1'>{providerEntity.type.type}</Typography>
                        </StyledProviderAttribute>
                    )}
                    <StyledProviderAttribute>
                        <Typography variant='h6'>{capitalize(t('is private'))}:</Typography>
                        <Typography variant='body1'>
                            {providerEntity.isPrivate ? capitalize(t('yes')) : capitalize(t('no'))}
                        </Typography>
                    </StyledProviderAttribute>
                    <StyledProviderAttribute>
                        <Typography variant='h6'>{capitalize(t('is charity'))}:</Typography>
                        <Typography variant='body1'>
                            {providerEntity?.isCharity ? capitalize(t('yes')) : capitalize(t('no'))}
                        </Typography>
                    </StyledProviderAttribute>
                </>
            )}
            {providerType === EntitiesEnum.individual && 'firstName' in providerEntity && (
                <>
                    <StyledProviderAttribute>
                        <Typography variant='h6'>{capitalize(t('first name'))}:</Typography>
                        <Typography variant='body1'>{providerEntity.firstName}</Typography>
                    </StyledProviderAttribute>
                    <StyledProviderAttribute>
                        <Typography variant='h6'>{capitalize(t('last name'))}:</Typography>
                        <Typography variant='body1'>{providerEntity.lastName}</Typography>
                    </StyledProviderAttribute>
                    {providerEntity.middleName && (
                        <StyledProviderAttribute>
                            <Typography variant='h6'>{capitalize(t('middle name'))}:</Typography>
                            <Typography variant='body1'>{providerEntity.middleName}</Typography>
                        </StyledProviderAttribute>
                    )}
                </>
            )}
            {providerEntity.localIdentifierName && (
                <StyledProviderAttribute>
                    <Typography variant='h6'>{providerEntity.localIdentifierName.name}:</Typography>
                    <Typography variant='body1'>{providerEntity.localIdentifierValue}</Typography>
                </StyledProviderAttribute>
            )}
            {/* Address */}
            <Typography variant='h6' color='secondary.main'>
                {capitalize(t('address'))}
            </Typography>
            <StyledProviderAttribute>
                <Typography variant='h6'>{capitalize(t('street address'))}:</Typography>
                <Typography variant='body1'>{providerEntity.address.addressLine1}</Typography>
            </StyledProviderAttribute>
            {providerEntity.address.addressLine2 && (
                <StyledProviderAttribute>
                    <Typography variant='h6'>{capitalize(t('address (line 2)'))}:</Typography>
                    <Typography variant='body1'>{providerEntity.address.addressLine2}</Typography>
                </StyledProviderAttribute>
            )}
            {providerEntity.address.addressLine3 && (
                <StyledProviderAttribute>
                    <Typography variant='h6'>{capitalize(t('address (line 3)'))}:</Typography>
                    <Typography variant='body1'>{providerEntity.address.addressLine3}</Typography>
                </StyledProviderAttribute>
            )}
            <StyledProviderAttribute>
                <Typography variant='h6'>{capitalize(t('locality'))}:</Typography>
                <Typography variant='body1'>{providerEntity.address.locality}</Typography>
            </StyledProviderAttribute>
            {providerEntity.address.region && (
                <StyledProviderAttribute>
                    <Typography variant='h6'>{capitalize(t('region'))}:</Typography>
                    <Typography variant='body1'>{providerEntity.address.region}</Typography>
                </StyledProviderAttribute>
            )}
            <StyledProviderAttribute>
                <Typography variant='h6'>{capitalize(t('postal code'))}:</Typography>
                <Typography variant='body1'>{providerEntity.address.postcode}</Typography>
            </StyledProviderAttribute>
            <StyledProviderAttribute>
                <Typography variant='h6'>{capitalize(t('country'))}:</Typography>
                <Typography variant='body1'>{providerEntity.address.country.name}</Typography>
            </StyledProviderAttribute>
            {/* Phones */}
            <Typography variant='h6' color='secondary.main'>
                {capitalize(t('phones'))}
            </Typography>
            {providerEntity.phones.map((phone) => (
                <StyledProviderAttribute key={phone.id}>
                    <Typography variant='h6'>{phone.type}:</Typography>
                    <Typography variant='body1'>
                        +{phone.countryCode}-{phone.number}
                    </Typography>
                </StyledProviderAttribute>
            ))}
            {/* Emails */}
            <Typography variant='h6' color='secondary.main'>
                {capitalize(t('email addresses'))}
            </Typography>
            {providerEntity.emails.map((email) => (
                <StyledProviderAttribute key={email.id}>
                    <Typography variant='h6'>{email.type}:</Typography>
                    <Typography variant='body1'>{email.email}</Typography>
                </StyledProviderAttribute>
            ))}
        </Box>
    );
};

export default Provider;
