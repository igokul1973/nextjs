import BaseLinkButton from '../base/BaseLinkButton';
import { IBaseLinkButtonProps } from '../types';
import ViewIcon from '@mui/icons-material/Visibility';

export function ViewButton({ href, name, ...rest }: IBaseLinkButtonProps) {
    name = name || 'View';
    return <BaseLinkButton href={href} name={name} endIcon={<ViewIcon />} {...rest} />;
}
