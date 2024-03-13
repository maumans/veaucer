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
import {Alert, AlertTitle, Button, Snackbar} from "@mui/material";
import {Add, AddCircle, AddOutlined, Check, Close, Delete, Edit, Visibility} from "@mui/icons-material";
import InputError from "@/Components/InputError.jsx";

function Index({auth,errors,referentiels,affections,error,success}) {
    //PAGINATION

    const [affectionsSt, setAffectionsSt] = useState([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [rowCount, setRowCount] = useState(0);


    //table state
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex:affections.current_page-1,
        pageSize:affections.per_page,
    });

    useEffect(()=>{
        setRowCount(affections.total)
        setAffectionsSt(affections.data)
        setIsRefetching(false)
    },[affections])

    //if you want to avoid useEffect, look at the React Query example instead
    useEffect(() => {

        /*if (!affectionsSt.length) {
            setIsLoading(true);
        } else {
            setIsRefetching(true);
        }*/

        setIsRefetching(true);
        setIsLoading(true);

        axios.post(route('superAdmin.affection.paginationFiltre'),
            {
                'start': pagination.pageIndex * pagination.pageSize,
                "size": pagination.pageSize,
                'filters': columnFilters ?? [],
                'globalFilter': globalFilter ?? '',
                'sorting': sorting ?? []
            })
            .then(response => {
                setAffectionsSt(response.data.data);
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
            'code':'',
            'slug':'',
        }
    )

    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openShow, setOpenShow] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const handleClickOpen = () => {
        reset()
        setOpen(true);
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
        post(route('superAdmin.affection.store'),{
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
            'code': el.code || '',
            'slug': el.slug || '',
        })

        setOpenEdit(true);
    };

    const handleShow = (  el ) => {
        setData({
            'id' : el.id,
            'nom': el.nom || '',
            'code': el.code || '',
            'slug': el.slug || '',
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
        put(route('superAdmin.affection.update',data.id),{
            onSuccess:()=> {
                reset()
                setOpenEdit(false);
            },
        })

    };

    const handleSuspend = () => {
        setOpen(false);
        router.delete(route('superAdmin.affection.destroy',{id:data.id}))
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'nom', //access nested data with dot notation
                header: 'Nom',
                //size: 10,
            },
            {
                accessorKey: 'code', //access nested data with dot notation
                header: 'Code',
                //size: 10,
            },
            {
                accessorKey: 'slug',
                header: 'Slug',
                //size: 50,
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
        data:affectionsSt,
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
        <ReferentielLayout
            success={success}
            error={error}
           auth={auth}
           errors={errors}
           referentiels={referentiels}
           referentiel={'Affections'}
           active={'referentiel'}
           sousActive={'superAdmin.affection.index'}
           breadcrumbs={[
               {
                   text:"Affection",
                   href:route("superAdmin.affection.index",[auth.user.id]),
                   active:false
               },
               /*{
                   text:"Création",
                   href:route("superAdmin.affection.create",[auth.user.id]),
                   active:true
               }*/
           ]}
        >
            <div className={'grid gap-5 bg-gray-200 p-2 rounded border'}>


                <div className={'flex justify-end'}>
                    <Button color={'warning'} variant={'contained'} onClick={handleClickOpen} >
                        <AddCircle className={'mr-1'}></AddCircle> Ajout affection
                    </Button>

                    {
                        ///////ADD DIALOG
                    }
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle className={'bg-orange-600 text-white'}>Ajout de l'affection</DialogTitle>
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
                                <div>
                                    <TextField
                                        value={data.code}
                                        id="code"
                                        name="code"
                                        label="Code"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.code} className="mt-2" />
                                </div>
                                <div>
                                    <TextField
                                        value={data.slug}
                                        id="slug"
                                        name="slug"
                                        label="Slug"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.slug} className="mt-2" />
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
                        <DialogTitle className={'bg-orange-600 text-white'}>Modification de l'affection</DialogTitle>
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
                                <div>
                                    <TextField
                                        value={data.code}
                                        id="code"
                                        name="Code"
                                        label="Code"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.code} className="mt-2" />
                                </div>
                                <div>
                                    <TextField
                                        value={data.slug}
                                        id="slug"
                                        name="slug"
                                        label="Slug"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.slug} className="mt-2" />
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
                        <DialogTitle className={'bg-orange-600 text-white'}>Details de l'affection</DialogTitle>
                        <DialogContent className={'space-y-5'}>
                            {/*<DialogContentText>
                                To subscribe to this website, please enter your email address here. We
                                will send updates occasionally.
                            </DialogContentText>*/}
                            {
                                <div className={'grid grid-cols-1 md:grid-cols-2 gap-5 p-5 mt-5'}>
                                    <div>
                                        <span className={'font-bold'}>CODE:</span> <span>{' '+data.code}</span>
                                    </div>

                                    <div>
                                        <span className={'font-bold'}>NOM:</span> <span>{' '+data.nom}</span>
                                    </div>

                                    {
                                        data.slug !== ''
                                        &&
                                        <div>
                                            <span className={'font-bold'}>SLUG:</span> <span>{' '+data.slug}</span>
                                        </div>
                                    }
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
                        <DialogTitle className={'bg-orange-600 text-white'}>Suppression du affection</DialogTitle>
                        <DialogContent className={'space-y-5'}>
                            <div className={'mt-5'}>
                                {
                                    data.message === 'delete' && 'Voulez-vous vraiment suspendre ce affection'
                                }

                                {
                                    data.message === 'check' && 'Voulez-vous vraiment débloquer ce affection'
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

        </ReferentielLayout>
    );
}

export default Index;
