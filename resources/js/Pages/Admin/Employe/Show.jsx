import React from 'react';
import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/PanelLayout';
import { Button, Paper, Grid, Typography, Divider, Chip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { router } from '@inertiajs/react';

export default function Show({ employe, auth }) {
    return (
        <PanelLayout
            auth={auth}
            active={'employe'}
            sousActive={'listeEmployes'}
            breadcrumbs={[
                {
                    text: "Employé",
                    href: route("admin.employe.index", [auth.user.id]),
                    active: false
                },
                {
                    text: "Détails",
                    href: route("admin.employe.show", [auth.user.id, employe.id]),
                    active: true
                }
            ]}
        >
            <Head title="Détails de l'employé" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Détails de l'employé</h1>
                        <p className="text-gray-500 mt-1">Informations détaillées sur l'employé</p>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => router.get(route('admin.employe.index', [auth.user.id]))}
                            className="text-gray-500 border-gray-500 hover:bg-gray-50"
                        >
                            Retour
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={() => router.get(route('admin.employe.edit', [auth.user.id, employe.id]))}
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
                                <PersonIcon className="text-orange-500" />
                                Informations personnelles
                            </Typography>
                            <Divider className="mb-4" />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <div className="flex items-center gap-2 mb-2">
                                <PersonIcon className="text-gray-400" />
                                <Typography variant="subtitle1" className="font-semibold">Nom</Typography>
                            </div>
                            <Typography variant="body1" className="ml-8">{employe.nom}</Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <div className="flex items-center gap-2 mb-2">
                                <PersonIcon className="text-gray-400" />
                                <Typography variant="subtitle1" className="font-semibold">Prénom</Typography>
                            </div>
                            <Typography variant="body1" className="ml-8">{employe.prenom}</Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <div className="flex items-center gap-2 mb-2">
                                <EmailIcon className="text-gray-400" />
                                <Typography variant="subtitle1" className="font-semibold">Email</Typography>
                            </div>
                            <Typography variant="body1" className="ml-8">{employe.email}</Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <div className="flex items-center gap-2 mb-2">
                                <PhoneIcon className="text-gray-400" />
                                <Typography variant="subtitle1" className="font-semibold">Téléphone</Typography>
                            </div>
                            <Typography variant="body1" className="ml-8">{employe.telephone}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <div className="flex items-center gap-2 mb-2">
                                <LocationOnIcon className="text-gray-400" />
                                <Typography variant="subtitle1" className="font-semibold">Adresse</Typography>
                            </div>
                            <Typography variant="body1" className="ml-8">{employe.adresse}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" className="flex items-center gap-2 mb-2 mt-4">
                                <WorkIcon className="text-orange-500" />
                                Informations professionnelles
                            </Typography>
                            <Divider className="mb-4" />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <div className="flex items-center gap-2 mb-2">
                                <WorkIcon className="text-gray-400" />
                                <Typography variant="subtitle1" className="font-semibold">Poste</Typography>
                            </div>
                            <Typography variant="body1" className="ml-8">{employe.poste?.libelle || 'Non assigné'}</Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <div className="flex items-center gap-2 mb-2">
                                <BusinessIcon className="text-gray-400" />
                                <Typography variant="subtitle1" className="font-semibold">Département</Typography>
                            </div>
                            <Typography variant="body1" className="ml-8">{employe.departement?.nom || 'Non assigné'}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" className="flex items-center gap-2 mb-2 mt-4">
                                <WorkIcon className="text-orange-500" />
                                Paramètres
                            </Typography>
                            <Divider className="mb-4" />
                        </Grid>

                        <Grid item xs={12}>
                            <div className="flex items-center gap-2 mb-2">
                                <Typography variant="subtitle1" className="font-semibold">Statut</Typography>
                            </div>
                            <Chip
                                icon={employe.status ? <CheckCircleIcon /> : <CancelIcon />}
                                label={employe.status ? "Actif" : "Inactif"}
                                color={employe.status ? "success" : "error"}
                                className="ml-8"
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        </PanelLayout>
    );
} 