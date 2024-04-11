import Account from '@/app/components/account/Account';
import Settings from '@/app/components/settings/Settings';
import AccountIcon from '@mui/icons-material/AccountCircleOutlined';
import ProfileIcon from '@mui/icons-material/PersonOutlineOutlined';
import SettingsIconOutlined from '@mui/icons-material/SettingsOutlined';
import { TComponents } from './types';
import Profile from '@/app/components/profile/Profile';

export const components: TComponents = {
    account: {
        title: 'account',
        icon: AccountIcon,
        component: Account
    },
    profile: {
        title: 'user profile',
        icon: ProfileIcon,
        component: Profile
    },
    settings: {
        title: 'account settings',
        icon: SettingsIconOutlined,
        component: Settings
    }
};
