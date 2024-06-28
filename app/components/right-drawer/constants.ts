import Account from '@/app/components/account/Account';
import UpdateProviderForm from '@/app/components/account/form/UpdateProviderForm';
import Profile from '@/app/components/profile/Profile';
import UpdateProfileForm from '@/app/components/profile/form/UpdateProfileForm';
import Settings from '@/app/components/settings/Settings';
import UpdateSettingsForm from '@/app/components/settings/form/UpdateSettingsForm';
import AccountIcon from '@mui/icons-material/AccountCircleOutlined';
import ProfileIcon from '@mui/icons-material/PersonOutlineOutlined';
import SettingsIconOutlined from '@mui/icons-material/SettingsOutlined';
import { FC } from 'react';
import { TComponents } from './types';

export const components: TComponents = {
    account: {
        title: 'account',
        component: Account as FC,
        icon: AccountIcon
    },
    providerForm: {
        title: 'update provider',
        component: UpdateProviderForm,
        icon: AccountIcon
    },
    profile: {
        title: 'user profile',
        component: Profile,
        icon: ProfileIcon
    },
    profileForm: {
        title: 'update user profile',
        component: UpdateProfileForm,
        icon: ProfileIcon
    },
    settings: {
        title: 'account settings',
        component: Settings,
        icon: SettingsIconOutlined
    },
    settingsForm: {
        title: 'update account settings',
        component: UpdateSettingsForm,
        icon: SettingsIconOutlined
    }
};
