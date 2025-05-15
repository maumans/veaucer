import React, { useState } from 'react';
import PanelLayout from "@/Layouts/PanelLayout.jsx";
import { router, useForm } from "@inertiajs/react";
import { 
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Grid,
    Paper,
    Typography,
    Box,
    Autocomplete
} from "@mui/material";
import dayjs from 'dayjs';

const Create = ({ auth, produits, departements, success, error }) => {
    const [selectedProduit, setSelectedProduit] = useState(null);
    const [stockActuel, setStockActuel] = useState(0);
    const [selectedDepartement, setSelectedDepartement] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        produit_id: '',
        quantite_apres: '',
        motif: '',
        departement_id: '',
        notes: '',
    });

    // Mettre à jour le stock actuel lorsqu'un produit est sélectionné
    const handleProduitChange = (event, newValue) => {
        if (newValue) {
            setSelectedProduit(newValue);
            updateStockActuel(newValue, selectedDepartement);
            setData('produit_id', newValue.id);
        } else {
            setSelectedProduit(null);
            setStockActuel(0);
            setData('produit_id', '');
        }
    };
    
    // Mettre à jour le stock actuel lorsqu'un département est sélectionné
    const handleDepartementChange = (e) => {
        const departementId = e.target.value;
        setSelectedDepartement(departementId);
        setData('departement_id', departementId);
        
        if (selectedProduit) {
            updateStockActuel(selectedProduit, departementId);
        }
    };
    
    // Fonction pour mettre à jour le stock actuel en fonction du produit et du département
    const updateStockActuel = (produit, departementId) => {
        if (!produit) return;
        
        if (departementId) {
            // Si un département est sélectionné, chercher le stock spécifique à ce département
            const stockDepartement = produit.stocks?.find(stock => stock.departement_id == departementId);
            console.log('Stock département trouvé:', stockDepartement);
            setStockActuel(stockDepartement ? stockDepartement.quantite : 0);
        } else {
            // Sinon, utiliser le stock global
            setStockActuel(produit.stockGlobal || 0);
        }
        
        // Log pour débogage
        console.log('Produit:', produit);
        console.log('Département ID:', departementId);
        console.log('Stocks disponibles:', produit.stocks);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.inventaire.ajustement.store', auth.user.id));
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
                    text: "Nouvel ajustement",
                    href: route("admin.inventaire.ajustement.create", [auth.user.id]),
                    active: true
                }
            ]}
        >
            <Paper elevation={3} className="p-6">
                <Typography variant="h5" component="h1" gutterBottom>
                    Créer un nouvel ajustement d'inventaire
                </Typography>
                
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={produits}
                                getOptionLabel={(option) => option.nom}
                                value={selectedProduit}
                                onChange={handleProduitChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Produit"
                                        error={!!errors.produit_id}
                                        helperText={errors.produit_id}
                                        fullWidth
                                        required
                                    />
                                )}
                            />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel id="departement-label">Département</InputLabel>
                                <Select
                                    labelId="departement-label"
                                    value={data.departement_id}
                                    onChange={handleDepartementChange}
                                    label="Département (optionnel)"
                                    error={!!errors.departement_id}
                                >
                                    <MenuItem value=""><em>Stock global (tous les départements)</em></MenuItem>
                                    {departements.map((departement) => (
                                        <MenuItem key={departement.id} value={departement.id}>
                                            {departement.nom}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.departement_id && (
                                    <FormHelperText error>{errors.departement_id}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Quantité actuelle"
                                value={stockActuel}
                                fullWidth
                                disabled
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Nouvelle quantité"
                                type="number"
                                fullWidth
                                required
                                value={data.quantite_apres}
                                onChange={(e) => setData('quantite_apres', e.target.value)}
                                error={!!errors.quantite_apres}
                                helperText={errors.quantite_apres}
                                inputProps={{ min: 0 }}
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <TextField
                                label="Motif de l'ajustement"
                                fullWidth
                                required
                                value={data.motif}
                                onChange={(e) => setData('motif', e.target.value)}
                                error={!!errors.motif}
                                helperText={errors.motif}
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <TextField
                                label="Notes additionnelles"
                                multiline
                                rows={4}
                                fullWidth
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                error={!!errors.notes}
                                helperText={errors.notes}
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="flex-end" gap={2}>
                                <Button
                                    variant="outlined"
                                    onClick={() => router.get(route('admin.inventaire.ajustement.index', auth.user.id))}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={processing}
                                >
                                    Créer l'ajustement
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </PanelLayout>
    );
};

export default Create;
