import ViewIcon from '@mui/icons-material/Visibility';
import { FC } from 'react';
import BaseLinkButton from '../base/BaseLinkButton';
import { IBaseLinkButtonProps } from '../types';

const ViewButton: FC<IBaseLinkButtonProps> = ({ href, name, ...rest }) => {
    name = name ?? 'View';
    return <BaseLinkButton href={href} name={name} endIcon={<ViewIcon />} {...rest} />;
};

export default ViewButton;
