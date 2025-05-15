import React, {useEffect, useState} from 'react';
import PanelLayout from "@/Layouts/PanelLayout.jsx";
import ReferentielLayout from "@/Layouts/ReferentielLayout.jsx";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { MRT_Localization_FR } from 'material-react-table/locales/fr';
import {router, useForm} from "@inertiajs/react";
import {Alert, AlertTitle, Autocomplete, Snackbar} from "@mui/material";
import {Add, AddCircle, AddOutlined, ArrowBack, Check, Close, Delete, Edit, Visibility, FileUpload, FileDownload, Warning, ErrorOutline, TrendingUp} from "@mui/icons-material";
import InputError from "@/Components/InputError.jsx";
import { formatNumber } from 'chart.js/helpers';
import { useMemo } from 'react';

function Index({auth,errors,produits,typeProduits,categories,departements,error,success,filters,stats}) {
    // État pour la pagination et le filtrage côté client
    const [pagination, setPagination] = useState({
        pageIndex: produits.current_page - 1,
        pageSize: produits.per_page,
    });
    
    // État pour les filtres
    const [categorieFilter, setCategorieFilter] = useState(filters?.categorie_id || '');
    const [typeProduitFilter, setTypeProduitFilter] = useState(filters?.type_produit_id || '');
    const [stockFilter, setStockFilter] = useState(filters?.stock_filter || 'all');
    const [departementFilter, setDepartementFilter] = useState(filters?.departement_id || '');

    // Utiliser directement les données fournies par le contrôleur
    const handlePaginationChange = (updatedPagination) => {
        setPagination(updatedPagination);
        
        // Naviguer vers la page demandée en utilisant Inertia
        router.get(route('admin.stock.produit.index', {userId: auth.user.id}), {
            page: updatedPagination.pageIndex + 1,
            per_page: updatedPagination.pageSize,
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['produits'],
        });
    };
    
    // Fonction pour gérer le filtrage global
    const handleGlobalFilterChange = (value) => {
        router.get(route('admin.stock.produit.index', {userId: auth.user.id}), {
            search: value,
            page: 1, // Réinitialiser à la première page lors d'une recherche
            categorie_id: categorieFilter,
            type_produit_id: typeProduitFilter,
            stock_filter: stockFilter,
            departement_id: departementFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['produits'],
        });
    };
    
    // Fonction pour gérer les changements de filtres
    const handleFilterChange = (filterType, value) => {
        switch(filterType) {
            case 'categorie':
                setCategorieFilter(value);
                break;
            case 'typeProduit':
                setTypeProduitFilter(value);
                break;
            case 'stock':
                setStockFilter(value);
                break;
            case 'departement':
                setDepartementFilter(value);
                break;
            default:
                break;
        }
        
        // Appliquer les filtres
        router.get(route('admin.stock.produit.index', {userId: auth.user.id}), {
            search: filters?.search || '',
            page: 1, // Réinitialiser à la première page lors d'un changement de filtre
            categorie_id: filterType === 'categorie' ? value : categorieFilter,
            type_produit_id: filterType === 'typeProduit' ? value : typeProduitFilter,
            stock_filter: filterType === 'stock' ? value : stockFilter,
            departement_id: filterType === 'departement' ? value : departementFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['produits', 'stats'],
        });
    };
    
    // Fonction pour gérer le tri
    const handleSortingChange = (updatedSorting) => {
        if (updatedSorting.length > 0) {
            router.get(route('admin.stock.produit.index', {userId: auth.user.id}), {
                sort_field: updatedSorting[0].id,
                sort_direction: updatedSorting[0].desc ? 'desc' : 'asc',
                page: pagination.pageIndex + 1,
                categorie_id: categorieFilter,
                type_produit_id: typeProduitFilter,
                stock_filter: stockFilter,
                departement_id: departementFilter,
            }, {
                preserveState: true,
                preserveScroll: true,
                only: ['produits'],
            });
        }
    }
    
    // Fonction pour formater les valeurs monétaires
    const formatMoney = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        }).format(amount);
    }


    //PAGINATION


    const {data,setData,post, put, reset} = useForm(
        {
            'id':'',
            'nom':'',
            'typeProduit':null,
            'categorie':null,
        }
    )

    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openShow, setOpenShow] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const handleClickOpen = () => {
        router.get(route("admin.stock.produit.create", {userId: auth.user.id}), {onSuccess:()=>reset()})
    };
    
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            
            router.post(route('admin.stock.produit.import-csv', {userId: auth.user.id}), formData, {
                onSuccess: () => {
                    // Réinitialiser l'input file
                    event.target.value = null;
                }
            });
        }
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
            ?
            setData(e.target.name,e.target.checked)
            :
            setData(e.target.name,e.target.value);
    };

    const handleSubmit = () => {
        post(route('admin.produit.store'),{
            onSuccess:()=> {
                reset()
                setOpen(false);
            },
        })
    };

    const handleEdit = (  el ) => {
        router.get(route("admin.produit.edit",[auth.user.id,el.id]),{preserveScroll:true})
    };

    const handleShow = (  el ) => {
        setData({
            'id' : el.id,
            'nom': el.nom || '',
            'typeProduit':el.type_souscripteur || null,
            'categorie':el.categorie_souscripteur ||null,
        })

        setOpenShow(true);
    };

    const handleDelete = (id,message) => {
        setData({
            'id' : id,
            message : message
        })

        setOpenDelete(true);
    };

    const handleUpdate = () => {
        put(route('admin.produit.update',data.id),{
            onSuccess:()=> {
                reset()
                setOpenEdit(false);
            },
        })

    };

    const handleSuspend = () => {
        setOpen(false);
        router.delete(route('admin.produit.destroy',{id:data.id}))
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'nom', //access nested data with dot notation
                header: 'Nom',
                //size: 10,
            },
            
            {
                accessorKey: 'typeProduitAchat',
                header: 'Option d\'achat',
                //size: 50,
                Cell: ({ row }) =>(
                    row.original.type_produit_achat?.libelle
                )
            },
            {
                accessorKey: 'prixAchat', //access nested data with dot notation
                header: 'Prix d\'achat (GNF)',
                //size: 10,
                Cell: ({ row }) =>(
                    formatNumber(row.original.prixAchat ?? 0)
                )
            },
            {
                accessorKey: 'quantiteAchat',
                header: 'Quantité à l\'achat',
                //size: 50,
                Cell: ({ row }) =>(
                    formatNumber(row.original.quantiteAchat ?? 0)
                )
            },

            {
                accessorKey: 'typeProduitVente',
                header: 'Option de vente',
                //size: 50,
                Cell: ({ row }) =>(
                    row.original.type_produit_vente?.libelle
                )
            },
            {
                accessorKey: 'prixVente', //access nested data with dot notation
                header: "Prix d'achat (GNF)",
                //size: 10,
                Cell: ({ row }) =>(
                    formatNumber(row.original.prixVente ?? 0)
                )
            },
            {
                accessorKey: 'quantiteVente',
                header: 'Quantité à la vente',
                //size: 50,
                Cell: ({ row }) =>(
                    formatNumber(row.original.quantiteVente ?? 0)
                )
            },

            {
                accessorKey: 'categorie',
                header: 'Categorie',
                //size: 50,
                Cell: ({ row }) =>(
                    row.original.categorie?.libelle
                )
            },
            /* {
                accessorKey: 'fournisseurPrincipal',
                header: 'Fournisseur principal',
                //size: 50,
                Cell: ({ row }) =>(
                    row.original.fournisseur_principal?.nom
                )
            }, */
            {
                accessorKey: 'status',
                header: 'Status',
                //size: 50,
                Cell: ({ row }) =>(
                    row.original.status
                        ?
                        <div className={'p-2 font-bold bg-green-500 text-white w-fit h-fit rounded'}>
                            Actif
                        </div>
                        :
                        <div className={'p-2 font-bold bg-red-500 text-white w-fit h-fit rounded'}>
                            Inactif
                        </div>
                )
            },
            {
                accessorKey: 'action',
                header: 'Action',
                Cell: ({ row }) =>(
                    <div className={'flex gap-2'} key={row.original.id}>
                        <Button onClick={()=>handleShow(row.original)} variant={'contained'} size={'small'} color={'info'}>
                            <Visibility></Visibility>
                        </Button>

                        <Button onClick={()=>handleEdit(row.original)} variant={'contained'} size={'small'} color={'secondary'}>
                            <Edit></Edit>
                        </Button>

                        {
                            row.original.status
                                ?
                                <Button onClick={()=>handleDelete(row.original.id,"delete")} variant={'contained'} size={'small'} color={'error'}>
                                    <Delete></Delete>
                                </Button>
                                :
                                <Button onClick={()=>handleDelete(row.original.id,'check')} variant={'contained'} size={'small'} color={'success'}>
                                    <Check></Check>
                                </Button>
                        }
                    </div>
                )

            },
        ],
        [],
    );


    const table = useMaterialReactTable({
        columns,
        data: produits.data,
        getRowId: (row) => row.id,
        initialState: { showColumnFilters: false },
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
        onGlobalFilterChange: handleGlobalFilterChange,
        onPaginationChange: handlePaginationChange,
        onSortingChange: handleSortingChange,
        rowCount: produits.total,
        state: {
            pagination,
        },
        localization: MRT_Localization_FR
    });

    return (
        <PanelLayout
            auth={auth}
            success={success}
            error={error}
            errors={errors}
            active={'stock'}
            sousActive={'produit'}
            breadcrumbs={[
                {
                    text:"Stock",
                    href:route("admin.dashboard", {id: auth.user.id}),
                    active:false
                },
                {
                    text:"Produits",
                    href:route("admin.stock.produit.index", {userId: auth.user.id}),
                    active:true
                },
                /*{
                    text:"Création",
                    href:route("superAdmin.produit.create",[auth.user.id]),
                    active:true
                }*/
            ]}
        >
            <div className="p-4 bg-white rounded shadow">
                <div className={'flex justify-between items-center mb-4'}>
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold">Liste des produits</h1>
                        <Button 
                            variant="outlined" 
                            startIcon={<ArrowBack />}
                            onClick={() => router.get(route('admin.dashboard', {id: auth.user.id}))}
                        >
                            Retour au tableau de bord
                        </Button>
                        
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            color={'success'} 
                            variant={'outlined'} 
                            onClick={() => window.location.href = route('admin.stock.produit.export-csv', {userId: auth.user.id})}
                        >
                            <FileDownload className={'mr-1'} /> Exporter CSV
                        </Button>
                        <label htmlFor="upload-csv">
                            <input
                                style={{ display: 'none' }}
                                id="upload-csv"
                                name="upload-csv"
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                            />
                            <Button 
                                color={'info'} 
                                variant={'outlined'} 
                                component="span"
                            >
                                <FileUpload className={'mr-1'} /> Importer CSV
                            </Button>
                        </label>
                        <Button color={'warning'} variant={'contained'} onClick={handleClickOpen} >
                            <AddCircle className={'mr-1'} /> Ajout produit
                        </Button>
                    </div>

                    

                    {
                        ///////ADD DIALOG
                    }
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle className={'bg-orange-600 text-white'}>Ajout du produit</DialogTitle>
                        <DialogContent className={'space-y-5'}>
                            {/*<DialogContentText>
                                To subscribe to this website, please enter your email address here. We
                                will send updates occasionally.
                            </DialogContentText>*/}
                            <div className={'grid sm:grid-cols-2 grid-cols-1 bg-gray-50 gap-5 p-2 m-2 rounded'}>
                                <div>
                                    <TextField
                                        value={data.nom}
                                        autoFocus
                                        id="nom"
                                        name="nom"
                                        label="Nom"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.nom} className="mt-2" />
                                </div>

                                <div
                                    className={"w-full"}
                                >
                                    <Autocomplete
                                        className={"w-full"}
                                        onChange={(e,val)=>setData("typeProduit",val)}
                                        disablePortal={true}
                                        options={typeProduits}
                                        getOptionLabel={(option)=>option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Type de produit"} label={params.nom}/>}
                                    />
                                    <InputError message={errors["data.typeProduit"]}/>
                                </div>

                                <div
                                    className={"w-full"}
                                >
                                    <Autocomplete
                                        className={"w-full"}
                                        onChange={(e,val)=>setData("categorie",val)}
                                        disablePortal={true}
                                        options={categories}
                                        groupBy={(option) => option.categorie.libelle}
                                        getOptionLabel={(option)=>option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Catégorie de produit"} label={params.nom}/>}
                                    />
                                    <InputError message={errors["data.categorie"]}/>
                                </div>

                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button variant={'contained'} color={'error'} onClick={handleClose}>Annuler</Button>
                            <Button variant={'contained'} color={'success'} onClick={handleSubmit}>Enregistrer</Button>
                        </DialogActions>
                    </Dialog>

                    {
                        /////// EDIT DIALOG
                    }

                    <Dialog open={openEdit} onClose={handleCloseEdit}>
                        <DialogTitle className={'bg-orange-600 text-white'}>Modification du produit</DialogTitle>
                        <DialogContent className={'space-y-5'}>
                            {/*<DialogContentText>
                                To subscribe to this website, please enter your email address here. We
                                will send updates occasionally.
                            </DialogContentText>*/}
                            <div className={'grid sm:grid-cols-2 grid-cols-1 bg-gray-50 gap-5 p-2 m-2 rounded'}>
                                <div>
                                    <TextField
                                        value={data.nom}
                                        autoFocus
                                        id="nom"
                                        name="nom"
                                        label="Nom"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.nom} className="mt-2" />
                                </div>

                                <div
                                    className={"w-full"}
                                >
                                    <Autocomplete
                                        value={data.typeProduit}
                                        className={"w-full"}
                                        onChange={(e,val)=>setData("typeProduit",val)}
                                        disablePortal={true}
                                        options={typeProduits}
                                        getOptionLabel={(option)=>option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Type de produit"} label={params.nom}/>}
                                    />
                                    <InputError message={errors["data.typeProduit"]}/>
                                </div>

                                <div
                                    className={"w-full"}
                                >
                                    <Autocomplete
                                        value={data.categorie}
                                        className={"w-full"}
                                        onChange={(e,val)=>setData("categorie",val)}
                                        disablePortal={true}
                                        options={categories}
                                        groupBy={(option) => option.categorie.libelle}
                                        getOptionLabel={(option)=>option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Catégorie de produit"} label={params.nom}/>}
                                    />
                                    <InputError message={errors["data.categorie"]}/>
                                </div>
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
                        <DialogTitle className={'bg-orange-600 text-white'}>Details du produit</DialogTitle>
                        <DialogContent className={'space-y-5'}>
                            {/*<DialogContentText>
                                To subscribe to this website, please enter your email address here. We
                                will send updates occasionally.
                            </DialogContentText>*/}
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
                        {/*<DialogActions>
                            <Button variant={'contained'} color={'error'} onClick={handleCloseShow}>Annuler</Button>
                            <Button variant={'contained'} color={'success'} onClick={handleUpdate}>Enregistrer</Button>
                        </DialogActions>*/}
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

                <div>
                        {/* Statistiques globales */}
                        <Grid container spacing={2} sx={{ mt: 2, mb: 3 }}>
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                                    {stats?.departement ? `Statistiques pour le département: ${stats.departement.nom_departement}` : 'Statistiques globales'}
                                    {(departementFilter || categorieFilter || typeProduitFilter || stockFilter !== 'all') && (
                                        <Typography variant="caption" sx={{ ml: 1, fontWeight: 'normal', display: 'inline-block' }}>
                                            (filtrées selon les critères sélectionnés)
                                        </Typography>
                                    )}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography variant="h6" color="primary">Total Produits</Typography>
                                    <Typography variant="h4">{stats?.departement ? stats.departement.total_produits : stats?.total_produits || 0}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff9c4' }}>
                                    <Typography variant="h6" color="warning.main" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Warning fontSize="small" sx={{ mr: 1 }} /> Stock Critique
                                    </Typography>
                                    <Typography variant="h4" color="warning.main">
                                        {stats?.departement ? stats.departement.stockCritique : stats?.stockCritique || 0}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {stats && (
                                            stats.departement ? 
                                                `${Math.round(((stats.departement?.stockCritique || 0) / (stats.departement?.total_produits || 1)) * 100)}%` : 
                                                `${Math.round(((stats?.stockCritique || 0) / (stats?.total_produits || 1)) * 100)}%`
                                        )}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#ffebee' }}>
                                    <Typography variant="h6" color="error" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <ErrorOutline fontSize="small" sx={{ mr: 1 }} /> Stock Épuisé
                                    </Typography>
                                    <Typography variant="h4" color="error">
                                        {stats?.departement ? stats.departement.stock_epuise : stats?.stock_epuise || 0}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {stats && (
                                            stats.departement ? 
                                                `${Math.round(((stats.departement?.stock_epuise || 0) / (stats.departement?.total_produits || 1)) * 100)}%` : 
                                                `${Math.round(((stats?.stock_epuise || 0) / (stats?.total_produits || 1)) * 100)}%`
                                        )}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#e8f5e9' }}>
                                    <Typography variant="h6" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <TrendingUp fontSize="small" sx={{ mr: 1 }} /> Valeur Stock
                                    </Typography>
                                    <Typography variant="h4" color="success.main">
                                        {formatMoney(stats?.departement ? stats.departement.valeur_totale_stock : stats?.valeur_totale_stock || 0)}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                        
                        {/* Filtres */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Filtres</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth variant="outlined" size="small">
                                    <InputLabel>Département</InputLabel>
                                    <Select
                                        value={departementFilter}
                                        onChange={(e) => handleFilterChange('departement', e.target.value)}
                                        label="Département"
                                    >
                                        <MenuItem value="">Tous les départements</MenuItem>
                                        {departements?.map((departement) => (
                                            <MenuItem key={departement.id} value={departement.id}>{departement.nom}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth variant="outlined" size="small">
                                    <InputLabel>Catégorie</InputLabel>
                                    <Select
                                        value={categorieFilter}
                                        onChange={(e) => handleFilterChange('categorie', e.target.value)}
                                        label="Catégorie"
                                    >
                                        <MenuItem value="">Toutes les catégories</MenuItem>
                                        {categories.map((categorie) => (
                                            <MenuItem key={categorie.id} value={categorie.id}>{categorie.nom}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth variant="outlined" size="small">
                                    <InputLabel>Type de produit</InputLabel>
                                    <Select
                                        value={typeProduitFilter}
                                        onChange={(e) => handleFilterChange('typeProduit', e.target.value)}
                                        label="Type de produit"
                                    >
                                        <MenuItem value="">Tous les types</MenuItem>
                                        {typeProduits.map((type) => (
                                            <MenuItem key={type.id} value={type.id}>{type.nom}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth variant="outlined" size="small">
                                    <InputLabel>État du stock</InputLabel>
                                    <Select
                                        value={stockFilter}
                                        onChange={(e) => handleFilterChange('stock', e.target.value)}
                                        label="État du stock"
                                    >
                                        <MenuItem value="all">Tous les produits</MenuItem>
                                        <MenuItem value="low">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Warning fontSize="small" color="warning" sx={{ mr: 1 }} />
                                                Stock critique
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="out">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <ErrorOutline fontSize="small" color="error" sx={{ mr: 1 }} />
                                                Stock épuisé
                                            </Box>
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        
                        {/* Filtres actifs */}
                        {(departementFilter || categorieFilter || typeProduitFilter || stockFilter !== 'all') && (
                            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                <Typography variant="body2" sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                                    Filtres actifs:
                                </Typography>
                                {departementFilter && (
                                    <Chip 
                                        label={`Département: ${departements?.find(d => d.id === parseInt(departementFilter))?.nom || ''}`}
                                        onDelete={() => handleFilterChange('departement', '')}
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                                {categorieFilter && (
                                    <Chip 
                                        label={`Catégorie: ${categories.find(c => c.id === parseInt(categorieFilter))?.nom || ''}`}
                                        onDelete={() => handleFilterChange('categorie', '')}
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                                {typeProduitFilter && (
                                    <Chip 
                                        label={`Type: ${typeProduits.find(t => t.id === parseInt(typeProduitFilter))?.nom || ''}`}
                                        onDelete={() => handleFilterChange('typeProduit', '')}
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                                {stockFilter !== 'all' && (
                                    <Chip 
                                        label={stockFilter === 'low' ? 'Stock critique' : 'Stock épuisé'}
                                        onDelete={() => handleFilterChange('stock', 'all')}
                                        color={stockFilter === 'low' ? 'warning' : 'error'}
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                                <Button 
                                    variant="text" 
                                    size="small" 
                                    startIcon={<Close fontSize="small" />}
                                    onClick={() => {
                                        setDepartementFilter('');
                                        setCategorieFilter('');
                                        setTypeProduitFilter('');
                                        setStockFilter('all');
                                        router.get(route('admin.stock.produit.index', {userId: auth.user.id}), {
                                            page: 1
                                        });
                                    }}
                                >
                                    Réinitialiser tous les filtres
                                </Button>
                            </Box>
                        )}
                    </div>

                <MaterialReactTable
                    table={table}
                />
            </div>

        </PanelLayout>
    );
}

export default Index;
