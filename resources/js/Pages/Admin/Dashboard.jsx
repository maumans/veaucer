/**
 * Dashboard principal de l'application Veaucer
 * 
 * Ce composant affiche un tableau de bord complet avec des statistiques, des graphiques
 * et des filtres pour analyser les données de stock, mouvements et inventaires.
 * 
 * @version 2.5.3
 * @date 2025-05-25
 * @author Veaucer Team
 */

import React, { useState } from 'react';
import PanelLayout from "@/Layouts/PanelLayout.jsx";
import {
    AddCard, Block, Inventory, LocalShipping, Assignment, Warning,
    TrendingUp, TrendingDown, FilterList, Refresh, CalendarToday
} from "@mui/icons-material";
import { formatNumber } from "chart.js/helpers";
import ColorIconCard from "@/Components/Card/ColorIconCard.jsx";

// Composants Material-UI
import {
    Card, CardContent, CardHeader, Grid, Typography, Box, Paper,
    FormControl, InputLabel, MenuItem, Select, Button,
    Chip, Alert, CircularProgress
} from "@mui/material";

// Composants pour les graphiques
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import { router } from "@inertiajs/react";

// Enregistrer les composants ChartJS
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    ChartTooltip,
    Legend,
    Filler
);

function Index({
    auth,
    errors,
    produitsStats,
    mouvementsStats,
    inventairesStats,
    graphiquesMouvements,
    graphiquesStock,
    departements,
    filtres
}) {
    // État pour gérer les erreurs de chargement
    const [errorMessage, setErrorMessage] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(true);
    // État pour les filtres
    const [dateDebut, setDateDebut] = useState(filtres?.date_debut ? dayjs(filtres.date_debut) : dayjs().subtract(1, 'month'));
    const [dateFin, setDateFin] = useState(filtres?.date_fin ? dayjs(filtres.date_fin) : dayjs());
    const [departementId, setDepartementId] = useState(filtres?.departement_id || '');
    const [isLoading, setIsLoading] = useState(false);

    // Appliquer les filtres
    const appliquerFiltres = () => {
        setIsLoading(true);
        setErrorMessage(null);
        router.get(route('admin.dashboard', auth.user.id), {
            date_debut: dateDebut.format('YYYY-MM-DD'),
            date_fin: dateFin.format('YYYY-MM-DD'),
            departement_id: departementId || '',
        }, {
            preserveState: true,
            onSuccess: () => {
                setIsLoading(false);
                setDataLoaded(true);
            },
            onError: (errors) => {
                setIsLoading(false);
                setDataLoaded(false);
                setErrorMessage("Erreur lors du chargement des données. Veuillez réessayer ou contacter l'administrateur.");
                console.error("Erreur de chargement du dashboard:", errors);
            },
        });
    };

    // Réinitialiser les filtres
    const reinitialiserFiltres = () => {
        setDateDebut(dayjs().subtract(1, 'month'));
        setDateFin(dayjs());
        setDepartementId('');
        setIsLoading(true);
        setErrorMessage(null);
        router.get(route('admin.dashboard', auth.user.id), {}, {
            preserveState: true,
            onSuccess: () => {
                setIsLoading(false);
                setDataLoaded(true);
            },
            onError: (errors) => {
                setIsLoading(false);
                setDataLoaded(false);
                setErrorMessage("Erreur lors du chargement des données. Veuillez réessayer ou contacter l'administrateur.");
                console.error("Erreur de chargement du dashboard:", errors);
            },
        });
    };

    // Configuration des graphiques
    const optionsLineChart = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Mouvements de stock par jour',
            },
        },
    };

    const optionsBarChart = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Top 5 fournisseurs par nombre de mouvements',
            },
        },
    };

    const optionsPieChart = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: 'Répartition du stock par catégorie',
            },
        },
    };

    const optionsDoughnutChart = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: 'Répartition du stock par département',
            },
        },
    };

    // Données pour les graphiques
    const dataMouvementsJour = {
        labels: graphiquesMouvements?.par_jour?.map(item => item.date) || [],
        datasets: [
            {
                label: 'Entrées',
                data: graphiquesMouvements?.par_jour?.map(item => item.entrees) || [],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.3,
            },
            {
                label: 'Sorties',
                data: graphiquesMouvements?.par_jour?.map(item => item.sorties) || [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.3,
            },
        ],
    };

    const dataMouvementsFournisseur = {
        labels: graphiquesMouvements?.par_fournisseur?.map(item => item.nom) || [],
        datasets: [
            {
                label: 'Nombre de mouvements',
                data: graphiquesMouvements?.par_fournisseur?.map(item => item.total) || [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const dataStockCategorie = {
        labels: graphiquesStock?.par_categorie?.map(item => item.nom) || [],
        datasets: [
            {
                label: 'Quantité en stock',
                data: graphiquesStock?.par_categorie?.map(item => item.total_stock) || [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(201, 203, 207, 0.7)',
                    'rgba(255, 99, 71, 0.7)',
                    'rgba(50, 205, 50, 0.7)',
                    'rgba(138, 43, 226, 0.7)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)',
                    'rgba(255, 99, 71, 1)',
                    'rgba(50, 205, 50, 1)',
                    'rgba(138, 43, 226, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const dataStockDepartement = {
        labels: graphiquesStock?.par_departement?.map(item => item.nom) || [],
        datasets: [
            {
                label: 'Quantité en stock',
                data: graphiquesStock?.par_departement?.map(item => item.total_stock) || [],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Cartes de statistiques
    const statsCards = [
        {
            id: 1,
            icon: <Inventory />,
            title: "Produits en stock",
            montant: produitsStats?.total || 0,
            color: 'blue'
        },
        {
            id: 2,
            icon: <Warning />,
            title: "Stock critique",
            montant: produitsStats?.stockCritique || 0,
            color: 'orange'
        },
        {
            id: 3,
            icon: <Block />,
            title: "Stock épuisé",
            montant: produitsStats?.stock_epuise || 0,
            color: 'red'
        },
        {
            id: 4,
            icon: <LocalShipping />,
            title: "Mouvements",
            montant: mouvementsStats?.total || 0,
            color: 'green'
        },
        {
            id: 5,
            icon: <TrendingUp />,
            title: "Entrées (valeur)",
            montant: mouvementsStats?.valeur_entrees || 0,
            color: 'indigo',
            devise: 'GNF'
        },
        {
            id: 6,
            icon: <TrendingDown />,
            title: "Sorties (valeur)",
            montant: mouvementsStats?.valeur_sorties || 0,
            color: 'purple',
            devise: 'GNF'
        },
        {
            id: 7,
            icon: <Assignment />,
            title: "Inventaires",
            montant: inventairesStats?.total_inventaires || 0,
            color: 'teal',
        },
        {
            id: 8,
            icon: <AddCard />,
            title: "Ajustements",
            montant: inventairesStats?.total_ajustements || 0,
            color: 'amber',
        },
    ];

    return (
        <PanelLayout
            auth={auth}
            errors={errors}
            active={'adminDashboard'}
        >
            {/* Message d'erreur */}
            {errorMessage && (
                <Alert severity="error" className="mb-4">
                    {errorMessage}
                </Alert>
            )}
            
            {/* Filtres */}
            <Paper elevation={2} className="p-4 grid gap-2 mb-6 space-y-4">
                <Typography variant="h6" className="mb-4">
                    <FilterList className="mr-2" /> Filtres
                </Typography>

                <div className=" grid md:grid-cols-3 gap-2">
                    <div className="flex gap-2">
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                            <DatePicker
                                label="Date de début"
                                value={dateDebut}
                                onChange={(newValue) => setDateDebut(newValue)}
                                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                            />
                        </LocalizationProvider>
                    </div>

                    <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                            <DatePicker
                                label="Date de fin"
                                value={dateFin}
                                onChange={(newValue) => setDateFin(newValue)}
                                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                            />
                        </LocalizationProvider>
                    </div>

                    <div>
                        <FormControl fullWidth size="small">
                            <InputLabel>Département</InputLabel>
                            <Select
                                value={departementId}
                                onChange={(e) => setDepartementId(e.target.value)}
                                label="Département"
                            >
                                <MenuItem value="">Tous les départements</MenuItem>
                                {departements?.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.id}>{dept.nom}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>



                {/* Période sélectionnée */}
                <Box className="flex items-center">
                    <CalendarToday fontSize="small" className="mr-2 text-gray-500" />
                    <Typography variant="body2" className="text-gray-600">
                        Période : <Chip size="small" label={`${dateDebut.format('DD/MM/YYYY')} - ${dateFin.format('DD/MM/YYYY')}`} />
                        {departementId && departements?.find(d => d.id === departementId) && (
                            <>
                                <span className="mx-2">|</span>
                                <span>Département : </span>
                                <Chip size="small" label={departements.find(d => d.id === departementId).nom} />
                            </>
                        )}
                    </Typography>
                </Box>

                <div className="flex justify-end">
                    <div className="flex justify-end space-x-2 w-fit">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={appliquerFiltres}
                            disabled={isLoading}
                            fullWidth
                        >
                            {isLoading ? <CircularProgress size={20} /> : <><FilterList /> Appliquer</>}
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            color="secondary"
                            onClick={reinitialiserFiltres}
                            disabled={isLoading}
                        >
                            <Refresh />
                            Réinitialiser
                        </Button>
                    </div>
                </div>
            </Paper>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {dataLoaded ? (
                    statsCards.map(({ icon, title, montant, color, id, devise }) => (
                        <ColorIconCard key={id} id={id} icon={icon} color={color} montant={montant} title={title} devise={devise} />
                    ))
                ) : (
                    <div className="col-span-4 text-center py-8">
                        <CircularProgress />
                        <Typography variant="body1" className="mt-2">Chargement des statistiques...</Typography>
                    </div>
                )}
            </div>

            {/* Graphiques */}
            {dataLoaded ? (
            <Grid container spacing={4} className="mb-6">
                {/* Mouvements par jour */}
                <Grid item xs={12} lg={6}>
                    <Card>
                        <CardHeader title="Évolution des mouvements" />
                        <CardContent>
                            <div style={{ height: '300px' }}>
                                <Line options={optionsLineChart} data={dataMouvementsJour} />
                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Mouvements par fournisseur */}
                <Grid item xs={12} lg={6}>
                    <Card>
                        <CardHeader title="Top fournisseurs" />
                        <CardContent>
                            <div style={{ height: '300px' }}>
                                <Bar options={optionsBarChart} data={dataMouvementsFournisseur} />
                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Répartition du stock par catégorie */}
                <Grid item xs={12} lg={6}>
                    <Card>
                        <CardHeader title="Stock par catégorie" />
                        <CardContent>
                            <div style={{ height: '300px' }}>
                                <Pie options={optionsPieChart} data={dataStockCategorie} />
                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Répartition du stock par département */}
                <Grid item xs={12} lg={6}>
                    <Card>
                        <CardHeader title="Stock par département" />
                        <CardContent>
                            <div style={{ height: '300px' }}>
                                <Doughnut options={optionsDoughnutChart} data={dataStockDepartement} />
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            ) : (
                <div className="text-center py-8 mb-6">
                    <CircularProgress />
                    <Typography variant="body1" className="mt-2">Chargement des graphiques...</Typography>
                </div>
            )}

            {/* Produits en stock critique */}
            {dataLoaded ? (
                <Card className="mb-6">
                <CardHeader
                    title="Produits en stock critique"
                    action={
                        <Chip
                            label={`${graphiquesStock?.produits_critiques?.length || 0} produits`}
                            color="warning"
                            size="small"
                        />
                    }
                />
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité actuelle</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seuil critique</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {graphiquesStock?.produits_critiques?.map((produit, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{produit.nom}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produit.quantite}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produit.stockCritique || 0}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Chip
                                                label={produit.quantite === 0 ? "Épuisé" : "Critique"}
                                                color={produit.quantite === 0 ? "error" : "warning"}
                                                size="small"
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {(!graphiquesStock?.produits_critiques || graphiquesStock.produits_critiques.length === 0) && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">Aucun produit en stock critique</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
            ) : (
                <div className="text-center py-8 mb-6">
                    <CircularProgress />
                    <Typography variant="body1" className="mt-2">Chargement des produits critiques...</Typography>
                </div>
            )}

            {/* Inventaires et ajustements */}
            {dataLoaded ? (
                <Grid container spacing={4}>
                {/* Inventaires par status */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader title="Inventaires physiques" />
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-100 p-4 rounded-lg">
                                    <Typography variant="subtitle2" className="text-blue-800">Planifiés</Typography>
                                    <Typography variant="h4" className="font-bold text-blue-800">
                                        {inventairesStats?.inventaires_par_statut?.planifie || 0}
                                    </Typography>
                                </div>
                                <div className="bg-amber-100 p-4 rounded-lg">
                                    <Typography variant="subtitle2" className="text-amber-800">En cours</Typography>
                                    <Typography variant="h4" className="font-bold text-amber-800">
                                        {inventairesStats?.inventaires_par_statut?.en_cours || 0}
                                    </Typography>
                                </div>
                                <div className="bg-green-100 p-4 rounded-lg">
                                    <Typography variant="subtitle2" className="text-green-800">Terminés</Typography>
                                    <Typography variant="h4" className="font-bold text-green-800">
                                        {inventairesStats?.inventaires_par_statut?.termine || 0}
                                    </Typography>
                                </div>
                                <div className="bg-red-100 p-4 rounded-lg">
                                    <Typography variant="subtitle2" className="text-red-800">Annulés</Typography>
                                    <Typography variant="h4" className="font-bold text-red-800">
                                        {inventairesStats?.inventaires_par_statut?.annule || 0}
                                    </Typography>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Ajustements par status */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader title="Ajustements d'inventaire" />
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-blue-100 p-4 rounded-lg">
                                    <Typography variant="subtitle2" className="text-blue-800">En attente</Typography>
                                    <Typography variant="h4" className="font-bold text-blue-800">
                                        {inventairesStats?.ajustements_par_statut?.en_attente || 0}
                                    </Typography>
                                </div>
                                <div className="bg-green-100 p-4 rounded-lg">
                                    <Typography variant="subtitle2" className="text-green-800">Validés</Typography>
                                    <Typography variant="h4" className="font-bold text-green-800">
                                        {inventairesStats?.ajustements_par_statut?.valide || 0}
                                    </Typography>
                                </div>
                                <div className="bg-red-100 p-4 rounded-lg">
                                    <Typography variant="subtitle2" className="text-red-800">Rejetés</Typography>
                                    <Typography variant="h4" className="font-bold text-red-800">
                                        {inventairesStats?.ajustements_par_statut?.rejete || 0}
                                    </Typography>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            ) : (
                <div className="text-center py-8">
                    <CircularProgress />
                    <Typography variant="body1" className="mt-2">Chargement des inventaires...</Typography>
                </div>
            )}
        </PanelLayout>
    );
}

export default Index;
