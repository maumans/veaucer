import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import PanelLayout from '@/Layouts/PanelLayout';
import { Button, TextField, Paper, FormControlLabel, Switch, Grid, Typography, Divider, MenuItem } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import { router } from '@inertiajs/react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function Edit({ auth, stock, produits }) {
    const { data, setData, put, processing, errors } = useForm({
        produit_id: stock.produit_id,
        quantite: stock.quantite,
        type: stock.type,
        date: dayjs(stock.date),
        description: stock.description || '',
        status: stock.status
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.stock.update', [auth.user.id, stock.id]));
    };

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
                    text: "Modification",
                    href: route("admin.stock.edit", [auth.user.id, stock.id]),
                    active: true
                }
            ]}
        >
            <Head title="Modifier le mouvement de stock" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Modifier le mouvement de stock</h1>
                    <p className="text-gray-500 mt-1">Modifiez les informations du mouvement de stock</p>
                </div>

                <Paper elevation={0} className="p-6">
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h6" className="flex items-center gap-2 mb-2">
                                    <InventoryIcon className="text-orange-500" />
                                    Informations du mouvement
                                </Typography>
                                <Divider className="mb-4" />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Produit"
                                    value={data.produit_id}
                                    onChange={e => setData('produit_id', e.target.value)}
                                    error={errors.produit_id}
                                    helperText={errors.produit_id}
                                    required
                                    InputProps={{
                                        startAdornment: <InventoryIcon className="text-gray-400 mr-2" />
                                    }}
                                >
                                    {produits.map((produit) => (
                                        <MenuItem key={produit.id} value={produit.id}>
                                            {produit.nom}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Type de mouvement"
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                    error={errors.type}
                                    helperText={errors.type}
                                    required
                                    InputProps={{
                                        startAdornment: data.type === 'ENTREE' ? 
                                            <AddCircleIcon className="text-green-500 mr-2" /> : 
                                            <RemoveCircleIcon className="text-red-500 mr-2" />
                                    }}
                                >
                                    <MenuItem value="ENTREE">Entrée</MenuItem>
                                    <MenuItem value="SORTIE">Sortie</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Quantité"
                                    type="number"
                                    value={data.quantite}
                                    onChange={e => setData('quantite', e.target.value)}
                                    error={errors.quantite}
                                    helperText={errors.quantite}
                                    required
                                    InputProps={{
                                        startAdornment: <InventoryIcon className="text-gray-400 mr-2" />
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Date"
                                        value={data.date}
                                        onChange={(newValue) => setData('date', newValue)}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!errors.date,
                                                helperText: errors.date,
                                                InputProps: {
                                                    startAdornment: <CalendarTodayIcon className="text-gray-400 mr-2" />
                                                }
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
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
                                    rows={3}
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
                                    label="Mouvement actif"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <div className="flex justify-end space-x-4">
                                    <Button
                                        variant="outlined"
                                        onClick={() => router.get(route('admin.stock.index', [auth.user.id]))}
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