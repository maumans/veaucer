import React from 'react';
import { Button, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Divider } from '@mui/material';
import PanelLayout from '@/Layouts/PanelLayout.jsx';
import { ArrowBack, Edit } from '@mui/icons-material';
import { router } from '@inertiajs/react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_FR } from 'material-react-table/locales/fr';
import dayjs from 'dayjs';
import formatNumber from '@/Fonctions/FormatNumber';

const Show = ({ auth, produit, mouvements }) => {
    // Configuration des colonnes pour les mouvements de stock
    const columns = React.useMemo(() => [
        {
            accessorKey: 'date',
            header: 'Date',
            Cell: ({ row }) => dayjs(row.original.date).format('DD/MM/YYYY'),
        },
        {
            accessorKey: 'typeOperation.nom',
            header: 'Type',
            Cell: ({ row }) => {
                const type = row.original.typeOperation?.nom;
                let color = 'default';
                
                switch (type) {
                    case 'entrée':
                        color = 'success';
                        break;
                    case 'sortie':
                        color = 'error';
                        break;
                    case 'transfert':
                        color = 'info';
                        break;
                    case 'ajustement':
                        color = 'warning';
                        break;
                    default:
                        color = 'default';
                }
                
                return <Chip label={type} color={color} size="small" />;
            },
        },
        {
            accessorKey: 'quantite',
            header: 'Quantité',
            Cell: ({ row }) => {
                const quantite = row.original.quantite;
                const type = row.original.typeOperation?.nom;
                
                return (
                    <Typography 
                        color={type === 'entrée' || type === 'ajustement' && quantite > 0 ? 'success.main' : 'error.main'}
                        fontWeight="bold"
                    >
                        {type === 'entrée' || type === 'ajustement' && quantite > 0 ? '+' : ''}{formatNumber(quantite)}
                    </Typography>
                );
            },
        },
        {
            accessorKey: 'prix_unitaire',
            header: 'Prix unitaire',
            Cell: ({ row }) => formatNumber(row.original.prix_unitaire) + ' GNF',
        },
        {
            accessorKey: 'departementSource.nom',
            header: 'Département source',
            Cell: ({ row }) => row.original.departementSource?.nom || '-',
        },
        {
            accessorKey: 'departementDestination.nom',
            header: 'Département destination',
            Cell: ({ row }) => row.original.departementDestination?.nom || '-',
        },
    ], []);

    // Configuration de la table des mouvements
    const table = useMaterialReactTable({
        columns,
        data: mouvements.data || [],
        localization: MRT_Localization_FR,
        enableColumnFilters: true,
        enableGlobalFilter: true,
        enablePagination: true,
        manualPagination: true,
        rowCount: mouvements.total,
        onPaginationChange: (pagination) => {
            router.get(route('admin.stock.produit.show', [auth.user.id, produit.id]), {
                page: pagination.pageIndex + 1,
            }, {
                preserveState: true,
                preserveScroll: true,
                only: ['mouvements'],
            });
        },
        state: {
            pagination: {
                pageIndex: mouvements.current_page - 1,
                pageSize: mouvements.per_page,
            },
        },
        initialState: {
            density: 'compact',
        },
    });

    // Fonction pour retourner à la liste des produits
    const handleRetour = () => {
        router.get(route('admin.stock.produit.index', auth.user.id));
    };

    // Fonction pour éditer le produit
    const handleEdit = () => {
        router.get(route('admin.stock.produit.edit', [auth.user.id, produit.id]));
    };

    return (
        <PanelLayout
            auth={auth}
            active="stock"
            sousActive="produit"
            breadcrumbs={[
                {
                    text: 'Produits',
                    href: route('admin.stock.produit.index', auth.user.id),
                    active: false,
                },
                {
                    text: 'Détail',
                    href: route('admin.stock.produit.show', [auth.user.id, produit.id]),
                    active: true,
                },
            ]}
        >
            <div className="w-full">
                <div className="p-5 bg-white rounded shadow">
                    <div className="flex justify-between items-center mb-6">
                        <div className="bg-black w-fit p-2 rounded text-xl font-bold text-white">
                            <h2>Détail du produit</h2>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="contained" 
                                color="primary" 
                                startIcon={<Edit />}
                                onClick={handleEdit}
                            >
                                Modifier
                            </Button>
                            <Button 
                                variant="outlined" 
                                startIcon={<ArrowBack />}
                                onClick={handleRetour}
                            >
                                Retour à la liste
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Informations générales */}
                        <Paper elevation={3} className="p-4">
                            <Typography variant="h6" className="mb-3 text-orange-500 font-bold">
                                Informations générales
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell component="th" className="font-bold" width="40%">Nom</TableCell>
                                            <TableCell>{produit.nom}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" className="font-bold">Catégorie</TableCell>
                                            <TableCell>{produit.categorie?.nom || '-'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" className="font-bold">Description</TableCell>
                                            <TableCell>{produit.description || '-'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" className="font-bold">Fournisseur principal</TableCell>
                                            <TableCell>{produit.fournisseurPrincipal?.nom || '-'}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>

                        {/* Image du produit */}
                        <Paper elevation={3} className="p-4 flex flex-col justify-center items-center">
                            <Typography variant="h6" className="mb-3 text-orange-500 font-bold self-start">
                                Image du produit
                            </Typography>
                            {produit.image ? (
                                <img 
                                    src={`/storage/${produit.image}`} 
                                    alt={produit.nom} 
                                    className="max-w-full max-h-48 object-contain"
                                />
                            ) : (
                                <Box className="w-full h-48 bg-gray-200 flex justify-center items-center">
                                    <Typography variant="body2" color="textSecondary">
                                        Aucune image disponible
                                    </Typography>
                                </Box>
                            )}
                        </Paper>

                        {/* Informations d'achat */}
                        <Paper elevation={3} className="p-4">
                            <Typography variant="h6" className="mb-3 text-orange-500 font-bold">
                                Informations d'achat
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell component="th" className="font-bold" width="40%">Type d'achat</TableCell>
                                            <TableCell>{produit.typeProduitAchat?.nom || '-'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" className="font-bold">Quantité d'achat</TableCell>
                                            <TableCell>{formatNumber(produit.quantiteAchat)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" className="font-bold">Prix d'achat</TableCell>
                                            <TableCell>{formatNumber(produit.prixAchat)} GNF</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>

                        {/* Informations de vente */}
                        <Paper elevation={3} className="p-4">
                            <Typography variant="h6" className="mb-3 text-orange-500 font-bold">
                                Informations de vente
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell component="th" className="font-bold" width="40%">Type de vente</TableCell>
                                            <TableCell>{produit.typeProduitVente?.nom || '-'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" className="font-bold">Quantité de vente</TableCell>
                                            <TableCell>{formatNumber(produit.quantiteVente)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" className="font-bold">Prix de vente</TableCell>
                                            <TableCell>{formatNumber(produit.prixVente)} GNF</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>

                        {/* Informations de stock */}
                        <Paper elevation={3} className="p-4 md:col-span-2">
                            <Typography variant="h6" className="mb-3 text-orange-500 font-bold">
                                Informations de stock
                            </Typography>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-100 p-4 rounded-lg text-center">
                                    <Typography variant="subtitle2" className="text-blue-800">
                                        Stock global
                                    </Typography>
                                    <Typography variant="h4" className="font-bold text-blue-800">
                                        {formatNumber(produit.stockGlobal)}
                                    </Typography>
                                </div>
                                <div className="bg-yellow-100 p-4 rounded-lg text-center">
                                    <Typography variant="subtitle2" className="text-yellow-800">
                                        Stock critique
                                    </Typography>
                                    <Typography variant="h4" className="font-bold text-yellow-800">
                                        {formatNumber(produit.stockCritique)}
                                    </Typography>
                                </div>
                                <div className={`p-4 rounded-lg text-center ${produit.stockGlobal <= produit.stockCritique ? 'bg-red-100' : 'bg-green-100'}`}>
                                    <Typography variant="subtitle2" className={produit.stockGlobal <= produit.stockCritique ? 'text-red-800' : 'text-green-800'}>
                                        Statut du stock
                                    </Typography>
                                    <Typography variant="h4" className={`font-bold ${produit.stockGlobal <= produit.stockCritique ? 'text-red-800' : 'text-green-800'}`}>
                                        {produit.stockGlobal <= produit.stockCritique ? 'Critique' : 'Normal'}
                                    </Typography>
                                </div>
                            </div>

                            {/* Détail des stocks par département si disponible */}
                            {produit.stocks && produit.stocks.length > 0 && (
                                <div className="mt-4">
                                    <Typography variant="subtitle1" className="font-bold mb-2">
                                        Détail par département
                                    </Typography>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className="font-bold">Département</TableCell>
                                                    <TableCell className="font-bold">Quantité</TableCell>
                                                    <TableCell className="font-bold">Statut</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {produit.stocks.map((stock) => (
                                                    <TableRow key={stock.id}>
                                                        <TableCell>{stock.departement?.nom || 'Stock global'}</TableCell>
                                                        <TableCell>{formatNumber(stock.quantite)}</TableCell>
                                                        <TableCell>
                                                            <Chip 
                                                                label={stock.quantite <= produit.stockCritique ? 'Critique' : 'Normal'} 
                                                                color={stock.quantite <= produit.stockCritique ? 'error' : 'success'} 
                                                                size="small" 
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            )}
                        </Paper>
                    </div>

                    {/* Historique des mouvements */}
                    <div className="mt-6">
                        <Divider className="mb-4" />
                        <Typography variant="h6" className="mb-3 text-orange-500 font-bold">
                            Historique des mouvements
                        </Typography>
                        <MaterialReactTable table={table} />
                    </div>
                </div>
            </div>
        </PanelLayout>
    );
};

export default Show;
