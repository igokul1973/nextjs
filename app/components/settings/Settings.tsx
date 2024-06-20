'use client';

import { useRightDrawerState } from '@/app/context/right-drawer/provider';
import { useUser } from '@/app/context/user/provider';
import { useI18n } from '@/locales/client';
import { Button, capitalize } from '@mui/material';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import Warning from '../warning/Warning';
import { StyledSettings, StyledSettingsAttribute, StyledSettingsWrapper } from './styled';

const Settings: FC = () => {
    const {
        state: { settings }
    } = useUser();
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
    return !settings ? (
        <Warning variant='h4'>Settings are not provided</Warning>
    ) : (
        <StyledSettingsWrapper component='article'>
            <Button type='button' variant='outlined' onClick={onUpdateSettings}>
                {capitalize(t('update settings'))}
            </Button>
            <StyledSettings>
                <StyledSettingsAttribute>
                    <Typography variant='h6'>{capitalize(t('date format'))}:</Typography>
                    <Typography variant='body1'>{settings.dateFormat}</Typography>
                </StyledSettingsAttribute>
                <StyledSettingsAttribute>
                    <Typography variant='h6'>{capitalize(t('delivery terms'))}:</Typography>
                    <Typography variant='body1'>{settings.deliveryTerms ? 'Yes' : 'No'}</Typography>
                </StyledSettingsAttribute>
                <StyledSettingsAttribute>
                    <Typography variant='h6'>
                        {capitalize(t('display customer local identifier'))}? :
                    </Typography>
                    <Typography variant='body1'>
                        {settings.isDisplayCustomerLocalIdentifier}
                    </Typography>
                </StyledSettingsAttribute>
            </StyledSettings>
        </StyledSettingsWrapper>
    );
};

export default Settings;
