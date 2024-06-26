'use client';

import CloseRightDrawerButton from '@/app/components/buttons/close/CloseButton';
import { useRightDrawerState } from '@/app/context/right-drawer/provider';
import { useI18n } from '@/locales/client';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import { DrawerHeader } from '../dashboard/navigation/styled';
import { components } from './constants';
import { StyledRightDrawer } from './styled';

const drawerWidth = 600;

const RightDrawer: FC = () => {
    const t = useI18n();
    const {
        state: { isOpen, childComponentName },
        dispatch
    } = useRightDrawerState();

    const title = childComponentName && components[childComponentName].title;
    const Component = childComponentName && components[childComponentName].component;
    const Icon = childComponentName && components[childComponentName].icon;

    return (
        <StyledRightDrawer
            sx={{
                '& .MuiDrawer-paper': {
                    width: drawerWidth
                }
            }}
            variant='temporary'
            anchor='right'
            open={isOpen}
            onClose={() =>
                dispatch({
                    type: 'close',
                    payload: { childComponentName: null }
                })
            }
        >
            <DrawerHeader />
            <Box className='drawer-content'>
                <CloseRightDrawerButton className='close-button' />
                {(Icon || title) && (
                    <Box className='drawer-heading'>
                        {Icon && <Icon color='primary' fontSize='large' />}
                        {title && (
                            <Typography variant='h2' className='drawer-title'>
                                {capitalize(t(title))}
                            </Typography>
                        )}
                    </Box>
                )}
                {Component && <Component />}
            </Box>
        </StyledRightDrawer>
    );
};

export default RightDrawer;
