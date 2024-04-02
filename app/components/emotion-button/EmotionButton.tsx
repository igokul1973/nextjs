/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC } from 'react';

const buttonStyle = css({
    width: 300,
    height: 100,
    backgroundColor: 'hotpink',
    fontSize: '24px',
    borderRadius: '4px',
    color: 'black',
    ':hover': {
        color: 'white'
    },
    display: 'grid',
    placeItems: 'center'
});

export const EmotionButton: FC = () => {
    return <div css={buttonStyle}>Hover to change color</div>;
};
