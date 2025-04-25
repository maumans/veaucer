import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import PanelLayout from '@/Layouts/PanelLayout';
import { Button, TextField, Paper, FormControlLabel, Switch, Grid, Typography, Divider } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import { router } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        adresse: '',
        telephone: '',
        email: '',
        nomContact: '',
        prenomContact: '',
        principal: false,
        status: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.fournisseur.store', [auth.user.id]));
    };

    return (
        <PanelLayout
            auth={auth}
            active={'parametrage'}
            sousActive={'fournisseur'}
            breadcrumbs={[
                {
                    text: "Fournisseur",
                    href: route("admin.fournisseur.index", [auth.user.id]),
                    active: false
                },
                {
                    text: "Création",
                    href: route("admin.fournisseur.create", [auth.user.id]),
                    active: true
                }
            ]}
        >
            <Head title="Créer un fournisseur" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Créer un nouveau fournisseur</h1>
                    <p className="text-gray-500 mt-1">Remplissez les informations ci-dessous pour créer un nouveau fournisseur</p>
                </div>

                <Paper elevation={0} className="p-6">
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h6" className="flex items-center gap-2 mb-2">
                                    <BusinessIcon className="text-orange-500" />
                                    Informations de l'entreprise
                                </Typography>
                                <Divider className="mb-4" />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Nom de l'entreprise"
                                    value={data.nom}
                                    onChange={e => setData('nom', e.target.value)}
                                    error={errors.nom}
                                    helperText={errors.nom}
                                    required
                                    InputProps={{
                                        startAdornment: <BusinessIcon className="text-gray-400 mr-2" />
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

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    error={errors.email}
                                    helperText={errors.email}
                                    InputProps={{
                                        startAdornment: <EmailIcon className="text-gray-400 mr-2" />
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
                                    <PersonIcon className="text-orange-500" />
                                    Informations du contact
                                </Typography>
                                <Divider className="mb-4" />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Nom du contact"
                                    value={data.nomContact}
                                    onChange={e => setData('nomContact', e.target.value)}
                                    error={errors.nomContact}
                                    helperText={errors.nomContact}
                                    InputProps={{
                                        startAdornment: <PersonIcon className="text-gray-400 mr-2" />
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Prénom du contact"
                                    value={data.prenomContact}
                                    onChange={e => setData('prenomContact', e.target.value)}
                                    error={errors.prenomContact}
                                    helperText={errors.prenomContact}
                                    InputProps={{
                                        startAdornment: <PersonIcon className="text-gray-400 mr-2" />
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" className="flex items-center gap-2 mb-2 mt-4">
                                    <DescriptionIcon className="text-orange-500" />
                                    Paramètres
                                </Typography>
                                <Divider className="mb-4" />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={data.principal}
                                            onChange={e => setData('principal', e.target.checked)}
                                        />
                                    }
                                    label="Fournisseur principal"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={data.status}
                                            onChange={e => setData('status', e.target.checked)}
                                        />
                                    }
                                    label="Fournisseur actif"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <div className="flex justify-end space-x-4">
                                    <Button
                                        variant="outlined"
                                        onClick={() => router.get(route('admin.fournisseur.index', [auth.user.id]))}
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
                                        Créer le fournisseur
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