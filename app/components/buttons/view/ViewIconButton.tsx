import ViewIcon from '@mui/icons-material/Visibility';
import BaseLinkIconButton from '../base/BaseLinkIconButton';
import { IBaseLinkButtonProps } from '../types';

export function ViewIconButton({ href, color }: IBaseLinkButtonProps) {
    return (
        <BaseLinkIconButton
            href={href}
            icon={ViewIcon}
            ariaLabel='View'
            color={color || 'primary'}
        />
    );
}
