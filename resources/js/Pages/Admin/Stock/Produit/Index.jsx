import React, {useEffect, useState} from 'react';
import PanelLayout from "@/Layouts/PanelLayout.jsx";
import ReferentielLayout from "@/Layouts/ReferentielLayout.jsx";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useMemo } from 'react';

import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'

import { MRT_Localization_FR } from 'material-react-table/locales/fr';
import {router, useForm} from "@inertiajs/react";
import {Alert, AlertTitle, Autocomplete, Button, Snackbar} from "@mui/material";
import {Add, AddCircle, AddOutlined, Check, Close, Delete, Edit, Visibility} from "@mui/icons-material";
import InputError from "@/Components/InputError.jsx";
import { formatNumber } from 'chart.js/helpers';

function Index({auth,errors,produits,typeProduits,categories,error,success}) {
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
        pageIndex:produits.current_page-1,
        pageSize:produits.per_page,
    });

    useEffect(()=>{
        setRowCount(produits.total)
        setProduitsSt(produits.data)
        setIsRefetching(false)
    },[produits])

    useEffect(() => {


        setIsRefetching(true);
        setIsLoading(true);

        axios.post(route('admin.produit.paginationFiltre'),
            {
                'start': pagination.pageIndex * pagination.pageSize,
                "size": pagination.pageSize,
                'filters': columnFilters ?? [],
                'globalFilter': globalFilter ?? '',
                'sorting': sorting ?? []
            })
            .then(response => {
                setProduitsSt(response.data.data);
                setRowCount(response.data.rowCount);

                setIsLoading(false)
                setIsRefetching(false);
            })
            .catch(err => {
                setIsError(true);
                console.error(error);
            })

        setIsError(false);
        setIsLoading(false);
        setIsRefetching(false);

    }, [
        columnFilters,
        globalFilter,
        pagination.pageIndex,
        pagination.pageSize,
        sorting,
    ])


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

        router.get(route("admin.produit.create",auth.user.id),{onSuccess:()=>reset()})

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
        data:produitsSt,
        //enableRowSelection: true,
        getRowId: (row) => row.id,
        initialState: { showColumnFilters: false },
        manualFiltering: true,
        manualPagination: true,
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
            sousActive={'produit'}
            breadcrumbs={[
                {
                    text:"Produit",
                    href:route("admin.produit.index",[auth.user.id]),
                    active:false
                },
                /*{
                    text:"Création",
                    href:route("superAdmin.produit.create",[auth.user.id]),
                    active:true
                }*/
            ]}
        >
            <div className={'grid gap-5 bg-gray-200 p-2 rounded border'}>


                <div className={'flex justify-end'}>
                    <Button color={'warning'} variant={'contained'} onClick={handleClickOpen} >
                        <AddCircle className={'mr-1'}></AddCircle> Ajout produit
                    </Button>

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

                <MaterialReactTable
                    table={table}
                />
            </div>

        </PanelLayout>
    );
}

export default Index;
