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
    Box
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

const Create = ({ auth, departements, success, error }) => {
    const { data, setData, post, processing, errors } = useForm({
        date_debut: dayjs(),
        departement_id: '',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.inventaire.physique.store', auth.user.id));
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
                    text: "Inventaire Physique",
                    href: route("admin.inventaire.physique.index", [auth.user.id]),
                    active: false
                },
                {
                    text: "Nouvel Inventaire",
                    href: route("admin.inventaire.physique.create", [auth.user.id]),
                    active: true
                }
            ]}
        >
            <Paper elevation={3} className="p-6">
                <Typography variant="h5" component="h1" gutterBottom>
                    Créer un nouvel inventaire physique
                </Typography>
                
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                                <DatePicker
                                    label="Date de début"
                                    value={data.date_debut}
                                    onChange={(newValue) => setData('date_debut', newValue)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            variant: 'outlined',
                                            error: !!errors.date_debut,
                                            helperText: errors.date_debut
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth error={!!errors.departement_id}>
                                <InputLabel id="departement-label">Département</InputLabel>
                                <Select
                                    labelId="departement-label"
                                    value={data.departement_id}
                                    onChange={(e) => setData('departement_id', e.target.value)}
                                    label="Département"
                                >
                                    <MenuItem value="">Tous les départements</MenuItem>
                                    {departements.map((departement) => (
                                        <MenuItem key={departement.id} value={departement.id}>
                                            {departement.nom}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.departement_id && (
                                    <FormHelperText>{errors.departement_id}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs={12}>
                            <TextField
                                label="Notes"
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
                                    onClick={() => router.get(route('admin.inventaire.physique.index', auth.user.id))}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={processing}
                                >
                                    Créer l'inventaire
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
