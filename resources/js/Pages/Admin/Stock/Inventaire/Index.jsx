import React, { useEffect, useState, useMemo } from 'react';
import PanelLayout from "@/Layouts/PanelLayout.jsx";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_FR } from 'material-react-table/locales/fr';
import { router, useForm } from "@inertiajs/react";
import axios from 'axios';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {
    Add,
    AddCircle,
    Assessment,
    Check,
    Close,
    CompareArrows,
    Delete,
    Edit,
    FactCheck,
    History,
    Inventory,
    LocalShipping,
    Notifications,
    Refresh,
    Search,
    ShoppingCart,
    Visibility,
    Warning
} from "@mui/icons-material";
import InputError from "@/Components/InputError.jsx";
import dayjs from 'dayjs';
import { formatNumber } from 'chart.js/helpers';

function Index({ auth, errors, produits, typeProduits, categories, error, success, departements }) {
    //PAGINATION

    const [produitsSt, setProduitsSt] = useState([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [rowCount, setRowCount] = useState(0);


    //table state
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: produits.current_page - 1,
        pageSize: produits.per_page,
    });
    
    // État pour les filtres avancés - déplacé ici pour éviter l'erreur d'initialisation
    const [filtresAvances, setFiltresAvances] = useState({
        categorie: '',
        typeProduit: '',
        departement: '',
        status: '',
        searchTerm: ''
    });

    useEffect(() => {
        setRowCount(produits.total)
        setProduitsSt(produits.data)
        setIsRefetching(false)
    }, [produits])

    //if you want to avoid useEffect, look at the React Query example instead
    useEffect(() => {
        setIsRefetching(true);
        setIsLoading(true);

        // Préparation des données à envoyer au backend
        const requestData = {
            'start': pagination.pageIndex * pagination.pageSize,
            "size": pagination.pageSize,
            'filters': columnFilters ?? [],
            'globalFilter': globalFilter ?? '',
            'sorting': sorting ?? []
        };
        
        // Ajout du filtre de département si nécessaire
        if (filtresAvances.departement) {
            requestData.departement_id = filtresAvances.departement;
        }

        try {
            // Récupérer l'ID de l'utilisateur à partir de l'objet auth
            const userId = auth.user.id;
            
            // Utiliser la route avec le paramètre userId
            axios.post(route('admin.stock.inventaire.paginationFiltre', { userId: userId }), requestData)
                .then(response => {
                    if (response.data && Array.isArray(response.data.data)) {
                        setProduitsSt(response.data.data);
                        setRowCount(response.data.rowCount || response.data.data.length);
                        
                        // Mettre à jour le filtre de département actif dans l'interface
                        if (response.data.departement_id) {
                            // Trouver le nom du département sélectionné
                            const deptName = departements.find(d => d.id == response.data.departement_id)?.nom || 'Sélectionné';
                            console.log(`Affichage des stocks pour le département: ${deptName}`);
                        }
                        
                        setIsError(false);
                    } else {
                        setProduitsSt([]);
                        setRowCount(0);
                        console.warn('Réponse inattendue du serveur:', response);
                        setIsError(false); // Ne pas afficher d'erreur pour un résultat vide
                    }

                    setIsLoading(false);
                    setIsRefetching(false);
                })
                .catch(err => {
                    console.error('Erreur lors de la récupération des données:', err);
                    setProduitsSt([]);
                    setRowCount(0);
                    setIsLoading(false);
                    setIsRefetching(false);
                    setIsError(true);
                });
        } catch (error) {
            console.error('Erreur lors de l\'exécution de la requête:', error);
            setProduitsSt([]);
            setRowCount(0);
            setIsLoading(false);
            setIsRefetching(false);
            setIsError(true);
        }

    }, [
        columnFilters,
        globalFilter,
        pagination.pageIndex,
        pagination.pageSize,
        sorting,
        filtresAvances.departement // Ajout du département comme dépendance
    ]);

    //PAGINATION

    const { data, setData, post, put, reset } = useForm(
        {
            'id': '',
            'nom': '',
            'typeProduit': null,
            'categorie': null,
        }
    );

    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openShow, setOpenShow] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const handleClickOpen = () => {
        router.get(route("admin.inventaire.create", auth.user.id), { onSuccess: () => reset() });
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    const handleCloseShow = () => {
        setOpenShow(false);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const handleChange = (e) => {
        e.target.type === 'checkbox'
            ? setData(e.target.name, e.target.checked)
            : setData(e.target.name, e.target.value);
    };

    const handleSubmit = () => {
        post(route('admin.stock.inventaire.store', auth.user.id), {
            onSuccess: () => {
                reset();
                handleClose();
            }
        });
    };

    const handleEdit = (el) => {
        setData({
            id: el.id,
            nom: el.nom,
            typeProduit: el.typeProduit,
            categorie: el.categorie,
        });
        setOpenEdit(true);
    };

    const handleShow = (el) => {
        setData({
            id: el.id,
            nom: el.nom,
            typeProduit: el.typeProduit,
            categorie: el.categorie,
        });
        setOpenShow(true);
    };

    const handleDelete = (id, message) => {
        setData({
            id: id,
            message: message
        });
        setOpenDelete(true);
    };

    const handleUpdate = () => {
        put(route('admin.stock.inventaire.update', [auth.user.id, data.id]), {
            onSuccess: () => {
                reset();
                handleCloseEdit();
            }
        });
    };

    const handleSuspend = () => {
        router.delete(route('admin.stock.inventaire.destroy', [auth.user.id, data.id]));
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'nom',
                header: 'Nom',
            },
            {
                accessorKey: 'categorie.nom',
                header: 'Catégorie',
                size: 150,
            },
            {
                accessorKey: 'stockGlobal',
                header: 'Stock',
                size: 100,
                Cell: ({ row }) => {
                    const stock = row.original.stockGlobal || 0;
                    const seuilMin = row.original.stockCritique || 0;
                    const seuilMax = row.original.seuilMaximal || 0;
                    
                    let color = 'success.main';
                    if (stock === 0) {
                        color = 'error.main';
                    } else if (stock < seuilMin) {
                        color = 'warning.main';
                    }
                    
                    return (
                        <Typography sx={{ color }}>
                            {formatNumber(stock)}
                        </Typography>
                    );
                },
            },
            {
                accessorKey: 'stockCritique',
                header: 'Seuil Min',
                size: 100,
                Cell: ({ row }) => (
                    <Typography>{formatNumber(row.original.stockCritique || 0)}</Typography>
                ),
            },
            {
                accessorKey: 'prixAchat',
                header: 'Prix Achat',
                size: 120,
                Cell: ({ row }) => (
                    <Typography>{row.original.prixAchat ? formatNumber(row.original.prixAchat) + ' GNF' : '0 GNF'}</Typography>
                ),
            },
            {
                accessorKey: 'valeurStock',
                header: 'Valeur Stock',
                size: 120,
                Cell: ({ row }) => {
                    const valeur = (row.original.stockGlobal || 0) * (row.original.prixAchat || 0);
                    return <Typography>{formatNumber(valeur)} GNF</Typography>;
                },
            },
            {
                accessorKey: 'status',
                header: 'Statut',
                size: 120,
                Cell: ({ row }) => {
                    return (
                        <Chip
                            label={row.original.status === 1 ? 'Actif' : 'Inactif'}
                            color={row.original.status === 1 ? 'success' : 'error'}
                            size="small"
                        />
                    );
                },
            },
            {
                accessorKey: 'actions',
                header: 'Actions',
                size: 200,
                Cell: ({ row }) => (
                    <Box sx={{ display: 'flex', gap: '8px' }}>
                        <Tooltip title="Voir détails">
                            <IconButton
                                color="primary"
                                onClick={() => handleShow(row.original)}
                            >
                                <Visibility fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Historique des mouvements">
                            <IconButton
                                color="info"
                            >
                                <History fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Ajuster le stock">
                            <IconButton
                                color="secondary"
                                onClick={() => {
                                    // Rediriger vers la création d'un ajustement avec ce produit pré-sélectionné
                                    router.get(route('admin.inventaire.ajustement.create', auth.user.id), {
                                        produit_id: row.original.id
                                    });
                                }}
                            >
                                <CompareArrows fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Commander">
                            <IconButton
                                color="warning"
                                onClick={handleClickOpen}
                            >
                                <ShoppingCart fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                ),
            },
        ],
        []
    );

    const table = useMaterialReactTable({
        columns,
        data: produitsSt,
        getRowId: (row) => row.id,
        initialState: { showColumnFilters: false },
        manualFiltering: true,
        manualSorting: true,
        muiToolbarAlertBannerProps: isError
            ? {
                color: 'error',
                children: 'Erreur lors du chargement des données. Veuillez réessayer ou contacter l\'administrateur.',
            }
            : undefined,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        rowCount,
        state: {
            columnFilters,
            globalFilter,
            isLoading,
            pagination,
            showAlertBanner: isError,
            showProgressBars: isRefetching,
            sorting,
        },
        localization: MRT_Localization_FR
    });

    // Calcul des statistiques pour le tableau de bord
    const statsData = useMemo(() => {
        const totalProduits = produitsSt.length;
        const sousstockCritique = produitsSt.filter(p => p.stockGlobal < p.stockCritique).length;
        const enRupture = produitsSt.filter(p => p.stockGlobal === 0).length;
        const valeurTotale = produitsSt.reduce((total, p) => total + ((p.stockGlobal || 0) * (p.prixAchat || 0)), 0);
        
        return {
            totalProduits,
            sousstockCritique,
            enRupture,
            valeurTotale
        };
    }, [produitsSt]);

    // Les filtres avancés sont maintenant définis plus haut dans le composant

    // Gestion des changements de filtres
    const handleFiltreChange = (e) => {
        const { name, value } = e.target;
        setFiltresAvances(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Fonction pour appliquer les filtres avancés
    const appliquerFiltres = () => {
        // Convertir les filtres avancés en format compatible avec le backend
        const newColumnFilters = [];
        
        if (filtresAvances.categorie) {
            newColumnFilters.push({
                id: 'categorie',
                value: filtresAvances.categorie
            });
        }
        
        if (filtresAvances.typeProduit) {
            newColumnFilters.push({
                id: 'typeProduit',
                value: filtresAvances.typeProduit
            });
        }
        
        if (filtresAvances.status) {
            if (filtresAvances.status === 'rupture') {
                // Filtre pour les produits en rupture de stock
                newColumnFilters.push({
                    id: 'stockGlobal',
                    value: '0'
                });
            } else if (filtresAvances.status === 'seuil') {
                // Ce filtre sera géré spécialement dans le backend
                newColumnFilters.push({
                    id: 'seuil_minimal',
                    value: 'true'
                });
            } else {
                // Filtre par status actif/inactif
                newColumnFilters.push({
                    id: 'status',
                    value: filtresAvances.status
                });
            }
        }
        
        // Appliquer les filtres
        setColumnFilters(newColumnFilters);
        
        // Appliquer le terme de recherche comme filtre global
        if (filtresAvances.searchTerm) {
            setGlobalFilter(filtresAvances.searchTerm);
        } else {
            setGlobalFilter('');
        }
    };

    // Fonction pour réinitialiser les filtres
    const reinitialiserFiltres = () => {
        setFiltresAvances({
            categorie: '',
            typeProduit: '',
            departement: '',
            status: '',
            searchTerm: ''
        });
        
        // Réinitialiser également les filtres du tableau
        setColumnFilters([]);
        setGlobalFilter('');
    };

    return (
        <PanelLayout
            auth={auth}
            success={success}
            error={error}
            errors={errors}
            active={'stock'}
            sousActive={'inventaire'}
            breadcrumbs={[
                {
                    text: "Inventaire",
                    href: route("admin.stock.inventaire.index", [auth.user.id]),
                    active: true
                }
            ]}
        >
            <div className={'grid gap-5 bg-gray-200 p-2 rounded border w-full'}>
                {/* Titre et description */}
                <div className="flex justify-between items-center">
                    <div>
                        <div className="bg-black w-fit p-2 rounded text-xl font-bold text-white">
                            <h2>Gestion des inventaires</h2>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Tooltip title="Rafraîchir les données">
                            <IconButton onClick={() => window.location.reload()}>
                                <Refresh />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>

                {/* Filtres avancés */}
                <Paper elevation={2} className="p-4">
                    <Typography variant="h6" gutterBottom>
                        Filtres Avancés
                    </Typography>
                    <Grid container spacing={2} className="mb-3">
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Catégorie</InputLabel>
                                <Select
                                    name="categorie"
                                    value={filtresAvances.categorie}
                                    onChange={handleFiltreChange}
                                    label="Catégorie"
                                >
                                    <MenuItem value="">Toutes</MenuItem>
                                    {categories && categories.map((cat) => (
                                        <MenuItem key={cat.id} value={cat.id}>{cat.nom}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Type de Produit</InputLabel>
                                <Select
                                    name="typeProduit"
                                    value={filtresAvances.typeProduit}
                                    onChange={handleFiltreChange}
                                    label="Type de Produit"
                                >
                                    <MenuItem value="">Tous</MenuItem>
                                    {typeProduits && typeProduits.map((type) => (
                                        <MenuItem key={type.id} value={type.id}>{type.nom}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Département</InputLabel>
                                <Select
                                    name="departement"
                                    value={filtresAvances.departement}
                                    onChange={handleFiltreChange}
                                    label="Département"
                                >
                                    <MenuItem value="">Tous</MenuItem>
                                    {departements && departements.map((dept) => (
                                        <MenuItem key={dept.id} value={dept.id}>{dept.nom}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Statut</InputLabel>
                                <Select
                                    name="status"
                                    value={filtresAvances.status}
                                    onChange={handleFiltreChange}
                                    label="Statut"
                                >
                                    <MenuItem value="">Tous</MenuItem>
                                    <MenuItem value="1">Actif</MenuItem>
                                    <MenuItem value="0">Inactif</MenuItem>
                                    <MenuItem value="rupture">En rupture</MenuItem>
                                    <MenuItem value="seuil">Sous seuil minimal</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Recherche par nom, référence..."
                                name="searchTerm"
                                value={filtresAvances.searchTerm}
                                onChange={handleFiltreChange}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton size="small">
                                            <Search />
                                        </IconButton>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} className="flex justify-end">
                            <Button 
                                variant="outlined" 
                                color="secondary" 
                                onClick={reinitialiserFiltres}
                                className="mr-2"
                                startIcon={<Refresh />}
                            >
                                Réinitialiser
                            </Button>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={appliquerFiltres}
                                startIcon={<Search />}
                            >
                                Appliquer les filtres
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Cartes de statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <Card elevation={2}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Total Produits
                                </Typography>
                                <Typography variant="h4" component="div">
                                    {statsData.totalProduits}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {filtresAvances.departement ? 
                                        `Produits dans ${departements.find(d => d.id == filtresAvances.departement)?.nom || 'le département'}` : 
                                        'Produits en inventaire'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Card elevation={2}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Stock Critique
                                </Typography>
                                <Typography variant="h4" component="div" color="warning.main">
                                    {statsData.sousstockCritique}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Produits à réapprovisionner
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Card elevation={2}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    En Rupture
                                </Typography>
                                <Typography variant="h4" component="div" color="error.main">
                                    {statsData.enRupture}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Produits en rupture de stock
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Card elevation={2}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Valeur Totale
                                </Typography>
                                <Typography variant="h4" component="div" color="primary.main">
                                    {formatNumber(statsData.valeurTotale)} GNF
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Valeur de l'inventaire
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-wrap gap-3">
                    <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<FactCheck />}
                        onClick={() => router.get(route('admin.inventaire.physique.index', auth.user.id))}
                    >
                        Inventaire Physique
                    </Button>
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        startIcon={<CompareArrows />}
                        onClick={() => router.get(route('admin.inventaire.ajustement.index', auth.user.id))}
                    >
                        Ajustements d'Inventaire
                    </Button>
                    <Button 
                        variant="contained" 
                        color="warning" 
                        startIcon={<Assessment />}
                    >
                        Rapports d'Inventaire
                    </Button>
                    <Button 
                        variant="contained" 
                        color="info" 
                        startIcon={<LocalShipping />}
                    >
                        Commandes Fournisseurs
                    </Button>
                </div>

                {/* Dialogs */}
                <div>
                    {
                        /////// EDIT DIALOG
                    }

                    <Dialog open={openEdit} onClose={handleCloseEdit}>
                        <DialogTitle className={'bg-blue-600 text-white'}>Modification du produit</DialogTitle>
                        <DialogContent className={'space-y-5'}>
                            <div className={'mt-5'}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="nom"
                                    name={'nom'}
                                    label="Nom"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={data.nom}
                                    onChange={handleChange}
                                />
                                <InputError message={errors.nom} className="mt-2" />
                            </div>

                            <div>
                                <Autocomplete
                                    disablePortal
                                    id="typeProduit"
                                    options={typeProduits}
                                    getOptionLabel={(option) => option.nom}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    value={data.typeProduit}
                                    onChange={(event, newValue) => {
                                        setData('typeProduit', newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Type de produit" />}
                                />
                                <InputError message={errors.typeProduit} className="mt-2" />
                            </div>

                            <div>
                                <Autocomplete
                                    disablePortal
                                    id="categorie"
                                    options={categories}
                                    getOptionLabel={(option) => option.nom}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    value={data.categorie}
                                    onChange={(event, newValue) => {
                                        setData('categorie', newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Catégorie" />}
                                />
                                <InputError message={errors.categorie} className="mt-2" />
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button variant={'contained'} color={'error'} onClick={handleCloseEdit}>Annuler</Button>
                            <Button variant={'contained'} color={'success'} onClick={handleUpdate}>Enregistrer</Button>
                        </DialogActions>
                    </Dialog>

                    {
                        /////// SHOW DIALOG
                    }

                    <Dialog open={openShow} onClose={handleCloseShow}>
                        <DialogTitle className={'bg-blue-600 text-white'}>Détails du produit</DialogTitle>
                        <DialogContent className={'space-y-5'}>
                            {
                                <div className={'grid grid-cols-2 mt-5 divide-y divide-x border w-96 min-w-fit'}>
                                    <>
                                        <div className={'font-bold py-2 px-2'}>
                                            NOM
                                        </div>
                                        <div className={'py-2 px-2'}>
                                            {data.nom}
                                        </div>
                                    </>

                                    <>
                                        <div className={'font-bold py-2 px-2'}>
                                            TYPE
                                        </div>
                                        <div className={'py-2 px-2'}>
                                            {data.typeProduit?.nom}
                                        </div>
                                    </>

                                    <>
                                        <div className={'font-bold py-2 px-2'}>
                                            CATEGORIE
                                        </div>
                                        <div className={'py-2 px-2'}>
                                            {data.categorie?.nom}
                                        </div>
                                    </>
                                </div>
                            }
                        </DialogContent>
                    </Dialog>

                    {
                        /////// DELETE DIALOG
                    }

                    <Dialog open={openDelete} onClose={handleCloseDelete}>
                        <DialogTitle className={'bg-orange-600 text-white'}>Suppression du produit</DialogTitle>
                        <DialogContent className={'space-y-5'}>
                            <div className={'mt-5'}>
                                {
                                    data.message === 'delete' && 'Voulez-vous vraiment suspendre ce produit'
                                }

                                {
                                    data.message === 'check' && 'Voulez-vous vraiment débloquer ce produit'
                                }
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button variant={'contained'} color={'error'} onClick={handleCloseDelete}>
                                <Close></Close>  Non
                            </Button>
                            <Button variant={'contained'} color={'success'} onClick={handleSuspend}>
                                <Check></Check> Oui
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>

                {/* Tableau des produits */}
                <Paper elevation={2} className="p-4 overflow-scroll">
                    <div className="flex justify-between items-center mb-4">
                        <Typography variant="h6">
                            Liste des Produits en Stock
                        </Typography>
                        {filtresAvances.departement && (
                            <Chip 
                                color="primary" 
                                label={`Stock du département: ${departements.find(d => d.id == filtresAvances.departement)?.nom || 'Sélectionné'}`}
                                onDelete={() => {
                                    setFiltresAvances(prev => ({ ...prev, departement: '' }));
                                    // Appliquer les filtres mis à jour
                                    setTimeout(() => appliquerFiltres(), 100);
                                }}
                            />
                        )}
                    </div>
                    <div>
                        <MaterialReactTable table={table} />
                    </div>
                </Paper>
            </div>
        </PanelLayout>
    );
}

export default Index;
