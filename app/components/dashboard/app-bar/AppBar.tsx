'use client';

import ColorModeContext from '@/app/context/color-mode/provider';
import { useUser } from '@/app/context/user/provider';
import { getProviderName } from '@/app/lib/utils';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { FC, useContext, useEffect, useState } from 'react';
import LanguageSwitcher from '../../language-switcher/LanguageSwitcher';
import AvatarMenu from '../avatar-menu/AvatarMenu';
import { StyledAppBar } from './styled';
import { IProps } from './types';

export const AppBar: FC<IProps> = ({ isOpen, handleDrawerToggle }) => {
    const theme = useTheme();
    const { toggleColorMode } = useContext(ColorModeContext);

    const {
        state: { provider, profile }
    } = useUser();

    const providerName = getProviderName(provider);

    return (
        <StyledAppBar position='fixed' open={isOpen}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        onClick={() => handleDrawerToggle(true)}
                        edge='start'
                        sx={{
                            marginRight: 5,
                            ...(isOpen && { display: 'none' })
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant='h5' noWrap component='div'>
                        InvoiceMe | {providerName}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: '1.5rem;' }}>
                    <IconButton onClick={toggleColorMode} color='inherit'>
                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                    <LanguageSwitcher />
                    <AvatarMenu />
                </Box>
            </Toolbar>
        </StyledAppBar>
    );
};
