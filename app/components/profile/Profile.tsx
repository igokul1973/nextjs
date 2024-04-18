'use client';

import { useUser } from '@/app/context/user/provider';
import { useI18n } from '@/locales/client';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import { StyledProfileAttribute } from './styled';

const Profile: FC = () => {
    const { profile } = useUser();
    const t = useI18n();

    return (
        <Box component='article'>
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
        </Box>
    );
};

export default Profile;
