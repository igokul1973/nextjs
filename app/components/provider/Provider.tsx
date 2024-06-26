'use client';

import { useI18n } from '@/locales/client';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { EntitiesEnum } from '@prisma/client';
import { FC } from 'react';
import { StyledProviderAttribute, StyledProviderAttributeLogo } from './styled';
import { IProps } from './types';

const Provider: FC<IProps> = ({ provider, providerType }) => {
    const t = useI18n();
    const logoUrl = provider.logo?.url;

    return (
        <Box component='article' sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <StyledProviderAttributeLogo>
                <Typography variant='subtitle2'>{capitalize(t('logo'))}:</Typography>
                {logoUrl ? (
                    <Box
                        sx={{
                            height: '50px',
                            width: '100%'
                        }}
                    >
                        <Box
                            component='img'
                            src={logoUrl}
                            alt='Logo'
                            sx={{
                                height: '100%',
                                objectFit: 'contain'
                            }}
                        />
                    </Box>
                ) : (
                    <Typography variant='subtitle1'>{capitalize(t('no logo provided'))}</Typography>
                )}
            </StyledProviderAttributeLogo>
            <StyledProviderAttribute>
                <Typography variant='subtitle2'>{capitalize(t('provider type'))}:</Typography>
                <Typography variant='subtitle1'>{capitalize(t(providerType))}</Typography>
            </StyledProviderAttribute>
            <StyledProviderAttribute>
                <Typography variant='subtitle2'>
                    {`${capitalize(t('provider'))} ${t('id').toLocaleUpperCase()}`}:
                </Typography>
                <Typography variant='subtitle1'>{provider.id}</Typography>
            </StyledProviderAttribute>
            {providerType === EntitiesEnum.organization && 'name' in provider && (
                <>
                    <StyledProviderAttribute>
                        <Typography variant='subtitle2'>{capitalize(t('name'))}:</Typography>
                        <Typography variant='subtitle1'>{provider.name}</Typography>
                    </StyledProviderAttribute>
                    {provider.type && (
                        <StyledProviderAttribute>
                            <Typography variant='subtitle2'>
                                {capitalize(t('organization type'))}:
                            </Typography>
                            <Typography variant='subtitle1'>{provider.type.type}</Typography>
                        </StyledProviderAttribute>
                    )}
                    <StyledProviderAttribute>
                        <Typography variant='subtitle2'>{capitalize(t('is private'))}:</Typography>
                        <Typography variant='subtitle1'>
                            {provider.isPrivate ? capitalize(t('yes')) : capitalize(t('no'))}
                        </Typography>
                    </StyledProviderAttribute>
                    <StyledProviderAttribute>
                        <Typography variant='subtitle2'>{capitalize(t('is charity'))}:</Typography>
                        <Typography variant='subtitle1'>
                            {provider.isCharity ? capitalize(t('yes')) : capitalize(t('no'))}
                        </Typography>
                    </StyledProviderAttribute>
                </>
            )}
            {providerType === EntitiesEnum.individual && 'firstName' in provider && (
                <>
                    <StyledProviderAttribute>
                        <Typography variant='subtitle2'>{capitalize(t('first name'))}:</Typography>
                        <Typography variant='subtitle1'>{provider.firstName}</Typography>
                    </StyledProviderAttribute>
                    <StyledProviderAttribute>
                        <Typography variant='subtitle2'>{capitalize(t('last name'))}:</Typography>
                        <Typography variant='subtitle1'>{provider.lastName}</Typography>
                    </StyledProviderAttribute>
                    {provider.middleName && (
                        <StyledProviderAttribute>
                            <Typography variant='subtitle2'>
                                {capitalize(t('middle name'))}:
                            </Typography>
                            <Typography variant='subtitle1'>{provider.middleName}</Typography>
                        </StyledProviderAttribute>
                    )}
                </>
            )}
            {provider.localIdentifierName && (
                <StyledProviderAttribute>
                    <Typography variant='subtitle2'>
                        {provider.localIdentifierName.name}:
                    </Typography>
                    <Typography variant='subtitle1'>{provider.localIdentifierValue}</Typography>
                </StyledProviderAttribute>
            )}
            {/* Address */}
            <Typography variant='subtitle1' color='secondary.main'>
                {capitalize(t('address'))}
            </Typography>
            <StyledProviderAttribute>
                <Typography variant='subtitle2'>{capitalize(t('street address'))}:</Typography>
                <Typography variant='subtitle1'>{provider.address.addressLine1}</Typography>
            </StyledProviderAttribute>
            {provider.address.addressLine2 && (
                <StyledProviderAttribute>
                    <Typography variant='subtitle2'>
                        {capitalize(t('address (line 2)'))}:
                    </Typography>
                    <Typography variant='subtitle1'>{provider.address.addressLine2}</Typography>
                </StyledProviderAttribute>
            )}
            {provider.address.addressLine3 && (
                <StyledProviderAttribute>
                    <Typography variant='subtitle2'>
                        {capitalize(t('address (line 3)'))}:
                    </Typography>
                    <Typography variant='subtitle1'>{provider.address.addressLine3}</Typography>
                </StyledProviderAttribute>
            )}
            <StyledProviderAttribute>
                <Typography variant='subtitle2'>{capitalize(t('locality'))}:</Typography>
                <Typography variant='subtitle1'>{provider.address.locality}</Typography>
            </StyledProviderAttribute>
            {provider.address.region && (
                <StyledProviderAttribute>
                    <Typography variant='subtitle2'>{capitalize(t('region'))}:</Typography>
                    <Typography variant='subtitle1'>{provider.address.region}</Typography>
                </StyledProviderAttribute>
            )}
            <StyledProviderAttribute>
                <Typography variant='subtitle2'>{capitalize(t('postal code'))}:</Typography>
                <Typography variant='subtitle1'>{provider.address.postcode}</Typography>
            </StyledProviderAttribute>
            <StyledProviderAttribute>
                <Typography variant='subtitle2'>{capitalize(t('country'))}:</Typography>
                <Typography variant='subtitle1'>{provider.address.country.name}</Typography>
            </StyledProviderAttribute>
            {/* Phones */}
            <Typography variant='subtitle1' color='secondary.main'>
                {capitalize(t('phones'))}
            </Typography>
            {provider.phones.map((phone) => (
                <StyledProviderAttribute key={phone.id}>
                    <Typography variant='subtitle2'>{phone.type}:</Typography>
                    <Typography variant='subtitle1'>
                        +{phone.countryCode}-{phone.number}
                    </Typography>
                </StyledProviderAttribute>
            ))}
            {/* Emails */}
            <Typography variant='subtitle1' color='secondary.main'>
                {capitalize(t('email addresses'))}
            </Typography>
            {provider.emails.map((email) => (
                <StyledProviderAttribute key={email.id}>
                    <Typography variant='subtitle2'>{email.type}:</Typography>
                    <Typography variant='subtitle1'>{email.email}</Typography>
                </StyledProviderAttribute>
            ))}
        </Box>
    );
};

export default Provider;
