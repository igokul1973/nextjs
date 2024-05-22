import ModeEditOutlined from '@mui/icons-material/ModeEditOutlined';
import BaseLinkButton from '../base/BaseLinkButton';
import { IBaseLinkButtonProps } from '../types';

export function UpdateButton({ href, name, ...rest }: IBaseLinkButtonProps) {
    name = name || 'Update';
    return <BaseLinkButton href={href} name={name} endIcon={<ModeEditOutlined />} {...rest} />;
}
