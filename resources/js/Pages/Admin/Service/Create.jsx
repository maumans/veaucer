import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import PanelLayout from '@/Layouts/PanelLayout';
import { Button, TextField, Paper, FormControlLabel, Switch, Grid, Typography, Divider } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TimerIcon from '@mui/icons-material/Timer';
import GroupIcon from '@mui/icons-material/Group';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { router } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        description: '',
        prix: 0,
        duree: 0,
        nombreClients: 0,
        nombreTablesReservees: 0,
        recetteTotale: 0,
        etat: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.service.store', [auth.user.id]));
    };

    return (
        <PanelLayout
            auth={auth}
            active={'parametrage'}
            sousActive={'service'}
            breadcrumbs={[
                {
                    text: "Service",
                    href: route("admin.service.index", [auth.user.id]),
                    active: false
                },
                {
                    text: "Création",
                    href: route("admin.service.create", [auth.user.id]),
                    active: true
                }
            ]}
        >
            <Head title="Créer un service" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Créer un nouveau service</h1>
                    <p className="text-gray-500 mt-1">Remplissez les informations ci-dessous pour créer un nouveau service</p>
                </div>

                <Paper elevation={0} className="p-6">
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h6" className="flex items-center gap-2 mb-2">
                                    <CategoryIcon className="text-orange-500" />
                                    Informations de base
                                </Typography>
                                <Divider className="mb-4" />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Nom du service"
                                    value={data.nom}
                                    onChange={e => setData('nom', e.target.value)}
                                    error={errors.nom}
                                    helperText={errors.nom}
                                    required
                                    InputProps={{
                                        startAdornment: <CategoryIcon className="text-gray-400 mr-2" />
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    error={errors.description}
                                    helperText={errors.description}
                                    multiline
                                    rows={4}
                                    InputProps={{
                                        startAdornment: <DescriptionIcon className="text-gray-400 mr-2" />
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" className="flex items-center gap-2 mb-2">
                                    <AttachMoneyIcon className="text-green-500" />
                                    Détails financiers
                                </Typography>
                                <Divider className="mb-4" />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Prix"
                                    type="number"
                                    value={data.prix}
                                    onChange={e => setData('prix', parseFloat(e.target.value))}
                                    error={errors.prix}
                                    helperText={errors.prix}
                                    required
                                    InputProps={{
                                        endAdornment: 'GNF',
                                        inputProps: { min: 0, step: 0.01 }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Recette totale"
                                    type="number"
                                    value={data.recetteTotale}
                                    onChange={e => setData('recetteTotale', parseFloat(e.target.value))}
                                    error={errors.recetteTotale}
                                    helperText={errors.recetteTotale}
                                    InputProps={{
                                        endAdornment: <AccountBalanceWalletIcon className="text-gray-400 mr-2" />,
                                        inputProps: { min: 0, step: 0.01 }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" className="flex items-center gap-2 mb-2">
                                    <TimerIcon className="text-blue-500" />
                                    Détails opérationnels
                                </Typography>
                                <Divider className="mb-4" />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Durée (minutes)"
                                    type="number"
                                    value={data.duree}
                                    onChange={e => setData('duree', parseInt(e.target.value))}
                                    error={errors.duree}
                                    helperText={errors.duree}
                                    required
                                    InputProps={{
                                        endAdornment: <TimerIcon className="text-gray-400 mr-2" />,
                                        inputProps: { min: 0 }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Nombre de clients maximum"
                                    type="number"
                                    value={data.nombreClients}
                                    onChange={e => setData('nombreClients', parseInt(e.target.value))}
                                    error={errors.nombreClients}
                                    helperText={errors.nombreClients}
                                    required
                                    InputProps={{
                                        endAdornment: <GroupIcon className="text-gray-400 mr-2" />,
                                        inputProps: { min: 0 }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Nombre de tables réservées"
                                    type="number"
                                    value={data.nombreTablesReservees}
                                    onChange={e => setData('nombreTablesReservees', parseInt(e.target.value))}
                                    error={errors.nombreTablesReservees}
                                    helperText={errors.nombreTablesReservees}
                                    required
                                    InputProps={{
                                        endAdornment: <TableRestaurantIcon className="text-gray-400 mr-2" />,
                                        inputProps: { min: 0 }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={data.etat}
                                            onChange={e => setData('etat', e.target.checked)}
                                        />
                                    }
                                    label="Service actif"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <div className="flex justify-end space-x-4">
                                    <Button
                                        variant="outlined"
                                        onClick={() => router.get(route('admin.service.index', [auth.user.id]))}
                                        className="text-gray-500 border-gray-500 hover:bg-gray-50"
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={processing}
                                        className="bg-orange-500 hover:bg-orange-600"
                                    >
                                        Créer le service
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </div>
        </PanelLayout>
    );
} 