'use client';

import { useSnackbar } from '@/app/context/snackbar/provider';
import { deleteCustomerById } from '@/app/lib/data/customer';
import { TOrder } from '@/app/lib/types';
import { stringToBoolean } from '@/app/lib/utils';
import { useI18n } from '@/locales/client';
import { TSingleTranslationKey } from '@/locales/types';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import { capitalize } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
import {
    DEFAULT_IS_DENSE,
    DEFAULT_ITEMS_PER_PAGE,
    DEFAULT_ORDER,
    DEFAULT_ORDER_BY,
    DEFAULT_PAGE_NUMBER
} from '../../../[locale]/dashboard/customers/constants';
import { ICustomerTable } from '../types';
import {
    IEnhancedTableProps,
    IEnhancedTableToolbarProps,
    IHeadCell,
    IProps,
    ISelectedFilters
} from './types';

const headCells: readonly IHeadCell[] = [
    {
        id: 'customerId',
        isNumeric: false,
        disablePadding: true,
        label: 'name',
        align: 'left'
    },
    {
        id: 'customerType',
        isNumeric: false,
        disablePadding: false,
        label: 'type',
        align: 'center'
    },
    {
        id: 'customerEmail',
        isNumeric: false,
        disablePadding: false,
        disableSorting: true,
        label: 'email',
        align: 'center'
    },
    {
        id: 'customerPhone',
        isNumeric: false,
        disablePadding: false,
        disableSorting: true,
        label: 'phone',
        align: 'center'
    },
    {
        id: 'totalPending',
        isNumeric: true,
        disablePadding: false,
        label: 'pending invoices',
        align: 'center'
    },
    {
        id: 'totalPaid',
        isNumeric: true,
        disablePadding: false,
        label: 'paid invoices',
        align: 'center'
    },
    {
        id: 'totalInvoices',
        isNumeric: true,
        disablePadding: false,
        label: 'total invoices',
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

function EnhancedTableHead(props: IEnhancedTableProps) {
    const t = useI18n();
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property: keyof ICustomerTable) => (event: MouseEvent<unknown>) => {
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

const EnhancedTableToolbar: FC<IEnhancedTableToolbarProps> = ({
    numSelected,
    selectedFilters,
    setSelectedFilters
}) => {
    const t = useI18n();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const setFilters = (name: keyof ISelectedFilters, value: boolean) => {
        setSelectedFilters({ ...selectedFilters, [name]: value });
    };

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
                {capitalize(t('customers'))}
            </Typography>
            <Tooltip title={capitalize(t('click to see more filters'))}>
                <IconButton
                    onClick={handleClick}
                    color='warning'
                    sx={{ display: 'flex', gap: 1, fontSize: 20 }}
                >
                    <FilterListIcon />
                    {capitalize(t('filter'))}
                </IconButton>
            </Tooltip>
            <Menu
                id='basic-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button'
                }}
            >
                <MenuItem onClick={handleClose}>{capitalize(t('show'))}:</MenuItem>
                {(['organizations', 'individuals'] as TSingleTranslationKey[]).map((key) => {
                    return (
                        <MenuItem key={key} onClick={handleClose}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={({ target: { checked } }) =>
                                            setFilters(key, checked)
                                        }
                                        defaultChecked={selectedFilters[key]}
                                    />
                                }
                                label={capitalize(t(key))}
                            />
                        </MenuItem>
                    );
                })}
            </Menu>
        </Toolbar>
    );
};

