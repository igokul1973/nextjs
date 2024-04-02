// import SideNav from '@/app/ui/dashboard/sidenav';
import Box from '@mui/material/Box';
import { DrawerHeader } from '../components/dashboard/leftmenu/DrawerHeader';
import LeftMenu from '../components/dashboard/leftmenu/LeftMenu';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ display: 'flex' }}>
            <LeftMenu />
            <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {children}
            </Box>
        </Box>
    );
}
