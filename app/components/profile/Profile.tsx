'use client';

import Warning from '@/app/components/warning/Warning';
import { useRightDrawerState } from '@/app/context/right-drawer/provider';
import { useUser } from '@/app/context/user/provider';
import { useI18n } from '@/locales/client';
import { Box, capitalize } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
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
        dispatch({
            type: 'open',
            payload: {
                childComponentName: 'profileForm'
            }
        });
    };

    const avatarUrl = profile?.avatar?.url;

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
                        <Typography variant='subtitle2'>{capitalize(t('avatar'))}:</Typography>
                        <Box
                            sx={{
                                height: '80px',
                                width: '100%'
                            }}
                        >
                            <Box
                                component='img'
                                src={avatarUrl}
                                alt='User profile avatar'
                                sx={{
                                    height: '100%',
                                    objectFit: 'contain'
                                }}
                            />
                        </Box>
                    </StyledProfileAttributeAlignTop>
                )}
                <StyledProfileAttribute>
                    <Typography variant='subtitle2'>{capitalize(t('first name'))}:</Typography>
                    <Typography variant='subtitle1'>{profile?.firstName}</Typography>
                </StyledProfileAttribute>
                <StyledProfileAttribute>
                    <Typography variant='subtitle2'>{capitalize(t('last name'))}:</Typography>
                    <Typography variant='subtitle1'>{profile?.lastName}</Typography>
                </StyledProfileAttribute>
                {profile?.middleName && (
                    <StyledProfileAttribute>
                        <Typography variant='subtitle2'>{capitalize(t('middle name'))}:</Typography>
                        <Typography variant='subtitle1'>{profile?.middleName}</Typography>
                    </StyledProfileAttribute>
                )}
            </StyledProfile>
        </StyledProfileWrapper>
    );
};

export default Profile;
