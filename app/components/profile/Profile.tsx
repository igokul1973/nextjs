'use client';

import { components } from '@/app/components/dashboard/avatar-menu/constants';
import Warning from '@/app/components/warning/Warning';
import { useRightDrawerState } from '@/app/context/right-drawer/provider';
import { useUser } from '@/app/context/user/provider';
import { useI18n } from '@/locales/client';
import { capitalize } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import { StyledProfile, StyledProfileAttribute, StyledProfileWrapper } from './styled';

const Profile: FC = () => {
    const {
        state: { profile }
    } = useUser();

    const t = useI18n();
    const { dispatch } = useRightDrawerState();

    if (!profile)
        return <Warning variant='h4'>The user has no profile. Please create one.</Warning>;

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

    return (
        <StyledProfileWrapper component='article'>
            <Button type='button' variant='outlined' onClick={onUpdateProfile}>
                {capitalize(t('update profile'))}
            </Button>
            <StyledProfile>
                {profile?.avatar && (
                    <StyledProfileAttribute>
                        <Typography variant='h6'>{capitalize(t('first name'))}:</Typography>
                        <Typography variant='body1'>{profile?.avatar}</Typography>
                    </StyledProfileAttribute>
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
