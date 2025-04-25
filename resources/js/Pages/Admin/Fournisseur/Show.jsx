import React from 'react';
import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/PanelLayout';
import { Button, Paper, Grid, Typography, Divider, Chip } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { router } from '@inertiajs/react';

export default function Show({ fournisseur, auth }) {
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
                    text: "Détails",
                    href: route("admin.fournisseur.show", [auth.user.id, fournisseur.id]),
                    active: true
                }
            ]}
        >
            <Head title="Détails du fournisseur" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Détails du fournisseur</h1>
                        <p className="text-gray-500 mt-1">Informations détaillées sur le fournisseur</p>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => router.get(route('admin.fournisseur.index', [auth.user.id]))}
                            className="text-gray-500 border-gray-500 hover:bg-gray-50"
                        >
                            Retour
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={() => router.get(route('admin.fournisseur.edit', [auth.user.id, fournisseur.id]))}
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
                                <BusinessIcon className="text-orange-500" />
                                Informations de l'entreprise
                            </Typography>
                            <Divider className="mb-4" />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <div className="flex items-center gap-2 mb-2">
                                <BusinessIcon className="text-gray-400" />
                                <Typography variant="subtitle1" className="font-semibold">Nom de l'entreprise</Typography>
                            </div>
                            <Typography variant="body1" className="ml-8">{fournisseur.nom}</Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <div className="flex items-center gap-2 mb-2">
                                <PhoneIcon className="text-gray-400" />
                                <Typography variant="subtitle1" className="font-semibold">Téléphone</Typography>
                            </div>
                            <Typography variant="body1" className="ml-8">{fournisseur.telephone}</Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <div className="flex items-center gap-2 mb-2">
                                <EmailIcon className="text-gray-400" />
                                <Typography variant="subtitle1" className="font-semibold">Email</Typography>
                            </div>
                            <Typography variant="body1" className="ml-8">{fournisseur.email}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <div className="flex items-center gap-2 mb-2">
                                <LocationOnIcon className="text-gray-400" />
                                <Typography variant="subtitle1" className="font-semibold">Adresse</Typography>
                            </div>
                            <Typography variant="body1" className="ml-8">{fournisseur.adresse}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" className="flex items-center gap-2 mb-2 mt-4">
                                <PersonIcon className="text-orange-500" />
                                Informations du contact
                            </Typography>
                            <Divider className="mb-4" />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <div className="flex items-center gap-2 mb-2">
                                <PersonIcon className="text-gray-400" />
                                <Typography variant="subtitle1" className="font-semibold">Nom du contact</Typography>
                            </div>
                            <Typography variant="body1" className="ml-8">{fournisseur.nomContact}</Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <div className="flex items-center gap-2 mb-2">
                                <PersonIcon className="text-gray-400" />
                                <Typography variant="subtitle1" className="font-semibold">Prénom du contact</Typography>
                            </div>
                            <Typography variant="body1" className="ml-8">{fournisseur.prenomContact}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" className="flex items-center gap-2 mb-2 mt-4">
                                <DescriptionIcon className="text-orange-500" />
                                Paramètres
                            </Typography>
                            <Divider className="mb-4" />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <div className="flex items-center gap-2 mb-2">
                                <Typography variant="subtitle1" className="font-semibold">Statut</Typography>
                            </div>
                            <Chip
                                icon={fournisseur.status ? <CheckCircleIcon /> : <CancelIcon />}
                                label={fournisseur.status ? "Actif" : "Inactif"}
                                color={fournisseur.status ? "success" : "error"}
                                className="ml-8"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <div className="flex items-center gap-2 mb-2">
                                <Typography variant="subtitle1" className="font-semibold">Type</Typography>
                            </div>
                            <Chip
                                label={fournisseur.principal ? "Fournisseur principal" : "Fournisseur secondaire"}
                                color={fournisseur.principal ? "primary" : "default"}
                                className="ml-8"
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        </PanelLayout>
    );
} 