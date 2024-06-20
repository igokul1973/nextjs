import ModeEditOutlined from '@mui/icons-material/ModeEditOutlined';
import { FC } from 'react';
import BaseLinkButton from '../base/BaseLinkButton';
import { IBaseLinkButtonProps } from '../types';

const UpdateButton: FC<IBaseLinkButtonProps> = ({ href, name, ...rest }) => {
    name = name ?? 'Update';
    return <BaseLinkButton href={href} name={name} endIcon={<ModeEditOutlined />} {...rest} />;
};

export default UpdateButton;
