import Add from '@mui/icons-material/Add';
import BaseLinkButton from '../base/BaseLinkButton';
import { IBaseLinkButtonProps } from '../types';

export function CreateButton({ href, name, ...rest }: IBaseLinkButtonProps) {
    name = name || 'Create';
    return <BaseLinkButton href={href} name={name} endIcon={<Add />} {...rest} />;
}
