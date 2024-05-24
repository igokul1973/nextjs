import ViewIcon from '@mui/icons-material/Visibility';
import BaseLinkButton from '../base/BaseLinkButton';
import { IBaseLinkButtonProps } from '../types';

export function ViewButton({ href, name, ...rest }: IBaseLinkButtonProps) {
    name = name || 'View';
    return <BaseLinkButton href={href} name={name} endIcon={<ViewIcon />} {...rest} />;
}
