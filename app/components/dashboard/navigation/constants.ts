import Home from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import PostAddOutlined from '@mui/icons-material/PostAddOutlined';
import { ILink } from './types';

export const drawerWidth = 240;

export const links = [
    { name: 'dashboard', href: '/dashboard', icon: Home },
    {
        name: 'invoices',
        href: '/dashboard/invoices',
        icon: PostAddOutlined
    },
    { name: 'customers', href: '/dashboard/customers', icon: PeopleOutlined },
    { name: 'inventory', href: '/dashboard/inventory', icon: InventoryIcon }
] satisfies ILink[];
