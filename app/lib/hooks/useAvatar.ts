import { useEffect, useState } from 'react';
import { TGetUserWithRelationsPayload } from '../data/user/types';

export const useAvatar = (profile?: TGetUserWithRelationsPayload['profile'] | null) => {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        if (profile && profile.avatar) {
            const avatarFile =
                profile.avatar === null
                    ? null
                    : new File([Buffer.from(profile.avatar.data)], profile.avatar.name, {
                          type: profile.avatar.type
                      });
            const avatarUrl = avatarFile && URL.createObjectURL(avatarFile);

            setAvatarUrl(avatarUrl);
            return () => {
                avatarUrl && URL.revokeObjectURL(avatarUrl);
            };
        } else {
            setAvatarUrl(null);
        }
    }, [profile]);

    return [avatarUrl];
};
