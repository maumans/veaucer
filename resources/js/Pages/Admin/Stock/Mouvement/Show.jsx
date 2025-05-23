import React, { useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_FR } from 'material-react-table/locales/fr';
import PanelLayout from '@/Layouts/PanelLayout';
import formatNumber from '@/Pages/Utils/formatNumber';
import dayjs from 'dayjs';
import { 
    Button, 
    Paper, 
    Typography, 
    Grid, 
    Box, 
    Chip, 
    Divider,
    Tooltip,
    IconButton,
    Card,
    CardContent,
    CardHeader,
    Tab,
    Tabs,
    Alert
} from '@mui/material';
import { router } from '@inertiajs/react';
import { 
    Edit as EditIcon, 
    ArrowBack as ArrowBackIcon,
    Info as InfoIcon,
    ShoppingCart as EntreeIcon,
    ExitToApp as SortieIcon,
    CompareArrows as TransfertIcon,
    AttachMoney as MoneyIcon,
    Inventory as InventoryIcon,
    CalendarToday as CalendarIcon,
    LocalShipping as FournisseurIcon,
    Business as DepartmentIcon,
    Notes as CommentIcon,
    Receipt as ReceiptIcon,
    Print as PrintIcon
} from '@mui/icons-material';

// Helper function to get operation type icon
const getOperationTypeIcon = (type) => {
    switch(type?.toLowerCase()) {
        case 'entrée': return <EntreeIcon color="success" />;
        case 'sortie': return <SortieIcon color="error" />;
        case 'transfert': return <TransfertIcon color="info" />;
        default: return <InventoryIcon />;
    }
};

// Helper function to get operation type color
const getOperationTypeColor = (type) => {
    switch(type?.toLowerCase()) {
        case 'entrée': return 'success';
        case 'sortie': return 'error';
        case 'transfert': return 'info';
        default: return 'default';
    }
};

