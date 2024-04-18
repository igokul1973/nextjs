'use client';

import { useUser } from '@/app/context/user/provider';
import { useI18n } from '@/locales/client';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Home from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import PostAddOutlined from '@mui/icons-material/PostAddOutlined';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import { capitalize } from '@mui/material/utils';
import Link from 'next/link';
import { FC, useState } from 'react';
import { AppBar } from '../app-bar/AppBar';
import { Drawer, DrawerHeader } from './styled';
import { ILink } from './types';

const links = [
    { name: 'dashboard', href: '/dashboard', icon: Home },
    {
        name: 'invoices',
        href: '/dashboard/invoices',
        icon: PostAddOutlined
    },
    { name: 'customers', href: '/dashboard/customers', icon: PeopleOutlined },
    { name: 'inventory', href: '/dashboard/inventory', icon: InventoryIcon }
] satisfies ILink[];

const DynamicIcon = ({ name }: { name: string }) => {
    const Component = links.find((l) => l.name === name)!.icon;

    return <Component />;
};

const Navigation: FC = () => {
    const theme = useTheme();
    const t = useI18n();

    const [isOpen, setIsOpen] = useState(true);
    const { provider } = useUser();
    const isProvider = !!provider;

    const handleDrawerToggle = (isOpen: boolean) => {
        setIsOpen(isOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar handleDrawerToggle={handleDrawerToggle} isOpen={isOpen} />
            {isProvider && (
                <Box component='aside'>
                    <Drawer variant='permanent' open={isOpen}>
                        <DrawerHeader>
                            <IconButton onClick={() => handleDrawerToggle(false)}>
                                {theme.direction === 'rtl' ? (
                                    <ChevronRightIcon />
                                ) : (
                                    <ChevronLeftIcon />
                                )}
                            </IconButton>
                        </DrawerHeader>
                        <Divider />
                        <List component='nav'>
                            {links.map((link, index) => (
                                <ListItem key={link.name} disablePadding sx={{ display: 'block' }}>
                                    <ListItemButton
                                        LinkComponent={Link}
                                        key={index}
                                        href={link.href}
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: isOpen ? 'initial' : 'center',
                                            px: 2.5
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: isOpen ? 3 : 'auto',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <DynamicIcon name={link.name} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={capitalize(t(link.name))}
                                            sx={{ opacity: isOpen ? 1 : 0 }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Drawer>
                </Box>
            )}
        </Box>
    );
};

export default Navigation;