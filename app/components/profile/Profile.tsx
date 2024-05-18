'use client';

import { components } from '@/app/components/dashboard/avatar-menu/constants';
import Warning from '@/app/components/warning/Warning';
import { useRightDrawerState } from '@/app/context/right-drawer/provider';
import { useUser } from '@/app/context/user/provider';
import { useAvatar } from '@/app/lib/hooks/useAvatar';
import { useI18n } from '@/locales/client';
import { Box, capitalize } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { FC } from 'react';
import {
    StyledProfile,
    StyledProfileAttribute,
    StyledProfileAttributeAlignTop,
    StyledProfileWrapper
} from './styled';

const Profile: FC = () => {
    const {
        state: { profile }
    } = useUser();

    const t = useI18n();
    const { dispatch } = useRightDrawerState();

    const onUpdateProfile = () => {
        const { component, title, icon } = components.updateProfile;
        dispatch({
            type: 'open',
            payload: {
                childComponent: component,
                title: capitalize(t(title)),
                icon
            }
        });
    };

    const [avatarUrl] = useAvatar(profile);

    if (!profile)
        return <Warning variant='h4'>The user has no profile. Please create one.</Warning>;

    return (
        <StyledProfileWrapper component='article'>
            <Button type='button' variant='outlined' onClick={onUpdateProfile}>
                {capitalize(t('update profile'))}
            </Button>
            <StyledProfile>
                {avatarUrl && (
                    <StyledProfileAttributeAlignTop>
                        <Typography variant='h6'>{capitalize(t('avatar'))}:</Typography>
                        <Box sx={{ width: '100px', position: 'relative', aspectRatio: '1/1' }}>
                            <Image src={avatarUrl} fill alt='Picture of the author' />
                        </Box>
                    </StyledProfileAttributeAlignTop>
                )}
                <StyledProfileAttribute>
                    <Typography variant='h6'>{capitalize(t('first name'))}:</Typography>
                    <Typography variant='body1'>{profile?.firstName}</Typography>
                </StyledProfileAttribute>
                <StyledProfileAttribute>
                    <Typography variant='h6'>{capitalize(t('last name'))}:</Typography>
                    <Typography variant='body1'>{profile?.lastName}</Typography>
                </StyledProfileAttribute>
                {profile?.middleName && (
                    <StyledProfileAttribute>
                        <Typography variant='h6'>{capitalize(t('middle name'))}:</Typography>
                        <Typography variant='body1'>{profile?.middleName}</Typography>
                    </StyledProfileAttribute>
                )}
            </StyledProfile>
        </StyledProfileWrapper>
    );
};

export default Profile;
