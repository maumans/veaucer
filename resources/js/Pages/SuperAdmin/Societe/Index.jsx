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
import {Alert, AlertTitle, Autocomplete, Button, Snackbar, TextareaAutosize} from "@mui/material";
import {Add, AddCircle, AddOutlined, Check, Close, Delete, Edit, Visibility} from "@mui/icons-material";
import InputError from "@/Components/InputError.jsx";

function Index({auth,errors,referentiels,societes,typeSocietes,error,success}) {
    //PAGINATION

    const [societesSt, setSocietesSt] = useState([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [rowCount, setRowCount] = useState(0);


    //table state
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex:societes.current_page-1,
        pageSize:societes.per_page,
    });

    useEffect(()=>{
        setRowCount(societes.total)
        setSocietesSt(societes.data)
        setIsRefetching(false)
    },[societes])

    //if you want to avoid useEffect, look at the React Query example instead
    useEffect(() => {

        /*if (!societesSt.length) {
            setIsLoading(true);
        } else {
            setIsRefetching(true);
        }*/

        setIsRefetching(true);
        setIsLoading(true);

        console.log(columnFilters,globalFilter)

        axios.post(route('superAdmin.societe.paginationFiltre'),
            {
                'start': pagination.pageIndex * pagination.pageSize,
                "size": pagination.pageSize,
                'filters': columnFilters ?? [],
                'globalFilter': globalFilter ?? '',
                'sorting': sorting ?? []
            })
            .then(response => {
                setSocietesSt(response.data.data);
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
            'telephone1':'',
            'telephone2':'',
            'adresseMail':'',
            'description':'',
            'logo':'',
            'typeSociete':null,
        }
    )

    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openShow, setOpenShow] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const handleClickOpen = () => {

        router.get(route("superAdmin.societe.create",auth.user.id),{onSuccess:()=>reset()})
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
        post(route('superAdmin.societe.store',{userId:auth.user.id}),{
            onSuccess:()=> {
                reset()
                setOpen(false);
            },
        })
    };

    const handleEdit = (  el ) => {
        setData({
            'id' : el.id,
            'nom': el.nom || '',
            'adresse':el.adresse || '',
            'telephone1':el.telephone1 || '',
            'telephone2':el.telephone2 || '',
            'adresseMail':el.adresseMail || '',
            'description':el.description || '',
            'logo':el.logo || '',
            'slug': el.slug || '',
            'typeSociete':el.type_societe || null,
        })

        setOpenEdit(true);
    };

    const handleShow = (  el ) => {
        setData({
            'id' : el.id,
            'nom': el.nom || '',
            'telephone1':el.telephone1 || '',
            'telephone2':el.telephone2 || '',
            'adresseMail':el.adresseMail || '',
            'description':el.description || '',
            'logo':el.logo || '',
            'slug': el.slug || '',
            'typeSociete':el.type_societe || null,
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
        put(route('superAdmin.societe.update',{userId:auth.user.id,id:data.id}),{
            onSuccess:()=> {
                reset()
                setOpenEdit(false);
            },
        })

    };

    const handleSuspend = () => {
        router.delete(route('superAdmin.societe.destroy',{userId:auth.user.id,id:data.id}),{onSuccess:()=>setOpenDelete(false)})
    };

    const societesActions = [
        {
            permission: 'show-societes',
            condition: (row) => true, // toujours afficher
            title: 'Détails',
            color: 'secondary',
            icon: <Visibility />,
            onClick: (row) => handleShow(row.original.slug),
        },
        {
            permission: 'edit-societes',
            condition: (row) => true, // toujours afficher si l'édition est autorisée
            title: 'Modifier',
            color: 'info',
            icon: <Edit />,
            onClick: (row) => handleEdit(row.original.slug),
        },
        {
            permission: 'delete-societes',
            condition: (row) => true, // afficher si 'delete-societes' est permis
            title: (row) => row.original.status ? 'Suspendre' : 'Activer',
            color: (row) => row.original.status ? 'error' : 'success',
            icon: (row) => row.original.status ? <Delete /> : <Check />,
            onClick: (row) => handleDelete(row.original.slug, row.original.status ? 'delete' : 'check'),
        }
    ];

    const columns = useMemo(
        () => [
            {
                accessorKey: 'nom', //access nested data with dot notation
                header: 'Nom',
                //size: 10,
            },
            {
                accessorKey: 'typeSociete',
                header: 'Type societe',
                //size: 50,
                Cell: ({ row }) =>(
                    row.original.type_societe?.nom
                )
            },
            {
                accessorKey: 'adresse', //access nested data with dot notation
                header: 'Adresse',
                //size: 10,
            },
            {
                accessorKey: 'description', //access nested data with dot notation
                header: 'Description',
                //size: 10,
            },
            {
                accessorKey: 'logo', //access nested data with dot notation
                header: 'Logo',
                //size: 10,
            },
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
                enableColumnFilter: false,
                Cell: ({ row }) => (
                    <div className={'flex gap-2'} key={row.original.id}>
                        {societesActions.map(action =>
                                auth?.permissions?.includes(action.permission) && action.condition(row) && (
                                    <Button
                                        key={action.permission}
                                        title={typeof action.title === 'function' ? action.title(row) : action.title}
                                        onClick={() => action.onClick(row)}
                                        variant={'outlined'}
                                        size={'small'}
                                        color={typeof action.color === 'function' ? action.color(row) : action.color}
                                    >
                                        {typeof action.icon === 'function' ? action.icon(row) : action.icon}
                                    </Button>
                                )
                        )}
                    </div>
                )
            }
        ],
        [],
    );


    const table = useMaterialReactTable({
        columns,
        data:societesSt,
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
            active={'societe'}
        >
            <div className={'grid gap-5 bg-gray-200 p-2 rounded border'}>


                <div className={'flex justify-end'}>
                    {
                        auth?.permissions?.some(permission=>permission==='create-societes') ?
                            <Button color={'warning'} variant={'contained'} onClick={handleClickOpen} >
                                <AddCircle className={'mr-1'}></AddCircle> Ajout société
                            </Button>
                            :
                            ""
                    }


                    {
                        ///////ADD DIALOG
                    }
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle className={'bg-orange-600 text-white'}>Ajout de la société</DialogTitle>
                        <DialogContent>
                            {/*<DialogContentText>
                                To subscribe to this website, please enter your email address here. We
                                will send updates occasionally.
                            </DialogContentText>*/}
                            <div className={'grid sm:grid-cols-2 grid-cols-1 bg-gray-50 gap-5 p-2 m-2 rounded overflow-hidden z-50'}>
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
                                        onChange={(e,val)=>setData("typeSociete",val)}
                                        disablePortal={true}
                                        options={typeSocietes}
                                        getOptionLabel={(option)=>option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Type de societe"} label={params.nom}/>}
                                    />
                                    <InputError message={errors["data.typeSociete"]}/>
                                </div>

                                <div>
                                    <TextField
                                        value={data.adresse}
                                        id="adresse"
                                        name="adresse"
                                        label="Adresse"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.adresse} className="mt-2" />
                                </div>

                                <div>
                                    <TextField
                                        value={data.telephone1}
                                        id="telephone1"
                                        name="telephone1"
                                        label="Tel"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.telephone1} className="mt-2" />
                                </div>

                                <div>
                                    <TextField
                                        value={data.telephone2}
                                        id="telephone2"
                                        name="telephone2"
                                        label="Tel 2"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.telephone2} className="mt-2" />
                                </div>

                                <div>
                                    <TextField
                                        value={data.adresseMail}
                                        type="mail"
                                        id="adresseMail"
                                        name="adresseMail"
                                        label="Adresse mail"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.adresseMail} className="mt-2" />
                                </div>

                                <div className={"md:col-span-2 mt-8"}>
                                    <TextareaAutosize className={"w-full"} name={"description"} placeholder={"Description"} style={{height:100}} onChange={handleChange} autoComplete="description"/>
                                    <InputError message={errors["data.description"]}/>
                                </div>

                                <div>
                                    <TextField
                                        value={data.logo}
                                        id="logo"
                                        name="logo"
                                        label="logo"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.logo} className="mt-2" />
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
                        <DialogTitle className={'bg-orange-600 text-white'}>Modification de la société</DialogTitle>
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
                                        value={data.typeSociete}
                                        className={"w-full"}
                                        onChange={(e,val)=>setData("typeSociete",val)}
                                        disablePortal={true}
                                        options={typeSocietes}
                                        getOptionLabel={(option)=>option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Type de societe"} label={params.nom}/>}
                                    />
                                    <InputError message={errors["data.typeSociete"]}/>
                                </div>

                                <div>
                                    <TextField
                                        value={data.adresse}
                                        id="adresse"
                                        name="adresse"
                                        label="Adresse"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.adresse} className="mt-2" />
                                </div>

                                <div>
                                    <TextField
                                        value={data.telephone1}
                                        id="telephone1"
                                        name="telephone1"
                                        label="Tel"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.telephone1} className="mt-2" />
                                </div>

                                <div>
                                    <TextField
                                        value={data.telephone2}
                                        id="telephone2"
                                        name="telephone2"
                                        label="Tel 2"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.telephone2} className="mt-2" />
                                </div>

                                <div>
                                    <TextField
                                        value={data.adresseMail}
                                        type="mail"
                                        id="adresseMail"
                                        name="adresseMail"
                                        label="Adresse mail"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.adresseMail} className="mt-2" />
                                </div>

                                <div className={"col-span-2 mt-8"}>
                                    <TextareaAutosize value={data.description} className={"w-full"} name={"description"} placeholder={"Description"} style={{height:100}} onChange={handleChange} autoComplete="description"/>
                                    <InputError message={errors["data.description"]}/>
                                </div>

                                <div>
                                    <TextField
                                        value={data.logo}
                                        id="logo"
                                        name="logo"
                                        label="logo"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.logo} className="mt-2" />
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
                        <DialogTitle className={'bg-orange-600 text-white'}>Details du societe</DialogTitle>
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
                                            SLUG
                                        </div>
                                        <div className={'py-2 px-2'}>
                                            {data.slug}
                                        </div>
                                    </>

                                    <>
                                        <div className={'font-bold py-2 px-2'}>
                                            TYPE
                                        </div>
                                        <div className={'py-2 px-2'}>
                                            {data.typeSociete?.nom}
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
                        <DialogTitle className={'bg-orange-600 text-white'}>Suppression du societe</DialogTitle>
                        <DialogContent className={'space-y-5'}>
                            <div className={'mt-5'}>
                                {
                                    data.message === 'delete' && 'Voulez-vous vraiment suspendre cette societe'
                                }

                                {
                                    data.message === 'check' && 'Voulez-vous vraiment débloquer cette societe'
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
