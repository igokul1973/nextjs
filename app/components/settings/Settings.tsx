'use client';

import { useRightDrawerState } from '@/app/context/right-drawer/provider';
import { useApp } from '@/app/context/user/provider';
import { useI18n } from '@/locales/client';
import { capitalize } from '@mui/material';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import { StyledSettings, StyledSettingsAttribute, StyledSettingsWrapper } from './styled';

const Settings: FC = () => {
    const {
        state: { settings: rawSettings }
    } = useApp();
    const t = useI18n();
    const { dispatch } = useRightDrawerState();

    const onUpdateSettings = () => {
        dispatch({
            type: 'open',
            payload: {
                childComponentName: 'settingsForm'
            }
        });
    };

    const settings = { ...rawSettings, salesTax: rawSettings.salesTax / 1000 };

    return (
        <>
            <Typography variant='subtitle1'>
                {capitalize(t('account settings description'))}.
            </Typography>
            <Typography variant='subtitle1'>{capitalize(t('hover to learn more'))}.</Typography>
            <StyledSettingsWrapper component='article'>
                <Button type='button' variant='outlined' onClick={onUpdateSettings}>
                    {capitalize(t('update settings'))}
                </Button>
                <StyledSettings>
                    <StyledSettingsAttribute>
                        <Typography variant='subtitle2'>{capitalize(t('date format'))}:</Typography>
                        <Typography variant='subtitle1'>{settings.dateFormat}</Typography>
                    </StyledSettingsAttribute>
                    <StyledSettingsAttribute>
                        <Typography variant='subtitle2'>
                            {capitalize(t('preferred provider invoice phone type'))}:
                        </Typography>
                        <Typography variant='subtitle1'>
                            {settings.providerInvoicePhoneType || t('not provided')}
                        </Typography>
                    </StyledSettingsAttribute>
                    <StyledSettingsAttribute>
                        <Typography variant='subtitle2'>
                            {capitalize(t('preferred provider invoice email type'))}:
                        </Typography>
                        <Typography variant='subtitle1'>
                            {settings.providerInvoiceEmailType || t('not provided')}
                        </Typography>
                    </StyledSettingsAttribute>
                    <StyledSettingsAttribute>
                        <Typography variant='subtitle2'>
                            {capitalize(t('delivery terms'))}:
                        </Typography>
                        <Typography variant='subtitle1'>
                            {settings.deliveryTerms || t('not provided')}
                        </Typography>
                    </StyledSettingsAttribute>
                    <StyledSettingsAttribute>
                        <Typography variant='subtitle2'>
                            {capitalize(t('payment terms'))}:
                        </Typography>
                        <Typography variant='subtitle1'>
                            {settings.paymentTerms || t('not provided')}
                        </Typography>
                    </StyledSettingsAttribute>
                    <StyledSettingsAttribute>
                        <Typography variant='subtitle2'>{capitalize(t('terms'))}:</Typography>
                        <Typography variant='subtitle1'>
                            {settings.terms || t('not provided')}
                        </Typography>
                    </StyledSettingsAttribute>
                    <Tooltip
                        title={capitalize(t('bank account/routing number/other means of payment'))}
                    >
                        <StyledSettingsAttribute>
                            <Typography variant='subtitle2'>
                                {capitalize(t('payment information'))}:
                            </Typography>
                            <Typography variant='subtitle1'>
                                {settings.paymentInformation || t('not provided')}
                            </Typography>
                        </StyledSettingsAttribute>
                    </Tooltip>
                    <StyledSettingsAttribute>
                        <Typography variant='subtitle2'>{capitalize(t('sales tax'))}:</Typography>
                        <Typography variant='subtitle1'>{settings.salesTax}%</Typography>
                    </StyledSettingsAttribute>
                    <Tooltip title={capitalize(t('display customer SSN or EIN tooltip'))}>
                        <StyledSettingsAttribute>
                            <Typography variant='subtitle2'>
                                {capitalize(t('display customer SSN or EIN'))}? :
                            </Typography>
                            <Typography variant='subtitle1'>
                                {settings.isDisplayCustomerLocalIdentifier ? t('yes') : t('no')}
                            </Typography>
                        </StyledSettingsAttribute>
                    </Tooltip>
                    <Tooltip title={capitalize(t('obfuscate customer SSN or EIN tooltip'))}>
                        <StyledSettingsAttribute>
                            <Typography variant='subtitle2'>
                                {capitalize(t('obfuscate customer SSN or EIN'))}? :
                            </Typography>
                            <Typography variant='subtitle1'>
                                {settings.isObfuscateCustomerLocalIdentifier ? t('yes') : t('no')}
                            </Typography>
                        </StyledSettingsAttribute>
                    </Tooltip>

                    <Tooltip title={capitalize(t('display your SSN or EIN tooltip'))}>
                        <StyledSettingsAttribute>
                            <Typography variant='subtitle2'>
                                {capitalize(t('display provider SSN or EIN'))}? :
                            </Typography>
                            <Typography variant='subtitle1'>
                                {settings.isDisplayProviderLocalIdentifier ? t('yes') : t('no')}
                            </Typography>
                        </StyledSettingsAttribute>
                    </Tooltip>
                    <Tooltip title={capitalize(t('obfuscate your SSN or EIN tooltip'))}>
                        <StyledSettingsAttribute>
                            <Typography variant='subtitle2'>
                                {capitalize(t('obfuscate provider SSN or EIN'))}? :
                            </Typography>
                            <Typography variant='subtitle1'>
                                {settings.isObfuscateProviderLocalIdentifier ? t('yes') : t('no')}
                            </Typography>
                        </StyledSettingsAttribute>
                    </Tooltip>
                </StyledSettings>
            </StyledSettingsWrapper>
        </>
    );
};

export default Settings;
