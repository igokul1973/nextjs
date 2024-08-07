'use client';

import { useSnackbar } from '@/app/context/snackbar/provider';
import { deleteInvoiceById } from '@/app/lib/data/invoice/actions';
import { stringifyObjectValues } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import { TSingleTranslationKey } from '@/locales/types';
import DeleteIcon from '@mui/icons-material/Delete';
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
import { InvoiceStatusEnum } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, FC, MouseEvent, useEffect, useState } from 'react';
import { UpdateIconButton } from '../../buttons/update/UpdateIconButton';
import { ViewIconButton } from '../../buttons/view/ViewIconButton';
import { IInvoiceTable } from '../types';
import { DEFAULT_PAGE_NUMBER } from './constants';
import { IEnhancedTableProps, IEnhancedTableToolbarProps, IHeadCell, IProps } from './types';

const headCells: readonly IHeadCell[] = [
    {
        id: 'number',
        isNumeric: true,
        disablePadding: true,
        label: 'number',
        align: 'left'
    },
    {
        id: 'customerName',
        isNumeric: false,
        disablePadding: false,
        label: 'customer name',
        align: 'left'
    },
    {
        id: 'amount',
        isNumeric: false,
        disablePadding: false,
        label: 'amount',
        align: 'center'
    },
    {
        id: 'status',
        isNumeric: false,
        disablePadding: false,
        label: 'status',
        align: 'center'
    },
    {
        id: 'date',
        isNumeric: false,
        disablePadding: false,
        label: 'date',
        align: 'center'
    },
    {
        id: 'actions',
        isNumeric: false,
        disablePadding: false,
        disableSorting: true,
        label: 'actions',
        align: 'center'
    }
];

function EnhancedTableHead(props: Readonly<IEnhancedTableProps>) {
    const t = useI18n();
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property: keyof IInvoiceTable) => (event: MouseEvent<unknown>) => {
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
                        sortDirection={
                            !headCell.disableSorting && orderBy === headCell.id ? order : false
                        }
                        sx={{ whiteSpace: 'nowrap', color: 'green' }}
                    >
                        {!headCell.disableSorting ? (
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {capitalize(t(headCell.label as TSingleTranslationKey))}
                                {orderBy === headCell.id ? (
                                    <Box component='span' sx={visuallyHidden}>
                                        {order === 'desc'
                                            ? 'sorted descending'
                                            : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        ) : (
                            capitalize(t(headCell.label as TSingleTranslationKey))
                        )}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

function EnhancedTableToolbar(props: IEnhancedTableToolbarProps) {
    const t = useI18n();
    const { numSelected, tableName } = props;

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
                {capitalize(t(tableName || 'invoices'))}
            </Typography>
            <Tooltip title='Filter list'>
                <IconButton>
                    <FilterListIcon />
                </IconButton>
            </Tooltip>
        </Toolbar>
    );
}

const InvoicesTable: FC<IProps> = ({
    invoices,
    count,
    searchParams: sanitizedSearchParams,
    tableName
}) => {
    const t = useI18n();
    const { openSnackbar } = useSnackbar();
    const [selected, setSelected] = useState<readonly IInvoiceTable['id'][]>([]);

    const { replace, push } = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { page, itemsPerPage: rowsPerPage, order, orderBy, isDense } = sanitizedSearchParams;

    useEffect(() => {
        // If no search params, set defaults
        if (searchParams.size < Object.keys(sanitizedSearchParams).length) {
            const stringifiedSearchParams = stringifyObjectValues(sanitizedSearchParams);
            const params = new URLSearchParams(stringifiedSearchParams);
            replace(`${pathname}?${params.toString()}`);
        }
    }, [searchParams, sanitizedSearchParams, replace, pathname]);

    const pageNumber = page;

    const handleRequestSort = (_: MouseEvent<unknown>, property: keyof IInvoiceTable) => {
        const isAsc = orderBy === property && order === 'asc';
        const params = new URLSearchParams(searchParams);
        params.set('order', isAsc ? 'desc' : 'asc');
        params.set('orderBy', property);
        push(`${pathname}?${params.toString()}`);
    };

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = invoices.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (_: MouseEvent<unknown>, id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly IInvoiceTable['id'][] = [];

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

    const handleChangePage = (_: unknown, newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        push(`${pathname}?${params.toString()}`);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams);
        params.set('itemsPerPage', event.target.value);
        params.set('page', DEFAULT_PAGE_NUMBER.toString());
        push(`${pathname}?${params.toString()}`);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams);
        params.set('isDense', event.target.checked.toString());
        push(`${pathname}?${params.toString()}`);
    };

    const isSelected = (id: string) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = pageNumber > 0 ? Math.max(0, rowsPerPage - invoices.length) : 0;

    const deleteInvoice = async (id: string, number: string) => {
        try {
            await deleteInvoiceById(id);
            openSnackbar(`Successfully deleted invoice #: ${number}`);
        } catch (error) {
            if (error instanceof Error) {
                openSnackbar(error.message, 'error');
            }
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} tableName={tableName} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby='tableTitle'
                        size={isDense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={invoices.length}
                        />
                        <TableBody>
                            {invoices.map((row, index) => {
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
                                                maxWidth: '200px'
                                            }}
                                        >
                                            {row.number}
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
                                            {row.customerName}
                                        </TableCell>
                                        <TableCell align='center'>{row.amount}</TableCell>
                                        <TableCell align='center'>{row.status}</TableCell>
                                        <TableCell align='center'>{row.date}</TableCell>
                                        <TableCell
                                            align='center'
                                            sx={{
                                                width: '175px'
                                            }}
                                        >
                                            <ViewIconButton
                                                href={`/dashboard/invoices/${row.id}/view?number=${row.number}`}
                                                title='View invoice'
                                            />
                                            {row.status === InvoiceStatusEnum.draft && (
                                                <>
                                                    <UpdateIconButton
                                                        href={`/dashboard/invoices/${row.id}/edit?number=${row.number}`}
                                                        title='Update invoice'
                                                    />
                                                    <IconButton
                                                        color='warning'
                                                        aria-label='edit'
                                                        onClick={() =>
                                                            deleteInvoice(row.id, row.number)
                                                        }
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (isDense ? 53 : 73) * emptyRows
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
                    page={pageNumber}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={isDense} onChange={handleChangeDense} />}
                label={capitalize(t('dense padding'))}
            />
        </Box>
    );
};

export default InvoicesTable;
