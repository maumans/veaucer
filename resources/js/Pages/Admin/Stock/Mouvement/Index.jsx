import React, { useEffect, useState, useMemo } from 'react';
/**
 * Composant de gestion des mouvements de stock
 * 
 * Ce composant permet de gérer tous les mouvements de stock (entrées, sorties, ajustements)
 * avec des fonctionnalités avancées de filtrage, tri et pagination.
 * 
 * Fonctionnalités principales:
 * - Affichage des mouvements de stock avec pagination côté serveur
 * - Filtres avancés par type d'opération, département, fournisseur, état, dates et montant
 * - Création, modification et suppression de mouvements
 * - Exportation et importation de données
 * 
 * @version 2.5.0
 * @date 2025-05-15
 * @author Veaucer Team
 */

import PanelLayout from "@/Layouts/PanelLayout.jsx";
import ReferentielLayout from "@/Layouts/ReferentielLayout.jsx";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'

import { MRT_Localization_FR } from 'material-react-table/locales/fr';
import { router, useForm } from "@inertiajs/react";
import { Alert, AlertTitle, Autocomplete, Button, Chip, Snackbar } from "@mui/material";
import { Add, AddCircle, Remove, AddOutlined, ArrowBack, Check, Close, Delete, Edit, Visibility, SwapHoriz, Tune as TuneIcon, FilterList } from "@mui/icons-material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InputError from "@/Components/InputError.jsx";
import { formatNumber } from "chart.js/helpers";
import useDidUpdate from "@/Fonctions/useDidUpadte.jsx";
import dayjs from "dayjs";

