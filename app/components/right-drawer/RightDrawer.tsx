'use client';

import CloseButton from '@/app/components/buttons/close/CloseButton';
import { useNavState } from '@/app/context/navigation/provider';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import { DrawerHeader } from '../dashboard/navigation/styled';
import { StyledRightDrawer } from './styled';

const drawerWidth = 550;

const RightDrawer: FC = () => {
    const {
        state: { isOpen, childComponent: Component, title, icon: Icon }
    } = useNavState();

    return (
        <StyledRightDrawer
            sx={{
                '& .MuiDrawer-paper': {
                    width: drawerWidth
                }
            }}
            variant='persistent'
            anchor='right'
            open={isOpen}
        >
            <DrawerHeader />
            <Box className='drawer-content'>
                <CloseButton className='close-button' />
                {(Icon || title) && (
                    <Box className='drawer-heading'>
                        {Icon && <Icon color='primary' fontSize='large' />}
                        {title && (
                            <Typography variant='h2' className='drawer-title'>
                                {capitalize(title)}
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
