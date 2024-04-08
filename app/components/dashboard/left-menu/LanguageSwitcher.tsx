'use client';

import Language from '@mui/icons-material/Language';

import { useChangeLocale, useCurrentLocale } from '@/locales/client';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { MouseEvent, useState } from 'react';

export default function LanguageSwitcher() {
    const changeLocale = useChangeLocale();
    const currentLocale = useCurrentLocale();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const onSwitchLocale = (lang: 'en' | 'sv') => {
        changeLocale(lang);
        console.log('switched to lang: ', lang);
        handleClose();
    };

    return (
        <>
            <Tooltip title='Language selection'>
                <IconButton
                    onClick={handleClick}
                    color='inherit'
                    size='small'
                    aria-controls={open ? 'language-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Language sx={{ width: 28, height: 28 }}>M</Language>
                    {currentLocale}
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id='language-menu'
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0
                        }
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem
                    onClick={() => onSwitchLocale('en')}
                    sx={{ fontWeight: currentLocale === 'en' ? '700' : null }}
                >
                    English
                </MenuItem>
                <MenuItem
                    onClick={() => onSwitchLocale('sv')}
                    sx={{ fontWeight: currentLocale === 'sv' ? '700' : null }}
                >
                    Swedish
                </MenuItem>
            </Menu>
        </>
    );
}
