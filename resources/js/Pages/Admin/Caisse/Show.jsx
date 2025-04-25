import React from 'react';
import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/PanelLayout';
import { Button, Paper, Grid, Typography, Divider, Chip } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { router } from '@inertiajs/react';

export default function Show({ auth, caisse }) {
    return (
        <PanelLayout
            auth={auth}
            active={'parametrage'}
            sousActive={'caisse'}
            breadcrumbs={[
                {
                    text: "Caisse",
                    href: route("admin.caisse.index", [auth.user.id]),
                    active: false
                },
                {
                    text: "Détails",
                    href: route("admin.caisse.show", [auth.user.id, caisse.id]),
                    active: true
                }
            ]}
        >
            <Head title="Détails de la caisse" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Détails de la caisse</h1>
                        <p className="text-gray-500 mt-1">Informations détaillées sur la caisse</p>
                    </div>
                    <div className="flex space-x-4">
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => router.get(route('admin.caisse.edit', [auth.user.id, caisse.id]))}
                            className="text-orange-500 border-orange-500 hover:bg-orange-50"
                        >
                            Modifier
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            onClick={() => {
                                if (confirm('Êtes-vous sûr de vouloir supprimer cette caisse ?')) {
                                    router.delete(route('admin.caisse.destroy', [auth.user.id, caisse.id]));
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
                                <AccountBalanceIcon className="text-orange-500" />
                                Informations de la caisse
                            </Typography>
                            <Divider className="mb-4" />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" className="text-gray-500">
                                Nom de la caisse
                            </Typography>
                            <Typography variant="body1" className="mt-1">
                                {caisse.nom}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" className="text-gray-500">
                                Statut
                            </Typography>
                            <Chip
                                label={caisse.status ? "Active" : "Inactive"}
                                color={caisse.status ? "success" : "error"}
                                className="mt-1"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" className="text-gray-500">
                                Description
                            </Typography>
                            <Typography variant="body1" className="mt-1">
                                {caisse.description || "Aucune description"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" className="flex items-center gap-2 mb-2 mt-4">
                                <AttachMoneyIcon className="text-orange-500" />
                                Détails financiers
                            </Typography>
                            <Divider className="mb-4" />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" className="text-gray-500">
                                Solde actuel
                            </Typography>
                            <Typography variant="body1" className="mt-1">
                                {caisse.solde} €
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" className="text-gray-500">
                                Responsable
                            </Typography>
                            <Typography variant="body1" className="mt-1">
                                {caisse.responsable ? `${caisse.responsable.nom} ${caisse.responsable.prenom}` : "Non assigné"}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        </PanelLayout>
    );
} 