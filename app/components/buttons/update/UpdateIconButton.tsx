import ModeEditOutlined from '@mui/icons-material/ModeEditOutlined';
import BaseLinkIconButton from '../base/BaseLinkIconButton';
import { IBaseLinkButtonProps } from '../types';

export function UpdateIconButton({ href, color }: IBaseLinkButtonProps) {
    return (
        <BaseLinkIconButton
            href={href}
            icon={ModeEditOutlined}
            ariaLabel='Update'
            color={color || 'primary'}
        />
    );
}
