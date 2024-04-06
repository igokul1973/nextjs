// import SideNav from '@/app/ui/dashboard/sidenav';
import { auth } from '@/auth';
import Box from '@mui/material/Box';
import { DrawerHeader } from '../components/dashboard/leftmenu/DrawerHeader';
import LeftMenu from '../components/dashboard/leftmenu/LeftMenu';
import { TGetUserPayload } from '../lib/data/users/types';
import { getUserProvider } from '../lib/utils';

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (!session) return <div>Not logged in</div>;
    const provider = await getUserProvider<
        TGetUserPayload['account']['individuals'][0],
        TGetUserPayload['account']['organizations'][0]
    >(session.user);
    return (
        <Box sx={{ display: 'flex' }}>
            <LeftMenu provider={provider} />
            <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {children}
            </Box>
        </Box>
    );
}
