import Account from '@/app/components/account/Account';
import Profile from '@/app/components/profile/Profile';
import ProfileForm from '@/app/components/profile/form/ProfileForm';
import Settings from '@/app/components/settings/Settings';
import AccountIcon from '@mui/icons-material/AccountCircleOutlined';
import ProfileIcon from '@mui/icons-material/PersonOutlineOutlined';
import SettingsIconOutlined from '@mui/icons-material/SettingsOutlined';
import { FC } from 'react';
import ProviderForm from '../../account/form/AccountForm';
import { TComponents } from './types';

export const components: TComponents = {
    account: {
        title: 'account',
        icon: AccountIcon,
        component: Account as FC
    },
    updateProvider: {
        title: 'update provider',
        icon: AccountIcon,
        component: ProviderForm
    },
    profile: {
        title: 'user profile',
        icon: ProfileIcon,
        component: Profile
    },
    updateProfile: {
        title: 'update user profile',
        icon: ProfileIcon,
        component: ProfileForm
    },
    settings: {
        title: 'account settings',
        icon: SettingsIconOutlined,
        component: Settings
    }
};
