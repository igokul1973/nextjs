import { TGetUserPayload } from '@/app/lib/data/user/types';
import { TEntities } from '@/app/lib/types';
import en from '@/locales/en';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';

export interface IProps {
    provider?: TEntities<
        TGetUserPayload['account']['individuals'][number],
        TGetUserPayload['account']['organizations'][number]
    >;
}

export interface ILink {
    name: keyof typeof en;
    href: string;
    icon: OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
        muiName: string;
    };
}
