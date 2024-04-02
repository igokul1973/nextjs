'use client';

import ColorModeContext from '@/app/components/theme-registry/ColorModeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Home from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
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
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { AppBar } from './AppBar';
import { Drawer } from './Drawer';
import { DrawerHeader } from './DrawerHeader';

2;
const links = [
    { name: 'Home', href: '/dashboard', icon: Home },
    {
        name: 'Invoices',
        href: '/dashboard/invoices',
        icon: PostAddOutlined
    },
    { name: 'Customers', href: '/dashboard/customers', icon: PeopleOutlined }
];

const DynamicIcon = ({ name }: { name: string }) => {
    const Component = links.find((l) => l.name === name)!.icon;

    return <Component />;
};

export default function LeftMenu() {
    const theme = useTheme();
    const { toggleColorMode } = useContext(ColorModeContext);
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position='fixed' open={open}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        onClick={handleDrawerOpen}
                        edge='start'
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' })
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant='h6' noWrap component='div'>
                        InvoiceMe.biz
                    </Typography>
                    <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color='inherit'>
                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Toolbar>
            </AppBar>
            <aside>
                <Drawer variant='permanent' component={'aside'} open={open}>
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
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
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <DynamicIcon name={link.name} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={link.name}
                                        sx={{ opacity: open ? 1 : 0 }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </aside>
        </Box>
    );
}
