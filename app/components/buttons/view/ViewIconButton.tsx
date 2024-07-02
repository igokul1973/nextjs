import ViewIcon from '@mui/icons-material/Visibility';
import { HTMLAttributes } from 'react';
import BaseLinkIconButton from '../base/BaseLinkIconButton';
import { IBaseLinkButtonProps } from '../types';

export function ViewIconButton({
    href,
    color,
    ...props
}: IBaseLinkButtonProps & { title: HTMLAttributes<HTMLButtonElement>['title'] }) {
    return (
        <BaseLinkIconButton
            href={href}
            icon={ViewIcon}
            ariaLabel='View'
            color={color || 'primary'}
            {...props}
        />
    );
}
