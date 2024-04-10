'use client';

import { useNavState } from '@/app/context/navigation/provider';
import { logOut } from '@/app/lib/data/users';
import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { MouseEvent, useState } from 'react';

const AccountNode = () => <h3>Account Panel</h3>;
const ProfileNode = () => <h3>Profile Panel</h3>;

export default function MenuAvatar() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const {
        state: { isOpen: isRightDrawerOpen },
        dispatch
    } = useNavState();
    const open = Boolean(anchorEl);
    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const openAccountPanel = (what: 'account' | 'profile') => {
        dispatch({
            type: isRightDrawerOpen ? 'close' : 'open',
            payload: {
                childComponent: isRightDrawerOpen ? null : what === 'account' ? (
                    <AccountNode />
                ) : (
                    <ProfileNode />
                )
            }
        });
        handleClose();
    };

    const onLogout = async () => {
        return logOut();
    };

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
                    <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id='account-menu'
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
                <MenuItem onClick={() => openAccountPanel('profile')}>
                    <Avatar /> Profile
                </MenuItem>
                <MenuItem onClick={() => openAccountPanel('account')}>
                    <Avatar /> My account
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Settings fontSize='small' />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem onClick={onLogout}>
                    {/* <IconButton sx={{ ml: 1 }} onClick={onLogout} color='inherit'>
                        <Logout />
                    </IconButton> */}
                    <ListItemIcon>
                        <Logout fontSize='small' />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
}
