'use client';

import { getUserProfile } from '@/app/lib/data/profile';
import { TProfile } from '@/app/lib/types';
import { auth } from '@/auth';
import { useI18n } from '@/locales/client';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FC, useEffect, useState } from 'react';
import Loading from '../loading/Loading';
import { StyledProfileAttribute } from './styled';

const Profile: FC = () => {
    const [profile, setProfile] = useState<TProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const t = useI18n();
    useEffect(() => {
        const getUP = async () => {
            const session = await auth();
            if (session) {
                const profile = await getUserProfile(session?.user.id);
                if (profile) {
                    setProfile(profile);
                }
                setIsLoading(false);
            }
        };
        getUP();
    }, []);
    return (
        <Box component='article'>
            {isLoading ? (
                <Box sx={{ height: '30vh' }}>
                    <Loading />
                </Box>
            ) : (
                <>
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
                </>
            )}
        </Box>
    );
};

export default Profile;
