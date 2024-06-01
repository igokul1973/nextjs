import { useEffect, useState } from 'react';
import { TEntity } from '../types';

export const useLogo = (logo?: { logo: TEntity['logo'] } | null) => {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    useEffect(() => {
        if (logo && logo.logo) {
            const logoFile =
                logo.logo === null
                    ? null
                    : new File([Buffer.from(logo.logo.data)], logo.logo.name, {
                          type: logo.logo.type
                      });
            const logoUrl = logoFile && URL.createObjectURL(logoFile);

            setLogoUrl(logoUrl);
            return () => {
                logoUrl && URL.revokeObjectURL(logoUrl);
            };
        } else {
            setLogoUrl(null);
        }
    }, [logo]);

    return [logoUrl];
};
