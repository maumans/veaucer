import React, { useState } from 'react';
import PanelLayout from "@/Layouts/PanelLayout.jsx";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_FR } from 'material-react-table/locales/fr';
import { router } from "@inertiajs/react";
import { 
    Button, 
    Chip, 
    IconButton, 
    Tooltip, 
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";
import { 
    Add, 
    Edit, 
    Visibility, 
    PlayArrow, 
    Stop, 
    Cancel, 
    CheckCircle 
} from "@mui/icons-material";
import dayjs from 'dayjs';

const Index = ({ auth, inventaires, departements, success, error }) => {
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [confirmAction, setConfirmAction] = useState({ action: '', id: null, message: '' });

    // Fonction pour formater le statut avec un Chip coloré
    const formatStatut = (statut) => {
        let color = 'default';
        let icon = null;

        switch (statut) {
            case 'planifié':
                color = 'info';
                icon = <CheckCircle fontSize="small" />;
                break;
            case 'en_cours':
                color = 'warning';
                icon = <PlayArrow fontSize="small" />;
                break;
            case 'terminé':
                color = 'success';
                icon = <Stop fontSize="small" />;
                break;
            case 'annulé':
                color = 'error';
                icon = <Cancel fontSize="small" />;
                break;
            default:
                color = 'default';
        }

        return (
            <Chip 
                label={statut.charAt(0).toUpperCase() + statut.slice(1)} 
                color={color} 
                size="small"
                icon={icon}
            />
        );
    };

    // Fonction pour ouvrir la boîte de dialogue de confirmation
    const handleConfirmAction = (action, id, message) => {
        setConfirmAction({ action, id, message });
        setOpenConfirmDialog(true);
    };

    // Fonction pour exécuter l'action confirmée
    const executeConfirmedAction = () => {
        const { action, id } = confirmAction;
        
        switch (action) {
            case 'demarrer':
                router.get(route('admin.inventaire.physique.demarrer', [auth.user.id, id]));
                break;
            case 'terminer':
                router.get(route('admin.inventaire.physique.terminer', [auth.user.id, id]));
                break;
            case 'annuler':
                router.get(route('admin.inventaire.physique.annuler', [auth.user.id, id]));
                break;
            default:
                break;
        }
        
        setOpenConfirmDialog(false);
    };

    // Définition des colonnes pour la table
    const columns = [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 80,
        },
        {
            accessorKey: 'date_debut',
            header: 'Date de début',
            Cell: ({ row }) => dayjs(row.original.date_debut).format('DD/MM/YYYY HH:mm'),
        },
        {
            accessorKey: 'date_fin',
            header: 'Date de fin',
            Cell: ({ row }) => row.original.date_fin ? dayjs(row.original.date_fin).format('DD/MM/YYYY HH:mm') : '-',
        },
        {
            accessorKey: 'departement.nom',
            header: 'Département',
            Cell: ({ row }) => row.original.departement ? row.original.departement.nom : 'Tous les départements',
        },
        {
            accessorKey: 'statut',
            header: 'Statut',
            Cell: ({ row }) => formatStatut(row.original.statut),
        },
        {
            accessorKey: 'user.name',
            header: 'Créé par',
            Cell: ({ row }) => `${row.original.user.prenom} ${row.original.user.nom}`,
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            Cell: ({ row }) => (
                <Box sx={{ display: 'flex', gap: '8px' }}>
                    <Tooltip title="Voir les détails">
                        <IconButton
                            color="primary"
                            onClick={() => router.get(route('admin.inventaire.physique.show', [auth.user.id, row.original.id]))}
                        >
                            <Visibility fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    
                    {row.original.statut === 'planifié' && (
                        <>
                            <Tooltip title="Modifier">
                                <IconButton
                                    color="info"
                                    onClick={() => router.get(route('admin.inventaire.physique.edit', [auth.user.id, row.original.id]))}
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Démarrer l'inventaire">
                                <IconButton
                                    color="success"
                                    onClick={() => handleConfirmAction('demarrer', row.original.id, "Êtes-vous sûr de vouloir démarrer cet inventaire ?")}
                                >
                                    <PlayArrow fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Annuler l'inventaire">
                                <IconButton
                                    color="error"
                                    onClick={() => handleConfirmAction('annuler', row.original.id, "Êtes-vous sûr de vouloir annuler cet inventaire ?")}
                                >
                                    <Cancel fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                    
                    {row.original.statut === 'en_cours' && (
                        <Tooltip title="Terminer l'inventaire">
                            <IconButton
                                color="warning"
                                onClick={() => handleConfirmAction('terminer', row.original.id, "Êtes-vous sûr de vouloir terminer cet inventaire ?")}
                            >
                                <Stop fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            ),
        },
    ];

    // Configuration de la table
    const table = useMaterialReactTable({
        columns,
        data: inventaires.data,
        enableColumnFilters: true,
        enableGlobalFilter: true,
        enablePagination: true,
        manualPagination: true,
        rowCount: inventaires.total,
        onPaginationChange: (pagination) => {
            router.get(route('admin.inventaire.physique.index', auth.user.id), {
                page: pagination.pageIndex + 1,
            }, {
                preserveState: true,
                preserveScroll: true,
                only: ['inventaires'],
            });
        },
        state: {
            pagination: {
                pageIndex: inventaires.current_page - 1,
                pageSize: inventaires.per_page,
            },
        },
        localization: MRT_Localization_FR,
        renderTopToolbarCustomActions: () => (
            <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => router.get(route('admin.inventaire.physique.create', auth.user.id))}
            >
                Nouvel inventaire
            </Button>
        ),
    });

    return (
        <PanelLayout
            auth={auth}
            success={success}
            error={error}
            active={'stock'}
            sousActive={'inventaire'}
            breadcrumbs={[
                {
                    text: "Inventaire",
                    href: route("admin.stockInventaire.index", [auth.user.id]),
                    active: false
                },
                {
                    text: "Inventaire Physique",
                    href: route("admin.inventaire.physique.index", [auth.user.id]),
                    active: true
                }
            ]}
        >
            <div className="p-4 bg-white rounded shadow">
                <h1 className="text-2xl font-bold mb-4">Inventaires Physiques</h1>
                
                <MaterialReactTable table={table} />
                
                {/* Boîte de dialogue de confirmation */}
                <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
                    <DialogTitle>Confirmation</DialogTitle>
                    <DialogContent>
                        {confirmAction.message}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenConfirmDialog(false)} color="error">
                            Annuler
                        </Button>
                        <Button onClick={executeConfirmedAction} color="primary" variant="contained">
                            Confirmer
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </PanelLayout>
    );
};

export default Index;
