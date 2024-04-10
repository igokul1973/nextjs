import { TGetUserPayload } from '@/app/lib/data/users/types';
import { TEntities } from '@/app/lib/types';
import en from '@/locales/en';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';

export interface IProps {
    provider?: TEntities<
        TGetUserPayload['account']['individuals'][0],
        TGetUserPayload['account']['organizations'][0]
    >;
}

export interface ILink {
    name: keyof typeof en;
    href: string;
    icon: OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
        muiName: string;
    };
}
