import React from 'react';
import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/PanelLayout';
import { Button, Paper, Grid, Typography, Divider, Chip } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { router } from '@inertiajs/react';

export default function Show({ auth, stock }) {
    return (
        <PanelLayout
            auth={auth}
            active={'parametrage'}
            sousActive={'stock'}
            breadcrumbs={[
                {
                    text: "Stock",
                    href: route("admin.stock.index", [auth.user.id]),
                    active: false
                },
                {
                    text: "Détails",
                    href: route("admin.stock.show", [auth.user.id, stock.id]),
                    active: true
                }
            ]}
        >
            <Head title="Détails du mouvement de stock" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Détails du mouvement de stock</h1>
                        <p className="text-gray-500 mt-1">Informations détaillées sur le mouvement de stock</p>
                    </div>
                    <div className="flex space-x-4">
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => router.get(route('admin.stock.edit', [auth.user.id, stock.id]))}
                            className="text-orange-500 border-orange-500 hover:bg-orange-50"
                        >
                            Modifier
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            onClick={() => {
                                if (confirm('Êtes-vous sûr de vouloir supprimer ce mouvement de stock ?')) {
                                    router.delete(route('admin.stock.destroy', [auth.user.id, stock.id]));
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
                                <InventoryIcon className="text-orange-500" />
                                Informations du mouvement
                            </Typography>
                            <Divider className="mb-4" />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" className="text-gray-500">
                                Produit
                            </Typography>
                            <Typography variant="body1" className="mt-1">
                                {stock.produit.nom}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" className="text-gray-500">
                                Type de mouvement
                            </Typography>
                            <Chip
                                label={stock.type === 'ENTREE' ? "Entrée" : "Sortie"}
                                color={stock.type === 'ENTREE' ? "success" : "error"}
                                icon={stock.type === 'ENTREE' ? <AddCircleIcon /> : <RemoveCircleIcon />}
                                className="mt-1"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" className="text-gray-500">
                                Quantité
                            </Typography>
                            <Typography variant="body1" className="mt-1">
                                {stock.quantite}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" className="text-gray-500">
                                Date
                            </Typography>
                            <Typography variant="body1" className="mt-1">
                                {new Date(stock.date).toLocaleDateString()}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" className="text-gray-500">
                                Description
                            </Typography>
                            <Typography variant="body1" className="mt-1">
                                {stock.description || 'Aucune description'}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" className="flex items-center gap-2 mb-2 mt-4">
                                <DescriptionIcon className="text-orange-500" />
                                État du mouvement
                            </Typography>
                            <Divider className="mb-4" />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" className="text-gray-500">
                                Statut
                            </Typography>
                            <Chip
                                label={stock.status ? "Actif" : "Inactif"}
                                color={stock.status ? "success" : "error"}
                                className="mt-1"
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        </PanelLayout>
    );
} 