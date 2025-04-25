import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import PanelLayout from '@/Layouts/PanelLayout';
import { Button, TextField, Paper, FormControlLabel, Switch, Grid, Typography, Divider, MenuItem } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import { router } from '@inertiajs/react';

export default function Edit({ auth, caisse, employes }) {
    const { data, setData, put, processing, errors } = useForm({
        nom: caisse.nom,
        solde: caisse.solde,
        description: caisse.description || '',
        responsable_id: caisse.responsable_id || '',
        status: caisse.status
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.caisse.update', [auth.user.id, caisse.id]));
    };

    return (
        <PanelLayout
            auth={auth}
            active={'parametrage'}
            sousActive={'caisse'}
            breadcrumbs={[
                {
                    text: "Caisse",
                    href: route("admin.caisse.index", [auth.user.id]),
                    active: false
                },
                {
                    text: "Modification",
                    href: route("admin.caisse.edit", [auth.user.id, caisse.id]),
                    active: true
                }
            ]}
        >
            <Head title="Modifier la caisse" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Modifier la caisse</h1>
                    <p className="text-gray-500 mt-1">Modifiez les informations de la caisse ci-dessous</p>
                </div>

                <Paper elevation={0} className="p-6">
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h6" className="flex items-center gap-2 mb-2">
                                    <AccountBalanceIcon className="text-orange-500" />
                                    Informations de la caisse
                                </Typography>
                                <Divider className="mb-4" />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Nom de la caisse"
                                    value={data.nom}
                                    onChange={e => setData('nom', e.target.value)}
                                    error={errors.nom}
                                    helperText={errors.nom}
                                    required
                                    InputProps={{
                                        startAdornment: <AccountBalanceIcon className="text-gray-400 mr-2" />
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
                                <Typography variant="h6" className="flex items-center gap-2 mb-2 mt-4">
                                    <AttachMoneyIcon className="text-orange-500" />
                                    Détails financiers
                                </Typography>
                                <Divider className="mb-4" />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Solde"
                                    type="number"
                                    value={data.solde}
                                    onChange={e => setData('solde', e.target.value)}
                                    error={errors.solde}
                                    helperText={errors.solde}
                                    required
                                    InputProps={{
                                        startAdornment: <AttachMoneyIcon className="text-gray-400 mr-2" />
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Responsable"
                                    value={data.responsable_id}
                                    onChange={e => setData('responsable_id', e.target.value)}
                                    error={errors.responsable_id}
                                    helperText={errors.responsable_id}
                                    InputProps={{
                                        startAdornment: <PersonIcon className="text-gray-400 mr-2" />
                                    }}
                                >
                                    {employes.map((employe) => (
                                        <MenuItem key={employe.id} value={employe.id}>
                                            {employe.nom} {employe.prenom}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" className="flex items-center gap-2 mb-2 mt-4">
                                    <DescriptionIcon className="text-orange-500" />
                                    Paramètres
                                </Typography>
                                <Divider className="mb-4" />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={data.status}
                                            onChange={e => setData('status', e.target.checked)}
                                        />
                                    }
                                    label="Caisse active"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <div className="flex justify-end space-x-4">
                                    <Button
                                        variant="outlined"
                                        onClick={() => router.get(route('admin.caisse.index', [auth.user.id]))}
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
                                        Enregistrer les modifications
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