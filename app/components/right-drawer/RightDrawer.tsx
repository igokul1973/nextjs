'use client';

import { useNavState } from '@/app/context/navigation/provider';
import Close from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import { DrawerHeader } from '../dashboard/navigation/styled';
import { StyledRightDrawer } from './styled';

const drawerWidth = 500;

const RightDrawer: FC = () => {
    const {
        state: { isOpen, childComponent },
        dispatch
    } = useNavState();

    return (
        <StyledRightDrawer sx={{ display: 'flex', padding: '2rem' }}>
            <Drawer
                sx={{
                    padding: '2rem',
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth
                    }
                }}
                variant='persistent'
                anchor='right'
                open={isOpen}
            >
                <DrawerHeader />
                <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant='h2'>Right drawer</Typography>
                        <IconButton
                            onClick={() =>
                                dispatch({ payload: { childComponent: null }, type: 'close' })
                            }
                        >
                            <Close />
                        </IconButton>
                    </Box>
                    {childComponent}
                </Box>
            </Drawer>
        </StyledRightDrawer>
    );
};

export default RightDrawer;
