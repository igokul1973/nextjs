'use client';

import { components } from '@/app/components/dashboard/avatar-menu/constants';
import { useRightDrawerState } from '@/app/context/right-drawer/provider';
import { useI18n } from '@/locales/client';
import { Button, capitalize } from '@mui/material';
import { FC } from 'react';

const UpdateProviderButton: FC = () => {
    const t = useI18n();
    const { dispatch } = useRightDrawerState();
    const onUpdateProvider = () => {
        const { component, title, icon } = components.updateProvider;
        dispatch({
            type: 'open',
            payload: {
                childComponent: component,
                title: capitalize(t(title)),
                icon
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
