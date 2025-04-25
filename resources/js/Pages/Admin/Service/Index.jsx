import React from 'react';
import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/PanelLayout';
import { Button, Paper, Tooltip, IconButton } from '@mui/material';
import { router } from '@inertiajs/react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function Index({ services, auth, success, error, errors }) {
    const columns = [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 50,
            enableColumnFilter: false
        },
        {
            accessorKey: 'nom',
            header: 'Nom',
            size: 200,
            Cell: ({ cell }) => (
                <div className="flex items-center gap-2">
                    <CategoryIcon className="text-orange-500" />
                    <span>{cell.getValue()}</span>
                </div>
            )
        },
        {
            accessorKey: 'description',
            header: 'Description',
            size: 300,
            Cell: ({ cell }) => (
                <div className="flex items-center gap-2">
                    <DescriptionIcon className="text-gray-500" />
                    <span className="truncate max-w-xs">{cell.getValue()}</span>
                </div>
            )
        },
        {
            accessorKey: 'prix',
            header: 'Prix',
            size: 150,
            Cell: ({ cell }) => (
                <div className="flex items-center gap-2">
                    <AttachMoneyIcon className="text-green-500" />
                    <span>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(cell.getValue())}</span>
                </div>
            )
        },
        {
            accessorKey: 'status',
            header: 'Statut',
            size: 100,
            Cell: ({ cell }) => (
                <div className="flex items-center gap-2">
                    {cell.getValue() ? (
                        <CheckCircleIcon className="text-green-500" />
                    ) : (
                        <CancelIcon className="text-red-500" />
                    )}
                    <span className={cell.getValue() ? 'text-green-500' : 'text-red-500'}>
                        {cell.getValue() ? 'Actif' : 'Inactif'}
                    </span>
                </div>
            )
        },
        {
            accessorKey: 'action',
            header: 'Actions',
            size: 100,
            Cell: ({ row }) => (
                <div className="flex gap-2">
                    <Tooltip title="Voir les détails">
                        <IconButton
                            color="primary"
                            onClick={() => router.get(route('admin.service.show', [auth.user.id, row.original.id]))}
                        >
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier">
                        <IconButton
                            color="primary"
                            onClick={() => router.get(route('admin.service.edit', [auth.user.id, row.original.id]))}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <IconButton
                            color="error"
                            onClick={() => {
                                if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
                                    router.delete(route('admin.service.destroy', [auth.user.id, row.original.id]));
                                }
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            )
        }
    ];

    const table = useMaterialReactTable({
        columns,
        data: services,
        enableRowSelection: true,
        enableColumnFilters: true,
        enableSorting: true,
        enablePagination: true,
        enableBottomToolbar: true,
        enableTopToolbar: true,
        muiTableHeadCellProps: {
            sx: {
                fontWeight: 'bold',
                fontSize: '14px',
                backgroundColor: '#f8fafc',
            },
        },
        muiTableBodyCellProps: {
            sx: {
                fontSize: '14px',
            },
        },
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
            },
        },
        muiTableContainerProps: {
            sx: {
                borderRadius: '8px',
            },
        },
        muiTopToolbarProps: {
            sx: {
                backgroundColor: '#f8fafc',
                borderRadius: '8px 8px 0 0',
                borderBottom: '1px solid #e2e8f0',
            },
        },
        muiBottomToolbarProps: {
            sx: {
                backgroundColor: '#f8fafc',
                borderRadius: '0 0 8px 8px',
                borderTop: '1px solid #e2e8f0',
            },
        },
    });

    return (
        <PanelLayout
            auth={auth}
            success={success}
            error={error}
            errors={errors}
            active={'parametrage'}
            sousActive={'service'}
            breadcrumbs={[
                {
                    text: "Service",
                    href: route("admin.service.index", [auth.user.id]),
                    active: true
                }
            ]}
        >
            <Head title="Liste des services" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Liste des services</h1>
                        <p className="text-gray-500 mt-1">Gérez vos services et leurs détails</p>
                    </div>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => router.get(route('admin.service.create', [auth.user.id]))}
                        className="bg-orange-500 hover:bg-orange-600"
                    >
                        Ajouter un service
                    </Button>
                </div>

                <Paper elevation={0} className="p-4">
                    <MaterialReactTable table={table} />
                </Paper>
            </div>
        </PanelLayout>
    );
} 