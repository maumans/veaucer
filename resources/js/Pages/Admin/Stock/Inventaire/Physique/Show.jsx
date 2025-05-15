import React, { useState } from 'react';
import PanelLayout from '@/Layouts/PanelLayout';
import { router } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    LinearProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import {
    Add,
    ArrowBack,
    CheckCircle,
    Close,
    Done,
    Edit,
    PlayArrow,
    Refresh,
    Stop,
    Warning,
    Cancel,
    CompareArrows
} from '@mui/icons-material';
import dayjs from 'dayjs';

function Show({ auth, errors, inventaire, stats, details, error, success }) {
    // États pour la pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // État pour le dialogue de comptage
    const [openCompterDialog, setOpenCompterDialog] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [quantiteComptee, setQuantiteComptee] = useState('');
    const [notes, setNotes] = useState('');

    // Gestion de la pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Ouvrir le dialogue de comptage
    const handleOpenCompterDialog = (detail) => {
        setSelectedDetail(detail);
        setQuantiteComptee(detail.quantite_comptee || '');
        setNotes(detail.notes || '');
        setOpenCompterDialog(true);
    };

    // Fermer le dialogue de comptage
    const handleCloseCompterDialog = () => {
        setOpenCompterDialog(false);
    };

    // Soumettre le comptage
    const handleSubmitComptage = () => {
        router.post(route('admin.inventaire.physique.compter', [auth.user.id, inventaire.id, selectedDetail.id]), {
            quantite_comptee: quantiteComptee,
            notes: notes
        });
        handleCloseCompterDialog();
    };

    // Valider un produit compté
    const handleValiderProduit = (detailId) => {
        router.post(route('admin.inventaire.physique.valider', [auth.user.id, inventaire.id, detailId]));
    };

    // Démarrer l'inventaire
    const handleDemarrerInventaire = () => {
        router.get(route('admin.inventaire.physique.demarrer', [auth.user.id, inventaire.id]));
    };

    // Terminer l'inventaire
    const handleTerminerInventaire = () => {
        router.get(route('admin.inventaire.physique.terminer', [auth.user.id, inventaire.id]));
    };

    // Annuler l'inventaire
    const handleAnnulerInventaire = () => {
        router.get(route('admin.inventaire.physique.annuler', [auth.user.id, inventaire.id]));
    };

    // Générer les ajustements
    const handleGenererAjustements = () => {
        router.get(route('admin.inventaire.physique.generer-ajustements', [auth.user.id, inventaire.id]));
    };

    // Déterminer la couleur du status
    const getStatusColor = (status) => {
        switch (status) {
            case 'planifié': return 'info';
            case 'en_cours': return 'warning';
            case 'terminé': return 'success';
            case 'annulé': return 'error';
            default: return 'default';
        }
    };

    // Déterminer la couleur de l'écart
    const getDifferenceColor = (difference) => {
        if (!difference) return 'inherit';
        return difference > 0 ? 'success.main' : difference < 0 ? 'error.main' : 'inherit';
    };

    // Formater la date
    const formatDate = (date) => {
        return date ? dayjs(date).format('DD/MM/YYYY') : '-';
    };

    return (
        <PanelLayout
            auth={auth}
            errors={errors}
            error={error}
            success={success}
            active={'stock'}
            sousActive={'inventaire'}
            breadcrumbs={[
                {
                    text: "Inventaires",
                    href: route("admin.stock.inventaire.index", [auth.user.id]),
                    active: false
                },
                {
                    text: "Inventaires Physiques",
                    href: route("admin.inventaire.physique.index", [auth.user.id]),
                    active: false
                },
                {
                    text: `Inventaire #${inventaire.id}`,
                    href: route("admin.inventaire.physique.show", [auth.user.id, inventaire.id]),
                    active: true
                }
            ]}
        >
            <div className="space-y-6">
                {/* En-tête avec informations générales */}
                <div className="flex justify-between items-center">
                    <div>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Inventaire Physique #{inventaire.id}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            {inventaire.description || 'Aucune description'}
                        </Typography>
                    </div>
                    <Chip 
                        label={inventaire.status.replace('_', ' ').toUpperCase()} 
                        color={getStatusColor(inventaire.status)} 
                        size="medium"
                    />
                </div>
                <Box display="flex" justifyContent="flex-end" mb={2}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => router.get(route('admin.inventaire.physique.index', auth.user.id))}
                    >
                        Retour à la liste
                    </Button>
                </Box>
                {/* Informations détaillées */}
                <Paper elevation={2} className="p-4">
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>Informations générales</Typography>
                            <Box className="space-y-2">
                                <Box className="flex justify-between">
                                    <Typography variant="body1" color="textSecondary">Département:</Typography>
                                    <Typography variant="body1">{inventaire.departement?.nom || 'Tous les départements'}</Typography>
                                </Box>
                                <Box className="flex justify-between">
                                    <Typography variant="body1" color="textSecondary">Date de début:</Typography>
                                    <Typography variant="body1">{formatDate(inventaire.date_debut)}</Typography>
                                </Box>
                                <Box className="flex justify-between">
                                    <Typography variant="body1" color="textSecondary">Date de fin prévue:</Typography>
                                    <Typography variant="body1">{formatDate(inventaire.date_fin)}</Typography>
                                </Box>
                                <Box className="flex justify-between">
                                    <Typography variant="body1" color="textSecondary">Créé par:</Typography>
                                    <Typography variant="body1">{inventaire.user?.name || 'Inconnu'}</Typography>
                                </Box>
                                <Box className="flex justify-between">
                                    <Typography variant="body1" color="textSecondary">Notes:</Typography>
                                    <Typography variant="body1">{inventaire.notes || 'Aucune note'}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>Statistiques</Typography>
                            <Box className="space-y-2">
                                <Box className="flex justify-between">
                                    <Typography variant="body1" color="textSecondary">Total produits:</Typography>
                                    <Typography variant="body1">{stats.total_produits}</Typography>
                                </Box>
                                <Box className="flex justify-between">
                                    <Typography variant="body1" color="textSecondary">Produits comptés:</Typography>
                                    <Typography variant="body1">{stats.produits_comptes}</Typography>
                                </Box>
                                <Box className="flex justify-between">
                                    <Typography variant="body1" color="textSecondary">Produits à compter:</Typography>
                                    <Typography variant="body1">{stats.produits_a_compter}</Typography>
                                </Box>
                                <Box className="flex justify-between">
                                    <Typography variant="body1" color="textSecondary">Écarts positifs:</Typography>
                                    <Typography variant="body1" color="success.main">{stats.ecarts_positifs}</Typography>
                                </Box>
                                <Box className="flex justify-between">
                                    <Typography variant="body1" color="textSecondary">Écarts négatifs:</Typography>
                                    <Typography variant="body1" color="error.main">{stats.ecarts_negatifs}</Typography>
                                </Box>
                                <Box className="mt-4">
                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                        Progression: {stats.progression}%
                                    </Typography>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={stats.progression} 
                                        color={stats.progression < 50 ? "error" : stats.progression < 100 ? "warning" : "success"} 
                                    />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Actions */}
                <Box className="flex flex-wrap gap-2">
                    {inventaire.status === 'planifié' && (
                        <Button 
                            variant="contained" 
                            color="primary"
                            startIcon={<PlayArrow />}
                            onClick={handleDemarrerInventaire}
                        >
                            Démarrer l'inventaire
                        </Button>
                    )}
                    {inventaire.status === 'en_cours' && (
                        <Button 
                            variant="contained" 
                            color="success"
                            startIcon={<Stop />}
                            onClick={handleTerminerInventaire}
                        >
                            Terminer l'inventaire
                        </Button>
                    )}
                    {(inventaire.status === 'planifié' || inventaire.status === 'en_cours') && (
                        <Button 
                            variant="contained" 
                            color="error"
                            startIcon={<Cancel />}
                            onClick={handleAnnulerInventaire}
                        >
                            Annuler l'inventaire
                        </Button>
                    )}
                    {inventaire.status === 'terminé' && (
                        <Button 
                            variant="contained" 
                            color="secondary"
                            startIcon={<CompareArrows />}
                            onClick={handleGenererAjustements}
                        >
                            Générer les ajustements
                        </Button>
                    )}
                </Box>

                {/* Liste des produits */}
                <Paper elevation={2} className="p-4">
                    <Typography variant="h6" gutterBottom>Liste des produits</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Produit</TableCell>
                                    <TableCell align="right">Quantité théorique</TableCell>
                                    <TableCell align="right">Quantité comptée</TableCell>
                                    <TableCell align="right">Différence</TableCell>
                                    <TableCell>Statut</TableCell>
                                    <TableCell>Notes</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {details
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((detail) => (
                                        <TableRow key={detail.id}>
                                            <TableCell>{detail.produit?.nom || 'Produit inconnu'}</TableCell>
                                            <TableCell align="right">{detail.quantite_theorique}</TableCell>
                                            <TableCell align="right">{detail.quantite_comptee !== null ? detail.quantite_comptee : '-'}</TableCell>
                                            <TableCell align="right">
                                                {detail.difference !== null ? (
                                                    <Typography color={getDifferenceColor(detail.difference)}>
                                                        {detail.difference > 0 ? '+' : ''}{detail.difference}
                                                    </Typography>
                                                ) : '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={detail.status.replace('_', ' ').toUpperCase()} 
                                                    color={
                                                        detail.status === 'en_attente' ? 'warning' :
                                                        detail.status === 'validé' ? 'success' :
                                                        detail.status === 'ajusté' ? 'info' : 'default'
                                                    } 
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{detail.notes || '-'}</TableCell>
                                            <TableCell>
                                                {inventaire.status === 'en_cours' && (
                                                    <Box className="flex gap-1">
                                                        <Tooltip title="Compter">
                                                            <IconButton 
                                                                color="primary" 
                                                                size="small"
                                                                onClick={() => handleOpenCompterDialog(detail)}
                                                            >
                                                                <Edit fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        {detail.quantite_comptee !== null && detail.status === 'en_attente' && (
                                                            <Tooltip title="Valider">
                                                                <IconButton 
                                                                    color="success" 
                                                                    size="small"
                                                                    onClick={() => handleValiderProduit(detail.id)}
                                                                >
                                                                    <CheckCircle fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </Box>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={details.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Lignes par page"
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
                    />
                </Paper>

                {/* Dialogue pour compter un produit */}
                <Dialog open={openCompterDialog} onClose={handleCloseCompterDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>Compter le produit</DialogTitle>
                    <DialogContent>
                        <Box className="mt-2 space-y-4">
                            <Box className="flex justify-between">
                                <Typography variant="body1" color="textSecondary">Produit:</Typography>
                                <Typography variant="body1">{selectedDetail?.produit?.nom || 'Produit inconnu'}</Typography>
                            </Box>
                            <Box className="flex justify-between">
                                <Typography variant="body1" color="textSecondary">Quantité théorique:</Typography>
                                <Typography variant="body1">{selectedDetail?.quantite_theorique || 0}</Typography>
                            </Box>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Quantité comptée"
                                type="number"
                                fullWidth
                                value={quantiteComptee}
                                onChange={(e) => setQuantiteComptee(e.target.value)}
                                inputProps={{ min: 0 }}
                            />
                            <TextField
                                margin="dense"
                                label="Notes"
                                type="text"
                                fullWidth
                                multiline
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseCompterDialog} color="inherit" startIcon={<Close />}>
                            Annuler
                        </Button>
                        <Button onClick={handleSubmitComptage} color="primary" variant="contained" startIcon={<Done />}>
                            Enregistrer
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </PanelLayout>
    );
}

export default Show;