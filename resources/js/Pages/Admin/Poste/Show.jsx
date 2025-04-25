import React from 'react';
import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/PanelLayout';
import { Button, Paper, Grid, Typography, Divider, Chip } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { router } from '@inertiajs/react';

export default function Show({ poste, auth }) {
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
                    text: "Détails",
                    href: route("admin.poste.show", [auth.user.id, poste.id]),
                    active: true
                }
            ]}
        >
            <Head title="Détails du poste" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Détails du poste</h1>
                        <p className="text-gray-500 mt-1">Informations détaillées sur le poste</p>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => router.get(route('admin.poste.index', [auth.user.id]))}
                            className="text-gray-500 border-gray-500 hover:bg-gray-50"
                        >
                            Retour
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={() => router.get(route('admin.poste.edit', [auth.user.id, poste.id]))}
                            className="bg-orange-500 hover:bg-orange-600"
                        >
                            Modifier
                        </Button>
                    </div>
                </div>

                <Paper elevation={0} className="p-6">
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <Typography variant="h6" className="flex items-center gap-2 mb-2">
                                <WorkIcon className="text-orange-500" />
                                Informations du poste
                            </Typography>
                            <Divider className="mb-4" />
                        </Grid>

                        <Grid item xs={12}>
                            <div className="flex items-center gap-2 mb-2">
                                <WorkIcon className="text-gray-400" />
                                <Typography variant="subtitle1" className="font-semibold">Titre du poste</Typography>
                            </div>
                            <Typography variant="body1" className="ml-8">{poste.titre}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <div className="flex items-center gap-2 mb-2">
                                <DescriptionIcon className="text-gray-400" />
                                <Typography variant="subtitle1" className="font-semibold">Description</Typography>
                            </div>
                            <Typography variant="body1" className="ml-8 whitespace-pre-line">{poste.description}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" className="flex items-center gap-2 mb-2 mt-4">
                                <PeopleIcon className="text-orange-500" />
                                Informations supplémentaires
                            </Typography>
                            <Divider className="mb-4" />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <div className="flex items-center gap-2 mb-2">
                                <PeopleIcon className="text-gray-400" />
                                <Typography variant="subtitle1" className="font-semibold">Nombre d'employés</Typography>
                            </div>
                            <Typography variant="body1" className="ml-8">{poste.nombreEmployes || 0}</Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <div className="flex items-center gap-2 mb-2">
                                <Typography variant="subtitle1" className="font-semibold">Statut</Typography>
                            </div>
                            <Chip
                                icon={poste.status ? <CheckCircleIcon /> : <CancelIcon />}
                                label={poste.status ? "Actif" : "Inactif"}
                                color={poste.status ? "success" : "error"}
                                className="ml-8"
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        </PanelLayout>
    );
} 