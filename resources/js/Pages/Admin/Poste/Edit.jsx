import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import PanelLayout from '@/Layouts/PanelLayout';
import { Button, TextField, Paper, FormControlLabel, Switch, Grid, Typography, Divider } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import DescriptionIcon from '@mui/icons-material/Description';
import { router } from '@inertiajs/react';

export default function Edit({ poste, auth }) {
    const { data, setData, put, processing, errors } = useForm({
        libelle: poste.libelle || '',
        description: poste.description || '',
        status: poste.status || true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.poste.update', [auth.user.id, poste.id]));
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
                    text: "Modification",
                    href: route("admin.poste.edit", [auth.user.id, poste.id]),
                    active: true
                }
            ]}
        >
            <Head title="Modifier un poste" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Modifier le poste</h1>
                    <p className="text-gray-500 mt-1">Modifiez les informations du poste ci-dessous</p>
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
                                    value={data.libelle}
                                    onChange={e => setData('libelle', e.target.value)}
                                    error={errors.libelle}
                                    helperText={errors.libelle}
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