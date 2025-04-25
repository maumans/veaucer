import React from 'react';
import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/PanelLayout';
import { Button, Paper, Grid, Typography, Divider, Chip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { router } from '@inertiajs/react';

export default function Show({ auth, client }) {
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
                    text: "Détails",
                    href: route("admin.client.show", [auth.user.id, client.id]),
                    active: true
                }
            ]}
        >
            <Head title="Détails du client" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Détails du client</h1>
                        <p className="text-gray-500 mt-1">Informations détaillées sur le client</p>
                    </div>
                    <div className="flex space-x-4">
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => router.get(route('admin.client.edit', [auth.user.id, client.id]))}
                            className="text-orange-500 border-orange-500 hover:bg-orange-50"
                        >
                            Modifier
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            onClick={() => {
                                if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
                                    router.delete(route('admin.client.destroy', [auth.user.id, client.id]));
                                }
                            }}
                            className="text-red-500 border-red-500 hover:bg-red-50"
                        >
                            Supprimer
                        </Button>
                    </div>
                </div>

                <Paper elevation={0} className="p-6">
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" className="flex items-center gap-2 mb-2">
                                <PersonIcon className="text-orange-500" />
                                Informations personnelles
                            </Typography>
                            <Divider className="mb-4" />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" className="text-gray-500">
                                Nom
                            </Typography>
                            <Typography variant="body1" className="mt-1">
                                {client.nom}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" className="text-gray-500">
                                Prénom
                            </Typography>
                            <Typography variant="body1" className="mt-1">
                                {client.prenom}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" className="flex items-center gap-2 mb-2 mt-4">
                                <EmailIcon className="text-orange-500" />
                                Informations de contact
                            </Typography>
                            <Divider className="mb-4" />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" className="text-gray-500">
                                Email
                            </Typography>
                            <Typography variant="body1" className="mt-1">
                                {client.email}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" className="text-gray-500">
                                Téléphone
                            </Typography>
                            <Typography variant="body1" className="mt-1">
                                {client.telephone || 'Non renseigné'}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" className="text-gray-500">
                                Adresse
                            </Typography>
                            <Typography variant="body1" className="mt-1">
                                {client.adresse || 'Non renseignée'}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" className="flex items-center gap-2 mb-2 mt-4">
                                <PersonIcon className="text-orange-500" />
                                État du compte
                            </Typography>
                            <Divider className="mb-4" />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" className="text-gray-500">
                                Statut
                            </Typography>
                            <Chip
                                label={client.status ? "Actif" : "Inactif"}
                                color={client.status ? "success" : "error"}
                                className="mt-1"
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        </PanelLayout>
    );
} 