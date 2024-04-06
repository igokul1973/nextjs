import ModeEditOutlined from '@mui/icons-material/ModeEditOutlined';
import BaseLinkIconButton from '../base/BaseLinkIconButton';
import { IBaseLinkButtonProps } from '../types';

export function UpdateButton({ href }: IBaseLinkButtonProps) {
    return <BaseLinkIconButton href={href} icon={ModeEditOutlined} ariaLabel='Update' />;
}
