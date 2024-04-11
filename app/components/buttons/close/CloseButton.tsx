'use client';

import { useNavState } from '@/app/context/navigation/provider';
import CloseIcon from '@mui/icons-material/Close';
import { FC } from 'react';
import { StyledCloseButton } from './styled';
import { IProps } from './types';

const CloseButton: FC<IProps> = ({ className }) => {
    const { dispatch } = useNavState();
    return (
        <StyledCloseButton
            className={className}
            onClick={() => dispatch({ payload: { childComponent: null }, type: 'close' })}
        >
            <CloseIcon />
        </StyledCloseButton>
    );
};

export default CloseButton;
