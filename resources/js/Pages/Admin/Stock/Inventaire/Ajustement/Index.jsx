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
    DialogTitle,
    TextField
} from "@mui/material";
import { 
    Add, 
    Visibility, 
    CheckCircle, 
    Cancel,
    ArrowBack
} from "@mui/icons-material";
import dayjs from 'dayjs';

const Index = ({ auth, ajustements, success, error }) => {
    const [openRejetDialog, setOpenRejetDialog] = useState(false);
    const [selectedAjustement, setSelectedAjustement] = useState(null);
    const [motifRejet, setMotifRejet] = useState('');
    const [motifRejetError, setMotifRejetError] = useState('');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [confirmAction, setConfirmAction] = useState({ action: '', id: null, message: '' });

    // Fonction pour formater le status avec un Chip coloré
    const formatStatus = (status) => {
        // Gérer les valeurs undefined ou null
        if (!status) {
            return <Chip label="Inconnu" color="default" size="small" />;
        }
        
        let color = 'default';
        let icon = null;
        let label = '';

        switch (status) {
            case 'en_attente':
                color = 'warning';
                label = 'En attente';
                break;
            case 'validé':
                color = 'success';
                icon = <CheckCircle fontSize="small" />;
                label = 'Validé';
                break;
            case 'rejeté':
                color = 'error';
                icon = <Cancel fontSize="small" />;
                label = 'Rejeté';
                break;
            default:
                color = 'default';
                // Sécuriser le formatage pour éviter les erreurs
                label = typeof status === 'string' ? 
                    status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ') : 
                    'Inconnu';
        }

        return (
            <Chip 
                label={label} 
                color={color} 
                size="small"
                icon={icon}
            />
        );
    };

    // Fonction pour ouvrir la boîte de dialogue de rejet
    const handleOpenRejetDialog = (ajustement) => {
        setSelectedAjustement(ajustement);
        setMotifRejet('');
        setMotifRejetError('');
        setOpenRejetDialog(true);
    };

    // Fonction pour soumettre le rejet
    const handleSubmitRejet = () => {
        if (!motifRejet.trim()) {
            setMotifRejetError('Le motif de rejet est requis');
            return;
        }

        router.post(route('admin.inventaire.ajustement.rejeter', [auth.user.id, selectedAjustement.id]), {
            motif_rejet: motifRejet
        }, {
            onSuccess: () => {
                setOpenRejetDialog(false);
                setMotifRejet('');
            }
        });
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
            case 'valider':
                router.get(route('admin.inventaire.ajustement.valider', [auth.user.id, id]));
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
            accessorKey: 'produit.nom',
            header: 'Produit',
            Cell: ({ row }) => (
                <div>
                    <div>{row.original.produit.nom}</div>
                    <div className="text-xs text-gray-500">{row.original.produit.code}</div>
                </div>
            ),
        },
        {
            accessorKey: 'quantite_avant',
            header: 'Qté Avant',
            Cell: ({ row }) => row.original.quantite_avant.toLocaleString('fr-FR'),
        },
        {
            accessorKey: 'quantite_apres',
            header: 'Qté Après',
            Cell: ({ row }) => row.original.quantite_apres.toLocaleString('fr-FR'),
        },
        {
            accessorKey: 'difference',
            header: 'Différence',
            Cell: ({ row }) => {
                const difference = row.original.difference;
                const color = difference === 0 ? 'text-green-600' : difference > 0 ? 'text-blue-600' : 'text-red-600';
                
                return <span className={color}>{difference.toLocaleString('fr-FR')}</span>;
            },
        },
        {
            accessorKey: 'motif',
            header: 'Motif',
        },
        {
            accessorKey: 'date_ajustement',
            header: 'Date',
            Cell: ({ row }) => dayjs(row.original.date_ajustement).format('DD/MM/YYYY HH:mm'),
        },
        {
            accessorKey: 'departement.nom',
            header: 'Département',
            Cell: ({ row }) => row.original.departement ? row.original.departement.nom : '-',
        },
        {
            accessorKey: 'status',
            header: 'Status',
            Cell: ({ row }) => formatStatus(row.original.status),
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            Cell: ({ row }) => (
                <Box sx={{ display: 'flex', gap: '8px' }}>
                    <Tooltip title="Voir les détails">
                        <IconButton
                            color="primary"
                            onClick={() => router.get(route('admin.inventaire.ajustement.show', [auth.user.id, row.original.id]))}
                        >
                            <Visibility fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    
                    {row.original.status === 'en_attente' && (
                        <>
                            <Tooltip title="Valider">
                                <IconButton
                                    color="success"
                                    onClick={() => handleConfirmAction(
                                        'valider', 
                                        row.original.id, 
                                        `Êtes-vous sûr de vouloir valider cet ajustement ? Le stock du produit "${row.original.produit.nom}" sera ajusté de ${row.original.difference > 0 ? '+' : ''}${row.original.difference}.`
                                    )}
                                >
                                    <CheckCircle fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Rejeter">
                                <IconButton
                                    color="error"
                                    onClick={() => handleOpenRejetDialog(row.original)}
                                >
                                    <Cancel fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                </Box>
            ),
        },
    ];

    // Configuration de la table
    const table = useMaterialReactTable({
        columns,
        data: ajustements.data,
        enableColumnFilters: true,
        enableGlobalFilter: true,
        enablePagination: true,
        manualPagination: true,
        rowCount: ajustements.total,
        onPaginationChange: (pagination) => {
            router.get(route('admin.inventaire.ajustement.index', auth.user.id), {
                page: pagination.pageIndex + 1,
            }, {
                preserveState: true,
                preserveScroll: true,
                only: ['ajustements'],
            });
        },
        state: {
            pagination: {
                pageIndex: ajustements.current_page - 1,
                pageSize: ajustements.per_page,
            },
        },
        localization: MRT_Localization_FR,
        renderTopToolbarCustomActions: () => (
            <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => router.get(route('admin.inventaire.ajustement.create', auth.user.id))}
            >
                Nouvel ajustement
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
                    text: "Ajustements d'inventaire",
                    href: route("admin.inventaire.ajustement.index", [auth.user.id]),
                    active: true
                }
            ]}
        >
            <div className="p-4 bg-white rounded shadow">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Ajustements d'inventaire</h1>
                    <Button 
                        variant="outlined" 
                        startIcon={<ArrowBack />}
                        onClick={() => router.get(route('admin.stockInventaire.index', auth.user.id))}
                    >
                        Retour à la liste des inventaires
                    </Button>
                </div>
                
                <MaterialReactTable table={table} />
                
                {/* Boîte de dialogue pour rejeter un ajustement */}
                <Dialog open={openRejetDialog} onClose={() => setOpenRejetDialog(false)}>
                    <DialogTitle>Rejeter l'ajustement</DialogTitle>
                    <DialogContent>
                        {selectedAjustement && (
                            <div>
                                <p className="mb-4">
                                    Vous êtes sur le point de rejeter l'ajustement pour le produit 
                                    <strong> {selectedAjustement.produit.nom}</strong> avec une différence de 
                                    <strong> {selectedAjustement.difference > 0 ? '+' : ''}{selectedAjustement.difference}</strong>.
                                </p>
                                
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Motif du rejet"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    value={motifRejet}
                                    onChange={(e) => {
                                        setMotifRejet(e.target.value);
                                        if (e.target.value.trim()) {
                                            setMotifRejetError('');
                                        }
                                    }}
                                    error={!!motifRejetError}
                                    helperText={motifRejetError}
                                />
                            </div>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenRejetDialog(false)} color="primary">
                            Annuler
                        </Button>
                        <Button onClick={handleSubmitRejet} color="error" variant="contained">
                            Rejeter
                        </Button>
                    </DialogActions>
                </Dialog>
                
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
