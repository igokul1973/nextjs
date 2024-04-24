'use client';

import { useRightDrawerState } from '@/app/context/right-drawer/provider';
import CloseIcon from '@mui/icons-material/Close';
import { FC } from 'react';
import { StyledCloseButton } from './styled';
import { IProps } from './types';

const CloseButton: FC<IProps> = ({ className }) => {
    const { dispatch } = useRightDrawerState();
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
