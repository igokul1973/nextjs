'use client';

import { useRightDrawerState } from '@/app/context/right-drawer/provider';
import { useUser } from '@/app/context/user/provider';
import { logOut } from '@/app/lib/data/user/actions';
import { useAvatar } from '@/app/lib/hooks/useAvatar';
import { useI18n } from '@/locales/client';
import AccountIcon from '@mui/icons-material/AccountBalance';
import Logout from '@mui/icons-material/Logout';
import ProfileIcon from '@mui/icons-material/PersonOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import { capitalize } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Image from 'next/image';
import { FC, MouseEvent, useState } from 'react';
import { components } from './constants';
import { TComponentName } from './types';

const AvatarMenu: FC = () => {
    const t = useI18n();
    const {
        state: { profile: userProfile }
    } = useUser();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { dispatch } = useRightDrawerState();
    const open = Boolean(anchorEl);

    const [avatarUrl] = useAvatar(userProfile);

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const openRightPanel = (componentName: TComponentName) => {
        const { component, title, icon } = components[componentName];
        dispatch({
            type: 'open',
            payload: {
                childComponent: component,
                title: capitalize(t(title)),
                icon
            }
        });
        handleClose();
    };

    const onLogout = async () => {
        return logOut();
    };

    // FIXME: if there is no user profile, a system must be
    // devised to create one, by probably redirecting to a
    // registration page.
    const userInitials =
        capitalize(userProfile?.firstName.slice(0, 1) || '') +
        capitalize(userProfile?.lastName.slice(0, 1) || '');

    return (
        <>
            <Tooltip title='Account settings'>
                <IconButton
                    onClick={handleClick}
                    size='small'
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar sx={{ width: 32, height: 32 }}>
                        {avatarUrl ? (
                            <Image src={avatarUrl} fill alt='User avatar' />
                        ) : (
                            userInitials
                        )}
                    </Avatar>
                    {/* <Avatar sx={{ width: 32, height: 32 }}>M</Avatar> */}
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id='account-menu'
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
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
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => openRightPanel('profile')}>
                    <ListItemIcon>
                        <ProfileIcon />
                    </ListItemIcon>
                    {capitalize(t('user profile'))}
                </MenuItem>
                <MenuItem onClick={() => openRightPanel('account')}>
                    <ListItemIcon>
                        <AccountIcon />
                    </ListItemIcon>
                    {capitalize(t('my account'))}
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => openRightPanel('settings')}>
                    <ListItemIcon>
                        <SettingsIcon fontSize='small' />
                    </ListItemIcon>
                    {capitalize(t('settings'))}
                </MenuItem>
                <MenuItem onClick={onLogout}>
                    <ListItemIcon>
                        <Logout fontSize='small' />
                    </ListItemIcon>
                    {capitalize(t('log out'))}
                </MenuItem>
            </Menu>
        </>
    );
};

export default AvatarMenu;
