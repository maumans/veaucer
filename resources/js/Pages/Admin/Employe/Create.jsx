import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import PanelLayout from '@/Layouts/PanelLayout';
import { Button, TextField, Paper, FormControlLabel, Switch, Grid, Typography, Divider, MenuItem } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import { router } from '@inertiajs/react';

export default function Create({ auth, postes, departements }) {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        adresse: '',
        poste_id: '',
        departement_id: '',
        status: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.employe.store', [auth.user.id]));
    };

    return (
        <PanelLayout
            auth={auth}
            active={'parametrage'}
            sousActive={'employe'}
            breadcrumbs={[
                {
                    text: "Employé",
                    href: route("admin.employe.index", [auth.user.id]),
                    active: false
                },
                {
                    text: "Création",
                    href: route("admin.employe.create", [auth.user.id]),
                    active: true
                }
            ]}
        >
            <Head title="Créer un employé" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Créer un nouvel employé</h1>
                    <p className="text-gray-500 mt-1">Remplissez les informations ci-dessous pour créer un nouvel employé</p>
                </div>

                <Paper elevation={0} className="p-6">
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h6" className="flex items-center gap-2 mb-2">
                                    <PersonIcon className="text-orange-500" />
                                    Informations personnelles
                                </Typography>
                                <Divider className="mb-4" />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Nom"
                                    value={data.nom}
                                    onChange={e => setData('nom', e.target.value)}
                                    error={errors.nom}
                                    helperText={errors.nom}
                                    required
                                    InputProps={{
                                        startAdornment: <PersonIcon className="text-gray-400 mr-2" />
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Prénom"
                                    value={data.prenom}
                                    onChange={e => setData('prenom', e.target.value)}
                                    error={errors.prenom}
                                    helperText={errors.prenom}
                                    required
                                    InputProps={{
                                        startAdornment: <PersonIcon className="text-gray-400 mr-2" />
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    error={errors.email}
                                    helperText={errors.email}
                                    required
                                    InputProps={{
                                        startAdornment: <EmailIcon className="text-gray-400 mr-2" />
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Téléphone"
                                    value={data.telephone}
                                    onChange={e => setData('telephone', e.target.value)}
                                    error={errors.telephone}
                                    helperText={errors.telephone}
                                    InputProps={{
                                        startAdornment: <PhoneIcon className="text-gray-400 mr-2" />
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Adresse"
                                    value={data.adresse}
                                    onChange={e => setData('adresse', e.target.value)}
                                    error={errors.adresse}
                                    helperText={errors.adresse}
                                    multiline
                                    rows={2}
                                    InputProps={{
                                        startAdornment: <LocationOnIcon className="text-gray-400 mr-2" />
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" className="flex items-center gap-2 mb-2 mt-4">
                                    <WorkIcon className="text-orange-500" />
                                    Informations professionnelles
                                </Typography>
                                <Divider className="mb-4" />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Poste"
                                    value={data.poste_id}
                                    onChange={e => setData('poste_id', e.target.value)}
                                    error={errors.poste_id}
                                    helperText={errors.poste_id}
                                    InputProps={{
                                        startAdornment: <WorkIcon className="text-gray-400 mr-2" />
                                    }}
                                >
                                    {postes.map((poste) => (
                                        <MenuItem key={poste.id} value={poste.id}>
                                            {poste.titre}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Département"
                                    value={data.departement_id}
                                    onChange={e => setData('departement_id', e.target.value)}
                                    error={errors.departement_id}
                                    helperText={errors.departement_id}
                                    InputProps={{
                                        startAdornment: <BusinessIcon className="text-gray-400 mr-2" />
                                    }}
                                >
                                    {departements.map((departement) => (
                                        <MenuItem key={departement.id} value={departement.id}>
                                            {departement.nom}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" className="flex items-center gap-2 mb-2 mt-4">
                                    <WorkIcon className="text-orange-500" />
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
                                    label="Employé actif"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <div className="flex justify-end space-x-4">
                                    <Button
                                        variant="outlined"
                                        onClick={() => router.get(route('admin.employe.index', [auth.user.id]))}
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
                                        Créer l'employé
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