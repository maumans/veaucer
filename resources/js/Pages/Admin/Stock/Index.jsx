import React from 'react';
import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/PanelLayout';
import { Button, Paper, Tooltip, IconButton, Chip } from '@mui/material';
import { router } from '@inertiajs/react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function Index({ stocks, auth, success, error, errors }) {
    const columns = [
        { 
            accessorKey: 'id', 
            header: 'ID', 
            size: 50,
            enableColumnFilter: false
        },
        { 
            accessorKey: 'produit.nom', 
            header: 'Produit', 
            size: 200,
            Cell: ({ cell }) => (
                <div className="flex items-center gap-2">
                    <InventoryIcon className="text-orange-500" />
                    <span>{cell.getValue()}</span>
                </div>
            )
        },
        { 
            accessorKey: 'type', 
            header: 'Type', 
            size: 120,
            Cell: ({ cell }) => (
                <Chip
                    label={cell.getValue() === 'ENTREE' ? "Entrée" : "Sortie"}
                    color={cell.getValue() === 'ENTREE' ? "success" : "error"}
                    icon={cell.getValue() === 'ENTREE' ? <AddCircleIcon /> : <RemoveCircleIcon />}
                />
            )
        },
        { 
            accessorKey: 'quantite', 
            header: 'Quantité', 
            size: 120,
            Cell: ({ cell, row }) => (
                <div className="flex items-center gap-2">
                    <InventoryIcon className={row.original.type === 'ENTREE' ? "text-green-500" : "text-red-500"} />
                    <span>{cell.getValue()}</span>
                </div>
            )
        },
        { 
            accessorKey: 'date', 
            header: 'Date', 
            size: 150,
            Cell: ({ cell }) => (
                <div className="flex items-center gap-2">
                    <CalendarTodayIcon className="text-blue-500" />
                    <span>{new Date(cell.getValue()).toLocaleDateString()}</span>
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
                    <span>{cell.getValue() || 'Aucune description'}</span>
                </div>
            )
        },
        { 
            accessorKey: 'status', 
            header: 'Statut', 
            size: 100,
            Cell: ({ cell }) => (
                <Chip
                    label={cell.getValue() ? "Actif" : "Inactif"}
                    color={cell.getValue() ? "success" : "error"}
                    icon={cell.getValue() ? <CheckCircleIcon /> : <CancelIcon />}
                />
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
                            onClick={() => router.get(route('admin.stock.show', [auth.user.id, row.original.id]))}
                        >
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier">
                        <IconButton
                            color="primary"
                            onClick={() => router.get(route('admin.stock.edit', [auth.user.id, row.original.id]))}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <IconButton
                            color="error"
                            onClick={() => {
                                if (confirm('Êtes-vous sûr de vouloir supprimer ce mouvement de stock ?')) {
                                    router.delete(route('admin.stock.destroy', [auth.user.id, row.original.id]));
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
        data: stocks,
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
            sousActive={'stock'}
            breadcrumbs={[
                {
                    text: "Stock",
                    href: route("admin.stock.index", [auth.user.id]),
                    active: true
                }
            ]}
        >
            <Head title="Liste des mouvements de stock" />
            
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Liste des mouvements de stock</h1>
                        <p className="text-gray-500 mt-1">Gérez les entrées et sorties de stock</p>
                    </div>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => router.get(route('admin.stock.create', [auth.user.id]))}
                        className="bg-orange-500 hover:bg-orange-600"
                    >
                        Ajouter un mouvement
                    </Button>
                </div>

                <Paper elevation={0} className="p-4">
                    <MaterialReactTable table={table} />
                </Paper>
            </div>
        </PanelLayout>
    );
} 