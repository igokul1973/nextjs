import TableCell from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

export const TableCellStyled = styled(TableCell, {
    name: 'Table Cell',
    slot: 'Root'
})`
    background-color: ${({ theme }) => theme.palette.background.paper};
    &[data-column='description'] {
        text-wrap: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;
