import BaseLinkIconButton from '@/app/components/buttons/base/BaseLinkIconButton';
import ModeEditOutlined from '@mui/icons-material/ModeEditOutlined';
import { IBaseLinkButtonProps } from '../types';
import { HTMLAttributes } from 'react';

export function UpdateIconButton({
    href,
    color,
    ...props
}: IBaseLinkButtonProps & { title: HTMLAttributes<HTMLButtonElement>['title'] }) {
    return (
        <BaseLinkIconButton
            href={href}
            icon={ModeEditOutlined}
            ariaLabel='Update'
            color={color || 'primary'}
            {...props}
        />
    );
}
