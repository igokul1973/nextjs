'use client';

import { useRightDrawerState } from '@/app/context/right-drawer/provider';
import { useI18n } from '@/locales/client';
import { Button, capitalize } from '@mui/material';
import { FC } from 'react';

const UpdateProviderButton: FC = () => {
    const t = useI18n();
    const { dispatch } = useRightDrawerState();
    const onUpdateProvider = () => {
        dispatch({
            type: 'open',
            payload: {
                childComponentName: 'providerForm'
            }
        });
    };

    return (
        <Button type='button' variant='outlined' onClick={onUpdateProvider}>
            {capitalize(t('update provider'))}
        </Button>
    );
};

export default UpdateProviderButton;
