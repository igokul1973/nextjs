// import SideNav from '@/app/ui/dashboard/sidenav';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { DrawerHeader } from '../ui/dashboard/leftmenu/DrawerHeader';
import LeftMenu from '../ui/dashboard/leftmenu/LeftMenu';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <LeftMenu />
            <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <div>{children}</div>
            </Box>
        </Box>
    );
}
