import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import PanelLayout from '@/Layouts/PanelLayout';
import { Button, TextField, Paper, FormControlLabel, Switch, Grid, Typography, Divider } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import PhoneIcon from '@mui/icons-material/Phone';
import { router } from '@inertiajs/react';

export default function Edit({ auth, departement }) {
    const { data, setData, put, processing, errors } = useForm({
        nom: departement.nom,
        description: departement.description || '',
        telephone: departement.telephone || '',
        status: departement.status
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.departement.update', [auth.user.id, departement.id]));
    };

    return (
        <PanelLayout
            auth={auth}
            active={'parametrage'}
            sousActive={'departement'}
            breadcrumbs={[
                {
                    text: "Département",
                    href: route("admin.departement.index", [auth.user.id]),
                    active: false
                },
                {
                    text: "Modification",
                    href: route("admin.departement.edit", [auth.user.id, departement.id]),
                    active: true
                }
            ]}
        >
            <Head title="Modifier un département" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Modifier le département</h1>
                    <p className="text-gray-500 mt-1">Modifiez les informations du département ci-dessous</p>
                </div>

                <Paper elevation={0} className="p-6">
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h6" className="flex items-center gap-2 mb-2">
                                    <BusinessIcon className="text-orange-500" />
                                    Informations de base
                                </Typography>
                                <Divider className="mb-4" />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Nom du département"
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
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={data.status}
                                            onChange={e => setData('status', e.target.checked)}
                                        />
                                    }
                                    label="Département actif"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <div className="flex justify-end space-x-4">
                                    <Button
                                        variant="outlined"
                                        onClick={() => router.get(route('admin.departement.index', [auth.user.id]))}
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
                                        Mettre à jour
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