import { useEffect, useState } from 'react';
import { TCustomerPayload } from '../data/customer/types';

export const useLogo = (
    entity?: TCustomerPayload['individual'] | TCustomerPayload['organization'] | null
) => {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    useEffect(() => {
        if (entity && entity.logo) {
            const logoFile =
                entity.logo === null
                    ? null
                    : new File([Buffer.from(entity.logo.data)], entity.logo.name, {
                          type: entity.logo.type
                      });
            const logoUrl = logoFile && URL.createObjectURL(logoFile);

            setLogoUrl(logoUrl);
            return () => {
                logoUrl && URL.revokeObjectURL(logoUrl);
            };
        } else {
            setLogoUrl(null);
        }
    }, [entity]);

    return [logoUrl];
};
