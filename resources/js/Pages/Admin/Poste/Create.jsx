import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import PanelLayout from '@/Layouts/PanelLayout';
import { Button, TextField, Paper, FormControlLabel, Switch, Grid, Typography, Divider } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import DescriptionIcon from '@mui/icons-material/Description';
import { router } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        titre: '',
        description: '',
        status: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.poste.store', [auth.user.id]));
    };

    return (
        <PanelLayout
            auth={auth}
            active={'parametrage'}
            sousActive={'poste'}
            breadcrumbs={[
                {
                    text: "Poste",
                    href: route("admin.poste.index", [auth.user.id]),
                    active: false
                },
                {
                    text: "Création",
                    href: route("admin.poste.create", [auth.user.id]),
                    active: true
                }
            ]}
        >
            <Head title="Créer un poste" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Créer un nouveau poste</h1>
                    <p className="text-gray-500 mt-1">Remplissez les informations ci-dessous pour créer un nouveau poste</p>
                </div>

                <Paper elevation={0} className="p-6">
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h6" className="flex items-center gap-2 mb-2">
                                    <WorkIcon className="text-orange-500" />
                                    Informations du poste
                                </Typography>
                                <Divider className="mb-4" />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Titre du poste"
                                    value={data.titre}
                                    onChange={e => setData('titre', e.target.value)}
                                    error={errors.titre}
                                    helperText={errors.titre}
                                    required
                                    InputProps={{
                                        startAdornment: <WorkIcon className="text-gray-400 mr-2" />
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
                                    label="Poste actif"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <div className="flex justify-end space-x-4">
                                    <Button
                                        variant="outlined"
                                        onClick={() => router.get(route('admin.poste.index', [auth.user.id]))}
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
                                        Créer le poste
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