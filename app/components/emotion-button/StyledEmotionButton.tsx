import { Button, styled } from '@mui/material';

interface IStyledButtonProps {
    backgroundColor?: string;
}
const StyledButton = styled(Button, {
    name: 'Bla',
    slot: 'Root',
    shouldForwardProp: (prop) => prop !== 'backgroundColor'
})<IStyledButtonProps>(({ backgroundColor }) => ({
    width: '400px',
    height: '100px',
    fontSize: '1.5rem',
    padding: '2rem',
    backgroundColor: backgroundColor || 'red',
    fontWeight: 700,
    '&:hover': {
        color: 'white'
    }
}));

const StyledEmotionButton = () => {
    return <StyledButton backgroundColor='lime'>StyledEmotionButton</StyledButton>;
};

export default StyledEmotionButton;
