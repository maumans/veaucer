import React, { useState } from 'react';
import PanelLayout from "@/Layouts/PanelLayout.jsx";
import { router } from "@inertiajs/react";
import { 
    Button, 
    Chip, 
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from "@mui/material";
import { 
    CheckCircle, 
    Cancel,
    ArrowBack
} from "@mui/icons-material";
import dayjs from 'dayjs';

const Show = ({ auth, ajustement, success, error }) => {
    const [openRejetDialog, setOpenRejetDialog] = useState(false);
    const [motifRejet, setMotifRejet] = useState('');
    const [motifRejetError, setMotifRejetError] = useState('');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    // Fonction pour formater le status avec un Chip coloré
    const formatStatus = (status) => {
        let color = 'default';
        let icon = null;

        switch (status) {
            case 'en_attente':
                color = 'warning';
                break;
            case 'validé':
                color = 'success';
                icon = <CheckCircle fontSize="small" />;
                break;
            case 'rejeté':
                color = 'error';
                icon = <Cancel fontSize="small" />;
                break;
            default:
                color = 'default';
        }

        return (
            <Chip 
                label={status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')} 
                color={color} 
                size="small"
                icon={icon}
            />
        );
    };

    // Fonction pour soumettre le rejet
    const handleSubmitRejet = () => {
        if (!motifRejet.trim()) {
            setMotifRejetError('Le motif de rejet est requis');
            return;
        }

        router.post(route('admin.inventaire.ajustement.rejeter', [auth.user.id, ajustement.id]), {
            motif_rejet: motifRejet
        }, {
            onSuccess: () => {
                setOpenRejetDialog(false);
                setMotifRejet('');
            }
        });
    };

    // Fonction pour valider l'ajustement
    const handleValider = () => {
        router.get(route('admin.inventaire.ajustement.valider', [auth.user.id, ajustement.id]));
    };

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
                    active: false
                },
                {
                    text: `Ajustement #${ajustement.id}`,
                    href: route("admin.inventaire.ajustement.show", [auth.user.id, ajustement.id]),
                    active: true
                }
            ]}
        >
            <Paper elevation={3} className="p-6">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5" component="h1">
                        Détails de l'ajustement #{ajustement.id}
                    </Typography>
                    
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => router.get(route('admin.inventaire.ajustement.index', auth.user.id))}
                    >
                        Retour à la liste
                    </Button>
                </Box>
                
                <Grid container spacing={4}>
                    {/* Informations principales */}
                    <Grid item xs={12} md={6}>
                        <Card elevation={2}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Informations générales
                                </Typography>
                                
                                <Divider sx={{ mb: 2 }} />
                                
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle2">Status</Typography>
                                        <Box mt={0.5}>{formatStatus(ajustement.status)}</Box>
                                    </Grid>
                                    
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle2">Date d'ajustement</Typography>
                                        <Typography variant="body2">
                                            {dayjs(ajustement.date_ajustement).format('DD/MM/YYYY HH:mm')}
                                        </Typography>
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2">Produit</Typography>
                                        <Typography variant="body2">
                                            <strong>{ajustement.produit.nom}</strong> ({ajustement.produit.code})
                                        </Typography>
                                    </Grid>
                                    
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle2">Quantité avant</Typography>
                                        <Typography variant="body2">
                                            {ajustement.quantite_avant.toLocaleString('fr-FR')}
                                        </Typography>
                                    </Grid>
                                    
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle2">Quantité après</Typography>
                                        <Typography variant="body2">
                                            {ajustement.quantite_apres.toLocaleString('fr-FR')}
                                        </Typography>
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2">Différence</Typography>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: ajustement.difference === 0 
                                                    ? 'success.main' 
                                                    : ajustement.difference > 0 
                                                        ? 'info.main' 
                                                        : 'error.main',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {ajustement.difference > 0 ? '+' : ''}
                                            {ajustement.difference.toLocaleString('fr-FR')}
                                        </Typography>
                                    </Grid>
                                    
                                    {ajustement.departement && (
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2">Département</Typography>
                                            <Typography variant="body2">
                                                {ajustement.departement.nom}
                                            </Typography>
                                        </Grid>
                                    )}
                                    
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2">Créé par</Typography>
                                        <Typography variant="body2">
                                            {ajustement.user.prenom} {ajustement.user.nom}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    {/* Motif et notes */}
                    <Grid item xs={12} md={6}>
                        <Card elevation={2}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Motif et notes
                                </Typography>
                                
                                <Divider sx={{ mb: 2 }} />
                                
                                <Box mb={3}>
                                    <Typography variant="subtitle2">Motif de l'ajustement</Typography>
                                    <Typography variant="body2" sx={{ mt: 1, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                        {ajustement.motif}
                                    </Typography>
                                </Box>
                                
                                {ajustement.notes && (
                                    <Box>
                                        <Typography variant="subtitle2">Notes additionnelles</Typography>
                                        <Typography variant="body2" sx={{ mt: 1, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, whiteSpace: 'pre-line' }}>
                                            {ajustement.notes}
                                        </Typography>
                                    </Box>
                                )}
                                
                                {ajustement.inventaire_physique_id && (
                                    <Box mt={3}>
                                        <Typography variant="subtitle2">Origine</Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            Cet ajustement a été généré à partir de l'inventaire physique #{ajustement.inventaire_physique_id}.
                                            <Button 
                                                size="small" 
                                                sx={{ ml: 1 }}
                                                onClick={() => router.get(route('admin.inventaire.physique.show', [auth.user.id, ajustement.inventaire_physique_id]))}
                                            >
                                                Voir l'inventaire
                                            </Button>
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                        
                        {/* Actions */}
                        {ajustement.status === 'en_attente' && (
                            <Card elevation={2} sx={{ mt: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Actions
                                    </Typography>
                                    
                                    <Divider sx={{ mb: 2 }} />
                                    
                                    <Box display="flex" gap={2}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            startIcon={<CheckCircle />}
                                            onClick={() => setOpenConfirmDialog(true)}
                                            fullWidth
                                        >
                                            Valider l'ajustement
                                        </Button>
                                        
                                        <Button
                                            variant="contained"
                                            color="error"
                                            startIcon={<Cancel />}
                                            onClick={() => setOpenRejetDialog(true)}
                                            fullWidth
                                        >
                                            Rejeter l'ajustement
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        )}
                    </Grid>
                </Grid>
                
                {/* Boîte de dialogue pour rejeter un ajustement */}
                <Dialog open={openRejetDialog} onClose={() => setOpenRejetDialog(false)}>
                    <DialogTitle>Rejeter l'ajustement</DialogTitle>
                    <DialogContent>
                        <div>
                            <p className="mb-4">
                                Vous êtes sur le point de rejeter l'ajustement pour le produit 
                                <strong> {ajustement.produit.nom}</strong> avec une différence de 
                                <strong> {ajustement.difference > 0 ? '+' : ''}{ajustement.difference}</strong>.
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
                
                {/* Boîte de dialogue de confirmation de validation */}
                <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
                    <DialogTitle>Confirmation</DialogTitle>
                    <DialogContent>
                        <p>
                            Êtes-vous sûr de vouloir valider cet ajustement ? Le stock du produit "{ajustement.produit.nom}" 
                            sera ajusté de {ajustement.difference > 0 ? '+' : ''}{ajustement.difference}.
                        </p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenConfirmDialog(false)} color="error">
                            Annuler
                        </Button>
                        <Button onClick={handleValider} color="primary" variant="contained">
                            Confirmer
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </PanelLayout>
    );
};

export default Show;