const Show = ({ auth, operation }) => {
    const [activeTab, setActiveTab] = useState(0);
    // For debugging
    // console.log('Operation reçue:', operation);

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Format the date more readably
    const formattedDate = operation?.date ? dayjs(operation.date).format('DD MMMM YYYY') : 'N/A';
    
    const columnsProduits = useMemo(() => {
        const baseColumns = [
            {
                accessorKey: 'produit.nom',
                header: 'Produit',
                size: 250,
            },
            {
                accessorKey: 'typeProduit.nom',
                header: 'Type',
                size: 100,
                Cell: ({ cell, row }) => {
                    const typeProduit = cell.getValue() || 'unité';
                    return (
                        <Chip 
                            label={typeProduit}
                            size="small"
                            color={typeProduit.toLowerCase() === 'ensemble' ? 'primary' : 'default'}
                            variant="outlined"
                        />
                    );
                },
            },
            {
                accessorKey: 'quantite',
                header: 'Quantité',
                size: 100,
                muiTableBodyCellProps: { align: 'right' },
                muiTableHeadCellProps: { align: 'right' },
            },
        ];

        if (operation?.typeOperation?.nom === 'entrée') {
            return [
                ...baseColumns,
                {
                    accessorKey: 'prix',
                    header: "Prix",
                    size: 150,
                    Cell: ({ cell }) => formatNumber(cell.getValue()) + ' GNF',
                    muiTableBodyCellProps: { align: 'right' },
                    muiTableHeadCellProps: { align: 'right' },
                },
                {
                    accessorKey: 'total',
                    header: "Total",
                    size: 150,
                    Cell: ({ row }) => formatNumber(row.original.total) + ' GNF',
                    muiTableBodyCellProps: { align: 'right' },
                    muiTableHeadCellProps: { align: 'right' },
                },
            ];
        }
        return baseColumns;
    }, [operation?.typeOperation?.nom]);

    const columnsDepenses = useMemo(() => [
        {
            accessorKey: 'motif.nom',
            header: 'Motif',
            size: 250,
        },
        {
            accessorKey: 'montant',
            header: 'Montant',
            size: 150,
            Cell: ({ cell }) => formatNumber(cell.getValue()) + ' GNF',
            muiTableBodyCellProps: { align: 'right' },
            muiTableHeadCellProps: { align: 'right' },
        },
        {
            accessorKey: 'commentaire',
            header: 'Commentaire',
            size: 300,
            Cell: ({ cell }) => cell.getValue() || '-',
        },
    ], []);

    const tableProduits = useMaterialReactTable({
        columns: columnsProduits,
        data: operation?.produits || [],
        localization: MRT_Localization_FR,
        enableColumnFilters: false,
        enableColumnActions: false,
        enablePagination: false,
        enableBottomToolbar: false,
        enableTopToolbar: false,
        muiTablePaperProps: { elevation: 0, sx: { borderRadius: 0 } },
        initialState: {
            density: 'compact',
        },
    });

    const tableDepenses = useMaterialReactTable({
        columns: columnsDepenses,
        data: operation?.depenses || [],
        localization: MRT_Localization_FR,
        enableColumnFilters: false,
        enableColumnActions: false,
        enablePagination: false,
        enableBottomToolbar: false,
        enableTopToolbar: false,
        muiTablePaperProps: { elevation: 0, sx: { borderRadius: 0 } },
        initialState: {
            density: 'compact',
        },
    });

    const handleRetour = () => {
        router.get(route('admin.stock.mouvement.index', auth.user.id));
    };

    const handleEdit = () => {
        router.get(route('admin.stock.mouvement.edit', [auth.user.id, operation.id]));
    };

    return (
        <PanelLayout
            auth={auth}
            active="stock"
            sousActive="mouvement"
            breadcrumbs={[
                {
                    text: 'Mouvements de Stock',
                    href: route('admin.stock.mouvement.index', auth.user.id),
                    active: false,
                },
                {
                    text: `Détail Mvt #${operation.id}`,
                    href: route('admin.stock.mouvement.show', [auth.user.id, operation.id]),
                    active: true,
                },
            ]}
            title={`Détail Mouvement de Stock #${operation.id}`}
        >
            <Box sx={{ backgroundColor: '#f9fafb', p: 2 }}>
                {/* Header with operation info and actions */}
                <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {getOperationTypeIcon(operation?.typeOperation?.nom)}
                                    Mouvement #{operation.id}
                                    <Chip 
                                        label={operation?.typeOperation?.nom || 'N/A'} 
                                        color={getOperationTypeColor(operation?.typeOperation?.nom)}
                                        size="small"
                                        sx={{ textTransform: 'capitalize', ml: 1 }}
                                    />
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <CalendarIcon fontSize="small" />
                                    {formattedDate}
                                </Typography>
                            </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Imprimer le détail">
                                <IconButton color="primary" onClick={() => window.print()}>
                                    <PrintIcon />
                                </IconButton>
                            </Tooltip>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleEdit}
                                startIcon={<EditIcon />}
                            >
                                Modifier
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleRetour}
                                startIcon={<ArrowBackIcon />}
                            >
                                Retour
                            </Button>
                        </Box>
                    </Box>
                </Paper>
                
                {/* Tabs for different sections */}
                <Box sx={{ mb: 3 }}>
                    <Tabs 
                        value={activeTab} 
                        onChange={handleTabChange} 
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ 
                            backgroundColor: 'white', 
                            borderRadius: '4px', 
                            boxShadow: 1,
                            '& .MuiTab-root': {
                                minWidth: 'unset',
                                padding: '12px 16px'
                            }
                        }}
                    >
                        <Tab 
                            label="Informations Générales" 
                            icon={<InfoIcon />} 
                            iconPosition="start"
                        />
                        <Tab 
                            label="Produits" 
                            icon={<InventoryIcon />} 
                            iconPosition="start"
                        />
                        {operation?.depenses && operation.depenses.length > 0 && (
                            <Tab 
                                label="Dépenses" 
                                icon={<MoneyIcon />} 
                                iconPosition="start"
                            />
                        )}
                    </Tabs>
                </Box>
                
                {/* Tab Content - General Information */}
                {activeTab === 0 && (
                <>
                    {/* Removed duplicate buttons since they're already in the header */}

                    <Grid container spacing={3}>
                        {/* Main Information Card */}
                        <Grid item xs={12} md={6}>
                            <Card elevation={3}>
                                <CardHeader 
                                    title={
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <InfoIcon color="primary" /> 
                                            Informations Principales
                                        </Typography>
                                    }
                                    sx={{ backgroundColor: 'primary.light', color: 'primary.contrastText', py: 1 }}
                                />
                                <CardContent sx={{ pt: 2 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 0.5 }}>
                                                <CalendarIcon fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">Date:</Typography>
                                            </Box>
                                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{formattedDate}</Typography>
                                        </Grid>
                                        
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 0.5 }}>
                                                <ReceiptIcon fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">Type d'opération:</Typography>
                                            </Box>
                                            <Chip 
                                                label={operation?.typeOperation?.nom || 'N/A'} 
                                                color={getOperationTypeColor(operation?.typeOperation?.nom)}
                                                size="small"
                                                icon={getOperationTypeIcon(operation?.typeOperation?.nom)}
                                                sx={{ textTransform: 'capitalize' }}
                                            />
                                        </Grid>
                                        
                                        {operation?.fournisseur && (
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 0.5 }}>
                                                    <FournisseurIcon fontSize="small" color="action" />
                                                    <Typography variant="body2" color="text.secondary">Fournisseur:</Typography>
                                                </Box>
                                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{operation.fournisseur.nom}</Typography>
                                            </Grid>
                                        )}
                                        
                                        {operation?.typeOperation?.nom === 'entrée' && operation?.total > 0 && (
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 0.5 }}>
                                                    <MoneyIcon fontSize="small" color="action" />
                                                    <Typography variant="body2" color="text.secondary">Montant Total:</Typography>
                                                </Box>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                                    {formatNumber(operation.total)} GNF
                                                </Typography>
                                            </Grid>
                                        )}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        {/* Departments Information Card */}
                        <Grid item xs={12} md={6}>
                            <Card elevation={3}>
                                <CardHeader 
                                    title={
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <DepartmentIcon color="primary" /> 
                                            Informations Départements
                                        </Typography>
                                    }
                                    sx={{ backgroundColor: 'info.light', color: 'info.contrastText', py: 1 }}
                                />
                                <CardContent sx={{ pt: 2 }}>
                                    {operation?.departementSource && (
                                        <Box sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 0.5 }}>
                                                <DepartmentIcon fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">Département Source:</Typography>
                                            </Box>
                                            <Chip 
                                                label={operation.departementSource.nom} 
                                                variant="outlined" 
                                                color="error"
                                                size="medium"
                                            />
                                        </Box>
                                    )}
                                    
                                    {operation?.departementDestination && (
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 0.5 }}>
                                                <DepartmentIcon fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">Département Destination:</Typography>
                                            </Box>
                                            <Chip 
                                                label={operation.departementDestination.nom} 
                                                variant="outlined" 
                                                color="success"
                                                size="medium"
                                            />
                                        </Box>
                                    )}
                                    
                                    {!operation?.departementSource && !operation?.departementDestination && (
                                        <Alert severity="info" sx={{ mt: 2 }}>
                                            Aucune information de département spécifiée pour cette opération.
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        {/* Commentary Card (if exists) */}
                        {operation?.commentaire && (
                            <Grid item xs={12}>
                                <Card elevation={3}>
                                    <CardHeader 
                                        title={
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CommentIcon color="primary" /> 
                                                Commentaire
                                            </Typography>
                                        }
                                        sx={{ backgroundColor: 'grey.200', py: 1 }}
                                    />
                                    <CardContent>
                                        <Typography variant="body1" sx={{ 
                                            whiteSpace: 'pre-wrap', 
                                            p: 2, 
                                            backgroundColor: 'grey.50', 
                                            borderRadius: 1,
                                            border: '1px solid',
                                            borderColor: 'grey.200'
                                        }}>
                                            {operation.commentaire}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                </> // Added closing tag here
                )}

                

                {/* Tab Content - Products */}
                {activeTab === 1 && (
                    <Card elevation={3}>
                        <CardHeader 
                            title={
                                <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <InventoryIcon color="primary" /> 
                                    Produits ({operation?.produits?.length || 0})
                                </Typography>
                            }
                            sx={{ backgroundColor: 'success.light', color: 'success.contrastText', py: 1 }}
                        />
                        <CardContent sx={{ p: 0 }}>
                            <Box sx={{ p: 2 }}>
                                <MaterialReactTable table={tableProduits} />
                            </Box>
                            
                            {operation?.typeOperation?.nom === 'entrée' && operation?.totalCommande > 0 && (
                                <Box sx={{ p: 2, backgroundColor: 'grey.100', borderTop: '1px solid', borderColor: 'grey.300', textAlign: 'right' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                        <MoneyIcon color="success" />
                                        Total Produits : {formatNumber(operation.totalCommande)} GNF
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                )}

                
                {/* Tab Content - Expenses */}
                {activeTab === 2 && operation?.depenses && operation.depenses.length > 0 && (
                    <Card elevation={3}>
                        <CardHeader 
                            title={
                                <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <MoneyIcon color="primary" /> 
                                    Dépenses Supplémentaires ({operation.depenses.length})
                                </Typography>
                            }
                            sx={{ backgroundColor: 'warning.light', color: 'warning.contrastText', py: 1 }}
                        />
                        <CardContent sx={{ p: 0 }}>
                            <Box sx={{ p: 2 }}>
                                <MaterialReactTable table={tableDepenses} />
                            </Box>
                            
                            {operation?.totalDepense > 0 && (
                                <Box sx={{ p: 2, backgroundColor: 'grey.100', borderTop: '1px solid', borderColor: 'grey.300', textAlign: 'right' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                        <MoneyIcon color="warning" />
                                        Total Dépenses : {formatNumber(operation.totalDepense)} GNF
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                )}

                
                {/* Grand Total (only shown for entry operations) */}
                {operation?.typeOperation?.nom === 'entrée' && operation?.total > 0 && (
                    <Paper elevation={4} sx={{ p: 3, mt: 3, backgroundColor: 'primary.main', color: 'primary.contrastText', borderRadius: 2 }}>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'medium', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ReceiptIcon /> Récapitulatif
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                Total Général : {formatNumber(operation.total)} GNF
                            </Typography>
                        </Box>
                    </Paper>
                )}
            </Box>
        </PanelLayout>
    );
};

export default Show;