function Index({ auth, errors, operations, departements, fournisseurs, typeOperations, typeProduits, categorieProduits, error, success }) {
    //PAGINATION

    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [rowCount, setRowCount] = useState(0);


    //table state
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: operations.current_page - 1,
        pageSize: operations.per_page,
    });


    useDidUpdate(() => {
        // Conversion des filtres pour le backend
        const formattedFilters = {};

        // Traiter chaque filtre individuellement pour s'assurer qu'ils sont au bon format
        columnFilters.forEach(filter => {
            // Gérer spécifiquement les filtres de date qui ont une structure différente
            if (filter.id === 'date_range' && typeof filter.value === 'object') {
                formattedFilters['date_range'] = filter.value;
            } else {
                formattedFilters[filter.id] = filter.value;
            }
        });

        console.log('Filtres envoyés au backend:', formattedFilters);

        router.get(route('admin.stock.mouvement.index', [auth.user.id]),
            {
                'start': pagination.pageIndex * pagination.pageSize,
                "size": pagination.pageSize,
                'filters': formattedFilters,
                'globalFilter': globalFilter ?? '',
                'sorting': sorting ?? []
            }, {
            preserveScroll: true, preserveState: true
        })
    }, [
        pagination.pageIndex,
        pagination.pageSize,
        globalFilter,
        columnFilters,
        sorting
    ])

    //PAGINATION


    const { data, setData, post, put, reset } = useForm(
        {
            'id': '',
            'nom': '',
            'typeProduit': null,
            'categorieProduit': null,
        }
    )

    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openShow, setOpenShow] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const handleClickOpen = (mouvement) => {

        router.get(route("admin.stock.mouvement.create", auth.user.id), { mouvement }, { onSuccess: () => reset() })

        //reset()
        //setOpen(true);
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
            setData(e.target.name, e.target.checked)
            :
            setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.stock.mouvement.store'), {
            ...data,
            preserveScroll: true
        })
    };

    const handleEdit = (el) => {
        // Redirection vers la page d'édition du mouvement
        router.get(route("admin.stock.mouvement.edit", [auth.user.id, el.id]), {
            preserveScroll: true,
            onError: (errors) => {
                console.error("Erreur lors de la redirection vers la page d'édition:", errors);
                alert("Erreur lors de la redirection vers la page d'édition. Veuillez réessayer.");
            }
        });
    };

    const handleShow = (id) => {
        // Afficher un indicateur de chargement ou désactiver temporairement le bouton si nécessaire
        // setIsLoading(true);

        // Redirection vers la page de détails du mouvement
        router.get(route('admin.stock.mouvement.show', [auth.user.id, id]), {
            preserveState: true, // Préserver l'état actuel pour pouvoir revenir facilement
            onSuccess: () => {
                // setIsLoading(false);
                // Aucune action supplémentaire nécessaire car la redirection se fait automatiquement
            },
            onError: (errors) => {
                // setIsLoading(false);
                console.error("Erreur lors de l'affichage des détails:", errors);
                alert("Erreur lors de l'affichage des détails: " + (errors.error || "Veuillez réessayer."));
            }
        });
    };

    const handleDelete = (id) => {
        // Confirmation avant suppression
        if (confirm('Êtes-vous sûr de vouloir supprimer ce mouvement ? Cette action est irréversible.')) {
            // Utilisation de router.delete avec le bon format de route pour Laravel Resource Controller
            router.delete(route('admin.stock.mouvement.destroy', [auth.user.id, id]), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    // Message de succès
                    alert('Mouvement supprimé avec succès');
                    // Actualiser la liste des mouvements après suppression
                    router.reload({ only: ['operations'] });
                },
                onError: (errors) => {
                    console.error("Erreur lors de la suppression:", errors);
                    alert("Erreur lors de la suppression: " + (errors.error || "Veuillez réessayer."));
                }
            });
        }
    };

    const handleCancel = (id) => {
        if (confirm('Êtes-vous sûr de vouloir annuler ce mouvement ? Cette action créera une opération inverse.')) {
            // Afficher un indicateur de chargement ou désactiver temporairement le bouton si nécessaire
            // setIsLoading(true);

            router.get(route('admin.stock.mouvement.cancel', [auth.user.id, id]), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    // setIsLoading(false);
                    // Message de succès
                    alert('Mouvement annulé avec succès. Une opération inverse a été créée.');
                    // Actualiser la liste des mouvements après annulation
                    router.reload({ only: ['operations'] });
                },
                onError: (errors) => {
                    // setIsLoading(false);
                    console.error("Erreur lors de l'annulation:", errors);
                    alert("Erreur lors de l'annulation: " + (errors.error || "Veuillez réessayer."));
                }
            });
        }
    };

    const handleUpdate = () => {
        put(route('admin.stock.mouvement.update', data.id), {
            onSuccess: () => {
                reset()
                setOpenEdit(false);
            },
        })

    };

    const handleSuspend = () => {
        setOpen(false);
        router.delete(route('admin.stock.mouvement.destroy', { id: data.id }))
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'date', //access nested data with dot notation
                header: 'Date',
                //size: 10,
                Cell: ({ row }) => (
                    dayjs(row.original.date).format('DD/MM/YYYY')
                )
            },
            {
                accessorKey: 'type_operation', //access nested data with dot notation
                header: 'Type',
                Cell: ({ row }) => row.original?.type_operation?.nom?.toLowerCase() === "entrée" ?
                    <Chip label="Entrée" color="success" /> :
                    row.original?.type_operation?.nom?.toLowerCase() === "sortie" ?
                        <Chip label="Sortie" color="error" /> :
                        row.original?.type_operation?.nom?.toLowerCase() === "transfert" ?
                            <Chip label="Transfert" color="warning" /> :
                            <Chip label={row.original?.type_operation?.nom?.toLowerCase()} color="default" />,
                //size: 10,
            },

            {
                accessorKey: 'departement_destination_id', //access nested data with dot notation
                header: 'Departement destination',
                Cell: ({ row }) => (
                    row.original.departement_destination?.nom
                )
                //size: 10,
            },
            {
                accessorKey: 'montant', //access nested data with dot notation
                header: 'Total',
                Cell: ({ row }) => (
                    row.original.montant ? formatNumber(row.original.montant) + ' GNF' : ""
                )
                //size: 10,
            },
            {
                accessorKey: 'fournisseur.nom',
                header: 'Fournisseur',
                //size: 50,
                Cell: ({ row }) => (
                    row.original.fournisseur?.nom
                )
            },
            {
                accessorKey: 'etat',
                header: 'Etat',
                //size: 50,
                Cell: ({ row }) => (
                    row.original.etat === 'COMMANDE'
                        ?
                        <div className={'p-2 font-bold bg-green-500 text-white w-fit h-fit rounded'}>
                            {row.original.etat}
                        </div>
                        :
                        row.original.etat === 'ANNULE'
                            ?
                            <div className={'p-2 font-bold bg-red-500 text-white w-fit h-fit rounded'}>
                                {row.original.etat}
                            </div>
                            :
                            <div className={'p-2 font-bold bg-blue-500 text-white w-fit h-fit rounded'}>
                                {row.original.etat}
                            </div>
                )
            },
            {
                accessorKey: 'action',
                header: 'Action',
                Cell: ({ row }) => (
                    <div className={'flex gap-2 justify-center'}>
                        <Button variant={'contained'} color={'primary'} size={'small'} onClick={() => handleShow(row.original.id)} title="Voir les détails">
                            <Visibility fontSize={'small'}></Visibility>
                        </Button>

                        {row.original.status && (
                            <>
                                <Button variant={'contained'} color={'success'} size={'small'} onClick={() => handleEdit(row.original)} title="Modifier">
                                    <Edit fontSize={'small'}></Edit>
                                </Button>

                                <Button variant={'contained'} color={'warning'} size={'small'} onClick={() => handleCancel(row.original.id)} title="Annuler le mouvement">
                                    <SwapHoriz fontSize={'small'}></SwapHoriz>
                                </Button>

                                <Button variant={'contained'} color={'error'} size={'small'} onClick={() => handleDelete(row.original.id)} title="Supprimer">
                                    <Delete fontSize={'small'}></Delete>
                                </Button>
                            </>
                        )}

                        {!row.original.status && (
                            <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">
                                Mouvement inactif
                            </span>
                        )}
                    </div>
                )

            },
        ],
        [],
    );


    // Filtres avancés
    const [filterOpen, setFilterOpen] = useState(false);
    const [dateRange, setDateRange] = useState([null, null]);
    const [selectedTypeOperation, setSelectedTypeOperation] = useState(null);
    const [selectedDepartement, setSelectedDepartement] = useState(null);
    const [selectedFournisseur, setSelectedFournisseur] = useState(null);
    const [minMontant, setMinMontant] = useState('');
    const [maxMontant, setMaxMontant] = useState('');
    const [etatFilter, setEtatFilter] = useState(null);

    // Les options pour les filtres sont maintenant récupérées du contrôleur

    const etatOptions = [
        { id: 'VALIDE', nom: 'Validé' },
        { id: 'EN_ATTENTE', nom: 'En attente' },
        { id: 'ANNULE', nom: 'Annulé' }
    ];

    // Fonction pour appliquer les filtres
    const applyFilters = () => {
        // Vider les filtres actuels
        setColumnFilters([]);

        // Créer un nouveau tableau de filtres
        let newFilters = [];

        // Ajouter chaque filtre s'il est défini
        if (selectedTypeOperation) {
            newFilters.push({ id: 'type_operation', value: selectedTypeOperation.id });
        }

        if (selectedDepartement) {
            newFilters.push({ id: 'departement', value: selectedDepartement.id });
        }

        if (selectedFournisseur) {
            newFilters.push({ id: 'fournisseur', value: selectedFournisseur.id });
        }

        if (dateRange[0] && dateRange[1]) {
            newFilters.push({
                id: 'date_range',
                value: {
                    start: dayjs(dateRange[0]).format('YYYY-MM-DD'),
                    end: dayjs(dateRange[1]).format('YYYY-MM-DD')
                }
            });
        }

        if (minMontant) {
            newFilters.push({ id: 'min_montant', value: minMontant });
        }

        if (maxMontant) {
            newFilters.push({ id: 'max_montant', value: maxMontant });
        }

        if (etatFilter) {
            newFilters.push({ id: 'etat', value: etatFilter.id });
        }

        // Appliquer les nouveaux filtres
        console.log('Nouveaux filtres appliqués:', newFilters);
        setTimeout(() => {
            setColumnFilters(newFilters);
        }, 0);

        // Le panneau de filtres reste ouvert après l'application des filtres
    };

    // Fonction pour réinitialiser les filtres
    const resetFilters = () => {
        // Réinitialiser tous les états de filtres
        setDateRange([null, null]);
        setSelectedTypeOperation(null);
        setSelectedDepartement(null);
        setSelectedFournisseur(null);
        setMinMontant('');
        setMaxMontant('');
        setEtatFilter(null);

        // Vider les filtres de colonne pour déclencher une requête sans filtres
        console.log('Réinitialisation des filtres');
        setColumnFilters([]);

        // Revenir à la première page
        setPagination(prev => ({
            ...prev,
            pageIndex: 0
        }));
    };

    const table = useMaterialReactTable({
        columns,
        data: operations.data,
        //enableRowSelection: true,
        getRowId: (row) => row.id,
        initialState: { showColumnFilters: false },
        manualFiltering: true,
        manualSorting: true,
        muiToolbarAlertBannerProps: isError
            ? {
                color: 'error',
                children: 'Error loading data',
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

    return (
        <PanelLayout
            auth={auth}
            success={success}
            error={error}
            errors={errors}
            active={'stock'}
            sousActive={'mouvement'}
            breadcrumbs={[
                {
                    text: "Mouvement",
                    href: route("admin.stock.mouvement.index", [auth.user.id]),
                    active: false
                },
                /*{
                    text:"Création",
                    href:route("admin.stock.produit.create",[auth.user.id]),
                    active:true
                }*/
            ]}
        >
            <div className={'grid gap-5 bg-gray-200 p-2 rounded border'}>

                <div className="flex items-center flex-wrap gap-2 bg-black p-2 rounded w-fit">
                    <h1 className="text-2xl font-bold text-white">Liste des mouvements</h1>
                </div>

                <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                        <Button
                            color="primary"
                            onClick={() => setFilterOpen(!filterOpen)}
                            variant="outlined"
                            startIcon={<TuneIcon />}
                        >
                            Filtres avancés
                        </Button>
                    </div>
                    {/* Panneau de filtres avancés */}
                    {filterOpen && (
                        <div className="bg-white p-4 mb-4 rounded shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Filtres avancés</h2>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={() => setFilterOpen(false)}
                                >
                                    <Close fontSize="small" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                {/* Filtre par type d'opération */}
                                <div>
                                    <Autocomplete
                                        value={selectedTypeOperation}
                                        onChange={(e, val) => setSelectedTypeOperation(val)}
                                        options={typeOperations || []}
                                        getOptionLabel={(option) => option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Type d'opération"
                                                fullWidth
                                                size="small"
                                            />
                                        )}
                                    />
                                </div>

                                {/* Filtre par département */}
                                <div>
                                    <Autocomplete
                                        value={selectedDepartement}
                                        onChange={(e, val) => setSelectedDepartement(val)}
                                        options={departements || []}
                                        getOptionLabel={(option) => option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Département"
                                                fullWidth
                                                size="small"
                                            />
                                        )}
                                    />
                                </div>

                                {/* Filtre par fournisseur */}
                                <div>
                                    <Autocomplete
                                        value={selectedFournisseur}
                                        onChange={(e, val) => setSelectedFournisseur(val)}
                                        options={fournisseurs || []}
                                        getOptionLabel={(option) => option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Fournisseur"
                                                fullWidth
                                                size="small"
                                            />
                                        )}
                                    />
                                </div>

                                {/* Filtre par état */}
                                <div>
                                    <Autocomplete
                                        value={etatFilter}
                                        onChange={(e, val) => setEtatFilter(val)}
                                        options={etatOptions}
                                        getOptionLabel={(option) => option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="État"
                                                fullWidth
                                                size="small"
                                            />
                                        )}
                                    />
                                </div>

                                {/* Filtre par plage de dates */}
                                <div className="col-span-1 md:col-span-2">
                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                                        <div className="flex gap-4">
                                            <DatePicker
                                                label="Date de début"
                                                value={dateRange[0]}
                                                onChange={(newValue) => setDateRange([newValue, dateRange[1]])}
                                                slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                            />
                                            <DatePicker
                                                label="Date de fin"
                                                value={dateRange[1]}
                                                onChange={(newValue) => setDateRange([dateRange[0], newValue])}
                                                slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                            />
                                        </div>
                                    </LocalizationProvider>
                                </div>

                                {/* Filtre par montant */}
                                <div>
                                    <TextField
                                        label="Montant minimum"
                                        value={minMontant}
                                        onChange={(e) => setMinMontant(e.target.value)}
                                        type="number"
                                        fullWidth
                                        size="small"
                                    />
                                </div>

                                <div>
                                    <TextField
                                        label="Montant maximum"
                                        value={maxMontant}
                                        onChange={(e) => setMaxMontant(e.target.value)}
                                        type="number"
                                        fullWidth
                                        size="small"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={resetFilters}
                                >
                                    Réinitialiser
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={applyFilters}
                                    startIcon={<FilterList />}
                                >
                                    Appliquer les filtres
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                <div className={'flex justify-between items-center'}>


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
                                        onChange={(e, val) => setData("typeProduit", val)}
                                        disablePortal={true}
                                        options={typeProduits}
                                        getOptionLabel={(option) => option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => <TextField fullWidth {...params} placeholder={"Type de produit"} label={params.nom} />}
                                    />
                                    <InputError message={errors["data.typeProduit"]} />
                                </div>

                                <div
                                    className={"w-full"}
                                >
                                    <Autocomplete
                                        className={"w-full"}
                                        onChange={(e, val) => setData("categorieProduit", val)}
                                        disablePortal={true}
                                        options={categorieProduits}
                                        getOptionLabel={(option) => option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => <TextField fullWidth {...params} placeholder={"Catégorie de produit"} label={params.nom} />}
                                    />
                                    <InputError message={errors["data.categorieProduit"]} />
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
                                        onChange={(e, val) => setData("typeProduit", val)}
                                        disablePortal={true}
                                        options={typeProduits}
                                        getOptionLabel={(option) => option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => <TextField fullWidth {...params} placeholder={"Type de produit"} label={params.nom} />}
                                    />
                                    <InputError message={errors["data.typeProduit"]} />
                                </div>

                                <div
                                    className={"w-full"}
                                >
                                    <Autocomplete
                                        value={data.categorieProduit}
                                        className={"w-full"}
                                        onChange={(e, val) => setData("categorieProduit", val)}
                                        disablePortal={true}
                                        options={categorieProduits}
                                        getOptionLabel={(option) => option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => <TextField fullWidth {...params} placeholder={"Catégorie de produit"} label={params.nom} />}
                                    />
                                    <InputError message={errors["data.categorieProduit"]} />
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
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <h1 className="text-2xl font-bold">Liste des mouvements de stock</h1>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                variant="outlined"
                                                color="info"
                                                startIcon={<Visibility />}
                                                onClick={() => router.get(route('admin.stock.mouvement.dashboard', auth.user.id))}
                                            >
                                                Tableau de bord
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<Add />}
                                                onClick={() => handleClickOpen()}
                                            >
                                                Nouveau mouvement
                                            </Button>
                                        </div>
                                    </div>
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
                                            {data.categorieProduit?.nom}
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* Statistiques des mouvements */}
                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold text-gray-700">Total des mouvements</h3>
                        <p className="text-2xl font-bold mt-2">{operations.total || 0}</p>
                        <p className="text-sm text-gray-500 mt-1">Tous types confondus</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
                        <h3 className="text-lg font-semibold text-gray-700">Entrées de stock</h3>
                        <p className="text-2xl font-bold mt-2">
                            {operations.data?.filter(op => op.type_operation?.nom?.toLowerCase().includes('entrée')).length || 0}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Approvisionnements et ajustements positifs</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
                        <h3 className="text-lg font-semibold text-gray-700">Sorties de stock</h3>
                        <p className="text-2xl font-bold mt-2">
                            {operations.data?.filter(op => op.type_operation?.nom?.toLowerCase().includes('sortie')).length || 0}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Ventes et ajustements négatifs</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500">
                        <h3 className="text-lg font-semibold text-gray-700">Ajustements d'inventaire</h3>
                        <p className="text-2xl font-bold mt-2">
                            {operations.data?.filter(op => op.type_operation?.nom?.toLowerCase().includes('ajustement')).length || 0}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Suite aux inventaires physiques</p>
                    </div>
                </div>

                <div className="overflow-auto space-y-2 bg-white p-2 rounded">
                    <div className={`flex gap-5 flex-wrap justify-end`}>
                        <Button size={'small'} color={'success'} variant={'contained'} onClick={() => handleClickOpen('Entrée')} >
                            <AddCircle className={'mr-1'}></AddCircle> <span className="hidden sm:flex">Entrée</span>
                        </Button>
                        <Button size={'small'} color={'warning'} variant={'contained'} onClick={() => handleClickOpen('Transfert')} >
                            <SwapHoriz className={'mr-1'}></SwapHoriz> <span className="hidden sm:flex">Transfert</span>
                        </Button>
                        <Button size={'small'} color={'error'} variant={'contained'} onClick={() => handleClickOpen('Sortie')} >
                            <Remove className={'mr-1'}></Remove> <span className="hidden sm:flex">Sortie</span>
                        </Button>
                    </div>

                    <MaterialReactTable
                        table={table}
                    />
                </div>

            </div>



        </PanelLayout>
    );
}

export default Index;
