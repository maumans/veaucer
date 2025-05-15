import React from 'react';
import { 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    Box,
    Divider,
    Button,
    IconButton,
    Tooltip
} from '@mui/material';
import { 
    TrendingUp, 
    TrendingDown, 
    SwapHoriz, 
    Inventory, 
    LocalShipping, 
    Storefront,
    Visibility,
    Edit
} from '@mui/icons-material';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';
import { router } from '@inertiajs/react';
import PanelLayout from '@/Layouts/PanelLayout';
import formatNumber from '@/Pages/Utils/formatNumber';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

// Enregistrer les composants ChartJS nécessaires
ChartJS.register(ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title);

const Dashboard = ({ 
    auth, 
    mouvementsParType, 
    moisLabels, 
    montantData, 
    topProduits, 
    derniersMouvements, 
    statsGenerales,
    mouvementsParDepartement 
}) => {
    // Configuration pour le graphique en donut des types de mouvements
    const typesMouvementsData = {
        labels: mouvementsParType.map(m => m.type),
        datasets: [
            {
                data: mouvementsParType.map(m => m.total),
                backgroundColor: [
                    '#4CAF50', // Entrée (vert)
                    '#F44336', // Sortie (rouge)
                    '#2196F3', // Transfert (bleu)
                ],
                borderWidth: 1,
            },
        ],
    };

    // Configuration pour le graphique en ligne des montants par mois
    const montantsParMoisData = {
        labels: moisLabels,
        datasets: [
            {
                label: 'Valeur des mouvements',
                data: montantData,
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.4,
            },
        ],
    };

    // Configuration pour le graphique en barres des top produits
    const topProduitsData = {
        labels: topProduits.map(p => p.nom),
        datasets: [
            {
                label: 'Quantité totale',
                data: topProduits.map(p => p.quantite_totale),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: 'Nombre de mouvements',
                data: topProduits.map(p => p.nombre_mouvements),
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Options communes pour les graphiques
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    // Fonction pour obtenir l'icône selon le type de mouvement
    const getIconForMovementType = (type) => {
        switch (type) {
            case 'entrée':
                return <TrendingUp color="success" />;
            case 'sortie':
                return <TrendingDown color="error" />;
            case 'transfert':
                return <SwapHoriz color="primary" />;
            default:
                return <Inventory />;
        }
    };

    // Fonction pour naviguer vers la liste des mouvements
    const goToMovements = () => {
        router.get(route('admin.stock.mouvement.index', auth.user.id));
    };

    // Fonction pour naviguer vers les détails d'un mouvement
    const viewMovementDetails = (id) => {
        router.get(route('admin.stock.mouvement.show', [auth.user.id, id]));
    };

    dayjs.locale('fr');

    return (
        <PanelLayout
            auth={auth}
            active="stock"
            sousActive="mouvement"
            breadcrumbs={[
                {
                    text: 'Mouvements',
                    href: route('admin.stock.mouvement.index', auth.user.id),
                    active: false,
                },
                {
                    text: 'Tableau de bord',
                    href: route('admin.stock.mouvement.dashboard', auth.user.id),
                    active: true,
                },
            ]}
        >
            <div className="p-4">
                <Typography variant="h4" component="h1" gutterBottom>
                    Tableau de bord des mouvements de stock
                </Typography>

                {/* Statistiques générales */}
                <Grid container spacing={3} className="mb-6">
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Total des mouvements
                                </Typography>
                                <Typography variant="h4" component="div">
                                    {statsGenerales.total_mouvements}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Tous types confondus
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Valeur totale
                                </Typography>
                                <Typography variant="h4" component="div">
                                    {formatNumber(statsGenerales.valeur_totale)} GNF
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Tous mouvements confondus
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Mouvements ce mois
                                </Typography>
                                <Typography variant="h4" component="div">
                                    {statsGenerales.mouvements_mois_courant}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {dayjs().format('MMMM YYYY')}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Valeur ce mois
                                </Typography>
                                <Typography variant="h4" component="div">
                                    {formatNumber(statsGenerales.valeur_mois_courant)} GNF
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {dayjs().format('MMMM YYYY')}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Graphiques principaux */}
                <Grid container spacing={3} className="mb-6">
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Types de mouvements
                                </Typography>
                                <div style={{ height: '300px' }}>
                                    <Doughnut data={typesMouvementsData} options={chartOptions} />
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Valeur des mouvements (6 derniers mois)
                                </Typography>
                                <div style={{ height: '300px' }}>
                                    <Line data={montantsParMoisData} options={chartOptions} />
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Top produits et derniers mouvements */}
                <Grid container spacing={3} className="mb-6">
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Top 5 des produits les plus mouvementés
                                </Typography>
                                <div style={{ height: '400px' }}>
                                    <Bar data={topProduitsData} options={chartOptions} />
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="h6">
                                        Derniers mouvements
                                    </Typography>
                                    <Button 
                                        variant="outlined" 
                                        size="small" 
                                        onClick={goToMovements}
                                    >
                                        Voir tous
                                    </Button>
                                </Box>
                                <TableContainer component={Paper} style={{ maxHeight: '350px', overflow: 'auto' }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Type</TableCell>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Montant</TableCell>
                                                <TableCell>Détails</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {derniersMouvements.map((mouvement) => (
                                                <TableRow key={mouvement.id}>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center">
                                                            {getIconForMovementType(mouvement.type_operation?.nom)}
                                                            <Typography variant="body2" ml={1}>
                                                                {mouvement.type_operation?.nom}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{dayjs(mouvement.date).format('DD/MM/YYYY')}</TableCell>
                                                    <TableCell>{formatNumber(mouvement.montant)} GNF</TableCell>
                                                    <TableCell>
                                                        {mouvement.type_operation?.nom === 'entrée' && mouvement.fournisseur && (
                                                            <Typography variant="body2">
                                                                De: {mouvement.fournisseur.nom}
                                                            </Typography>
                                                        )}
                                                        {mouvement.type_operation?.nom === 'sortie' && mouvement.departement_source && (
                                                            <Typography variant="body2">
                                                                De: {mouvement.departement_source.nom}
                                                            </Typography>
                                                        )}
                                                        {mouvement.type_operation?.nom === 'transfert' && (
                                                            <Typography variant="body2">
                                                                {mouvement.departement_source?.nom} → {mouvement.departement_destination?.nom}
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Tooltip title="Voir détails">
                                                            <IconButton 
                                                                size="small"
                                                                onClick={() => viewMovementDetails(mouvement.id)}
                                                            >
                                                                <Visibility fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Mouvements par département */}
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Mouvements par département
                                </Typography>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Type</TableCell>
                                                <TableCell>Source</TableCell>
                                                <TableCell>Destination</TableCell>
                                                <TableCell>Nombre</TableCell>
                                                <TableCell>Montant total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {mouvementsParDepartement.map((mouvement, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center">
                                                            {getIconForMovementType(mouvement.type_operation?.nom)}
                                                            <Typography variant="body2" ml={1}>
                                                                {mouvement.type_operation?.nom}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{mouvement.source || '-'}</TableCell>
                                                    <TableCell>{mouvement.destination || '-'}</TableCell>
                                                    <TableCell>{mouvement.total}</TableCell>
                                                    <TableCell>{formatNumber(mouvement.montant_total)} GNF</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </PanelLayout>
    );
};

export default Dashboard;
