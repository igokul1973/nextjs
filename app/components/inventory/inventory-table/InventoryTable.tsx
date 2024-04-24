'use client';

import { useSnackbar } from '@/app/context/snackbar/provider';
import { deleteInventoryItemById } from '@/app/lib/data/inventory';
import { TOrder } from '@/app/lib/types';
import { useI18n } from '@/locales/client';
import { TSingleTranslationKeys } from '@/locales/types';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, FC, MouseEvent, useEffect, useState } from 'react';
import { IInventory } from '../types';
import {
    DEFAULT_ITEMS_PER_PAGE,
    DEFAULT_ORDER,
    DEFAULT_ORDER_BY,
    DEFAULT_PAGE_NUMBER
} from './constants';
import { IEnhancedTableProps, IEnhancedTableToolbarProps, IHeadCell, IProps } from './types';

const headCells: readonly IHeadCell[] = [
    {
        id: 'name',
        isNumeric: false,
        disablePadding: true,
        label: 'name',
        align: 'left'
    },
    {
        id: 'description',
        isNumeric: false,
        disablePadding: false,
        label: 'description',
        align: 'left'
    },
    {
        id: 'type',
        isNumeric: false,
        disablePadding: false,
        label: 'type',
        align: 'center'
    },
    {
        id: 'price',
        isNumeric: false,
        disablePadding: false,
        label: 'price',
        align: 'center'
    },
    {
        id: 'externalCode',
        isNumeric: false,
        disablePadding: false,
        label: 'external code',
        align: 'center'
    },
    {
        id: 'internalCode',
        isNumeric: false,
        disablePadding: false,
        label: 'internal code',
        align: 'center'
    },
    {
        id: 'manufacturerCode',
        isNumeric: false,
        disablePadding: false,
        label: 'manufacturer code',
        align: 'center'
    },
    {
        id: 'manufacturerPrice',
        isNumeric: false,
        disablePadding: false,
        label: 'manufacturer price',
        align: 'center'
    }
];

function EnhancedTableHead(props: IEnhancedTableProps) {
    const t = useI18n();
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property: keyof IInventory) => (event: MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{ whiteSpace: 'nowrap', color: 'green' }}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {capitalize(t(headCell.label as TSingleTranslationKeys))}
                            {orderBy === headCell.id ? (
                                <Box component='span' sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

function EnhancedTableToolbar(props: IEnhancedTableToolbarProps) {
    const t = useI18n();
    const { numSelected } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
                })
            }}
        >
            <Typography sx={{ flex: '1 1 100%' }} variant='h6' id='tableTitle' component='div'>
                {capitalize(t('inventory'))}
            </Typography>
            <Tooltip title='Filter list'>
                <IconButton>
                    <FilterListIcon />
                </IconButton>
            </Tooltip>
        </Toolbar>
    );
}

const InventoryTable: FC<IProps> = ({ inventory, count }) => {
    const { openSnackbar } = useSnackbar();
    const [selected, setSelected] = useState<readonly IInventory['id'][]>([]);
    const [dense, setDense] = useState(true);

    const { replace } = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const pageParam = searchParams.get('page') ?? DEFAULT_PAGE_NUMBER.toString();
    const itemsPerPageParam = searchParams.get('itemsPerPage') ?? DEFAULT_ITEMS_PER_PAGE.toString();
    const order = (searchParams.get('order') ?? DEFAULT_ORDER) as TOrder;
    const orderBy = searchParams.get('orderBy') ?? DEFAULT_ORDER_BY;

    useEffect(() => {
        // If no search params, set defaults
        if (!searchParams.has('page') || !searchParams.get('itemsPerPage')) {
            const params = new URLSearchParams(searchParams || undefined);
            params.set('itemsPerPage', itemsPerPageParam);
            params.set('page', pageParam);
            replace(`${pathname}?${params.toString()}`);
        }
    }, [searchParams, replace, pathname, itemsPerPageParam, pageParam]);

    const page = parseInt(pageParam, 10);
    const rowsPerPage = parseInt(itemsPerPageParam, 10);

    const handleRequestSort = (event: MouseEvent<unknown>, property: keyof IInventory) => {
        const isAsc = orderBy === property && order === 'asc';
        const params = new URLSearchParams(searchParams || undefined);
        params.set('order', isAsc ? 'desc' : 'asc');
        params.set('orderBy', property);
        replace(`${pathname}?${params.toString()}`);
    };

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = inventory.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: MouseEvent<unknown>, id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly IInventory['id'][] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        const params = new URLSearchParams(searchParams || undefined);
        params.set('page', newPage.toString());
        replace(`${pathname}?${params.toString()}`);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams || undefined);
        params.set('itemsPerPage', event.target.value);
        params.set('page', DEFAULT_PAGE_NUMBER.toString());
        replace(`${pathname}?${params.toString()}`);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const isSelected = (id: string) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - inventory.length) : 0;

    const deleteInventory = async (id: string, name: string) => {
        try {
            await deleteInventoryItemById(id);
            openSnackbar(`Successfully deleted inventory with ID: ${id}`);
        } catch (error) {
            openSnackbar(`Could not delete inventory: ${name}: ${error}`, 'error');
        }
    };

    const { push } = useRouter();

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby='tableTitle'
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={inventory.length}
                        />
                        <TableBody>
                            {inventory.map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.id)}
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell
                                            align='left'
                                            component='th'
                                            id={labelId}
                                            scope='row'
                                            padding='none'
                                            sx={{
                                                width: '250px',
                                                maxWidth: '250px'
                                            }}
                                        >
                                            {row.name}
                                        </TableCell>
                                        <TableCell
                                            align='left'
                                            sx={{
                                                width: '200px',
                                                maxWidth: '200px',
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {row.description}
                                        </TableCell>
                                        <TableCell align='center'>{row.type.type}</TableCell>
                                        <TableCell align='center'>{row.price}</TableCell>
                                        <TableCell align='center'>{row.externalCode}</TableCell>
                                        <TableCell align='center'>{row.internalCode}</TableCell>
                                        <TableCell align='center'>{row.manufacturerCode}</TableCell>
                                        <TableCell align='center'>
                                            {row.manufacturerPrice}
                                        </TableCell>
                                        <TableCell align='center' sx={{ display: 'flex' }}>
                                            <IconButton
                                                color='primary'
                                                aria-label='edit'
                                                onClick={() => {
                                                    push(`/dashboard/inventory/${row.id}/edit`);
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color='warning'
                                                aria-label='edit'
                                                onClick={() => deleteInventory(row.id, row.name)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component='div'
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label='Dense padding'
            />
        </Box>
    );
};

export default InventoryTable;