import Account from '@/app/components/account/Account';
import Profile from '@/app/components/profile/Profile';
import ProfileForm from '@/app/components/profile/form/ProfileForm';
import Settings from '@/app/components/settings/Settings';
import AccountIcon from '@mui/icons-material/AccountCircleOutlined';
import ProfileIcon from '@mui/icons-material/PersonOutlineOutlined';
import SettingsIconOutlined from '@mui/icons-material/SettingsOutlined';
import ProviderForm from '@/app/components/account/form/AccountForm';
import { TComponents } from './types';
import { FC } from 'react';

export const components: TComponents = {
    account: {
        title: 'account',
        component: Account as FC,
        icon: AccountIcon
    },
    providerForm: {
        title: 'update provider',
        component: ProviderForm,
        icon: AccountIcon
    },
    profile: {
        title: 'user profile',
        component: Profile,
        icon: ProfileIcon
    },
    profileForm: {
        title: 'update user profile',
        component: ProfileForm,
        icon: ProfileIcon
    },
    settings: {
        title: 'account settings',
        component: Settings,
        icon: SettingsIconOutlined
    }
};
