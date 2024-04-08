'use client';

import ColorModeContext from '@/app/components/theme-registry/ColorModeContext';
import { TGetUserPayload } from '@/app/lib/data/users/types';
import { TEntities } from '@/app/lib/definitions';
import { getIndividualFullNameString } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Home from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
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
import { capitalize } from '@mui/material/utils';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { AppBar } from './AppBar';
import { Drawer } from './Drawer';
import { DrawerHeader } from './DrawerHeader';
import LanguageSwitcher from './LanguageSwitcher';
import MenuAvatar from './MenuAvatar';
import { ILink } from './types';

const links = [
    { name: 'home', href: '/dashboard', icon: Home },
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

interface IProps {
    provider: TEntities<
        TGetUserPayload['account']['individuals'][0],
        TGetUserPayload['account']['organizations'][0]
    >;
}

export default function LeftMenu({ provider: { individual, organization } }: IProps) {
    const theme = useTheme();
    const t = useI18n();
    // const currentLocale = useCurrentLocale();
    const { toggleColorMode } = useContext(ColorModeContext);
    const [open, setOpen] = useState(false);

    const isProviderIndividual = individual && !organization;
    const isProviderOrg = !individual && organization;
    const providerName = isProviderIndividual
        ? getIndividualFullNameString(individual)
        : isProviderOrg
          ? organization?.name
          : 'No provider name';

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
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                        <Typography variant='h5' noWrap component='div'>
                            InvoiceMe | {providerName}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: '1.5rem;' }}>
                        {/* <Typography>{capitalize(currentLocale)}</Typography> */}
                        <IconButton onClick={toggleColorMode} color='inherit'>
                            {theme.palette.mode === 'dark' ? (
                                <Brightness7Icon />
                            ) : (
                                <Brightness4Icon />
                            )}
                        </IconButton>
                        <LanguageSwitcher />
                        <MenuAvatar />
                    </Box>
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
                                        primary={capitalize(t(link.name))}
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
