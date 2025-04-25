import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import PanelLayout from '@/Layouts/PanelLayout';
import { Button, TextField, Paper, FormControlLabel, Switch, Grid, Typography, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { router } from '@inertiajs/react';

export default function Edit({ auth, client }) {
    const { data, setData, put, processing, errors } = useForm({
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        telephone: client.telephone || '',
        adresse: client.adresse || '',
        password: '',
        password_confirmation: '',
        status: client.status
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.client.update', [auth.user.id, client.id]));
    };

    return (
        <PanelLayout
            auth={auth}
            active={'parametrage'}
            sousActive={'client'}
            breadcrumbs={[
                {
                    text: "Client",
                    href: route("admin.client.index", [auth.user.id]),
                    active: false
                },
                {
                    text: "Modification",
                    href: route("admin.client.edit", [auth.user.id, client.id]),
                    active: true
                }
            ]}
        >
            <Head title="Modifier le client" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Modifier le client</h1>
                    <p className="text-gray-500 mt-1">Modifiez les informations du client ci-dessous</p>
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

                            <Grid item xs={12}>
                                <Typography variant="h6" className="flex items-center gap-2 mb-2 mt-4">
                                    <EmailIcon className="text-orange-500" />
                                    Informations de contact
                                </Typography>
                                <Divider className="mb-4" />
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
                                    rows={3}
                                    InputProps={{
                                        startAdornment: <LocationOnIcon className="text-gray-400 mr-2" />
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" className="flex items-center gap-2 mb-2 mt-4">
                                    <PersonIcon className="text-orange-500" />
                                    Sécurité
                                </Typography>
                                <Divider className="mb-4" />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Nouveau mot de passe"
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    error={errors.password}
                                    helperText={errors.password}
                                    placeholder="Laisser vide pour ne pas modifier"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Confirmer le nouveau mot de passe"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    error={errors.password_confirmation}
                                    helperText={errors.password_confirmation}
                                    placeholder="Laisser vide pour ne pas modifier"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={data.status}
                                            onChange={e => setData('status', e.target.checked)}
                                        />
                                    }
                                    label="Compte actif"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <div className="flex justify-end space-x-4">
                                    <Button
                                        variant="outlined"
                                        onClick={() => router.get(route('admin.client.index', [auth.user.id]))}
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