const CustomersTable: FC<IProps> = ({ customers, count }) => {
    const t = useI18n();
    const { openSnackbar } = useSnackbar();
    const { push } = useRouter();
    const [selected, setSelected] = useState<readonly ICustomerTable['customerId'][]>([]);

    const { replace } = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const page = searchParams.get('page') ?? DEFAULT_PAGE_NUMBER.toString();
    const itemsPerPageParam = searchParams.get('itemsPerPage') ?? DEFAULT_ITEMS_PER_PAGE.toString();
    const order = (searchParams.get('order') ?? DEFAULT_ORDER) as TOrder;
    const orderBy = searchParams.get('orderBy') ?? DEFAULT_ORDER_BY;
    const showOrg = stringToBoolean(searchParams.get('showOrg') || true.toString());
    const showInd = stringToBoolean(searchParams.get('showInd') || true.toString());
    const isDense = stringToBoolean(searchParams.get('isDense') || DEFAULT_IS_DENSE.toString());
    const selectedFilters = {
        organizations: showOrg,
        individuals: showInd
    };

    useEffect(() => {
        // If no search params, set defaults
        if (
            !searchParams.has('page') ||
            !searchParams.get('itemsPerPage') ||
            !searchParams.get('isDense') ||
            !searchParams.get('showOrg') ||
            !searchParams.get('showInd')
        ) {
            const params = new URLSearchParams(searchParams || undefined);
            params.set('itemsPerPage', itemsPerPageParam);
            params.set('page', page);
            params.set('isDense', isDense.toString());
            params.set('showOrg', showOrg.toString());
            params.set('showInd', showInd.toString());
            replace(`${pathname}?${params.toString()}`);
        }
    }, [searchParams, replace, pathname, itemsPerPageParam, page, isDense, showOrg, showInd]);

    const pageNumber = parseInt(page, 10);
    const rowsPerPage = parseInt(itemsPerPageParam, 10);

    const handleRequestSort = (event: MouseEvent<unknown>, property: keyof ICustomerTable) => {
        const isAsc = orderBy === property && order === 'asc';
        const params = new URLSearchParams(searchParams || undefined);
        params.set('order', isAsc ? 'desc' : 'asc');
        params.set('orderBy', property);
        replace(`${pathname}?${params.toString()}`);
    };

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = customers.map((n) => n.customerId);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: MouseEvent<unknown>, id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly ICustomerTable['customerId'][] = [];

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
        const params = new URLSearchParams(searchParams || undefined);
        params.set('isDense', event.target.checked.toString());
        replace(`${pathname}?${params.toString()}`);
    };

    const isSelected = (id: string) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = pageNumber > 0 ? Math.max(0, rowsPerPage - customers.length) : 0;

    const deleteCustomer = async (id: string, name: string) => {
        try {
            await deleteCustomerById(id);
            openSnackbar(`Successfully deleted customer with ID: ${id}`);
        } catch (error) {
            openSnackbar(`Could not delete customer: ${name}: ${error}`, 'error');
        }
    };

    const setSelectedFilters = (filters: ISelectedFilters) => {
        const params = new URLSearchParams(searchParams || undefined);
        params.set('showOrg', filters.organizations.toString());
        params.set('showInd', filters.individuals.toString());
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                />
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
                            rowCount={customers.length}
                        />
                        <TableBody>
                            {customers.map((row, index) => {
                                const isItemSelected = isSelected(row.customerId);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.customerId)}
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.customerId}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell
                                            align='left'
                                            component='th'
                                            id={labelId}
                                            scope='row'
                                            padding='none'
                                        >
                                            {row.customerName}
                                        </TableCell>
                                        <TableCell align='center'>
                                            {capitalize(t(row.customerType))}
                                        </TableCell>
                                        <TableCell align='center'>{row.customerEmail}</TableCell>
                                        <TableCell align='center'>{row.customerPhone}</TableCell>
                                        <TableCell align='center'>{row.totalPending}</TableCell>
                                        <TableCell align='center'>{row.totalPaid}</TableCell>
                                        <TableCell align='center'>{row.totalInvoices}</TableCell>
                                        <TableCell
                                            align='center'
                                            sx={{ display: 'flex', justifyContent: 'center' }}
                                        >
                                            <IconButton
                                                color='primary'
                                                aria-label='edit'
                                                onClick={() => {
                                                    push(
                                                        `/dashboard/customers/${row.customerId}/edit`
                                                    );
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color='warning'
                                                aria-label='edit'
                                                onClick={() =>
                                                    deleteCustomer(row.customerId, row.customerName)
                                                }
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
                label='Dense padding'
            />
        </Box>
    );
};

export default CustomersTable;
