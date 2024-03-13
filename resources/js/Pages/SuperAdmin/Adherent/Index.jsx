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
import {Alert, AlertTitle, Autocomplete, Button, FormControlLabel, Snackbar, Switch} from "@mui/material";
import {Add, AddCircle, AddOutlined, Check, Close, Delete, Edit, Visibility} from "@mui/icons-material";
import InputError from "@/Components/InputError.jsx";
import {format, parseISO} from "date-fns";
import {DesktopDatePicker} from "@mui/x-date-pickers";

function Index({auth,errors,referentiels,adherents,souscripteurs,contrats,liens,error,success}) {
    //PAGINATION

    const [adherentsSt, setAdherentsSt] = useState([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [rowCount, setRowCount] = useState(0);


    //table state
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex:adherents.current_page-1,
        pageSize:adherents.per_page,
    });

    useEffect(()=>{
        setRowCount(adherents.total)
        setAdherentsSt(adherents.data)
        setIsRefetching(false)
    },[adherents])

    //if you want to avoid useEffect, look at the React Query example instead
    useEffect(() => {

        /*if (!adherentsSt.length) {
            setIsLoading(true);
        } else {
            setIsRefetching(true);
        }*/

        setIsRefetching(true);
        setIsLoading(true);

        axios.post(route('superAdmin.adherent.paginationFiltre'),
            {
                'start': pagination.pageIndex * pagination.pageSize,
                "size": pagination.pageSize,
                'filters': columnFilters ?? [],
                'globalFilter': globalFilter ?? '',
                'sorting': sorting ?? []
            })
            .then(response => {
                setAdherentsSt(response.data.data);
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
            'lieuNaissance':'',
            "dateNaissance":format(new Date(Date.now()),"yyyy/MM/dd"),
            "dateAdhesion":format(new Date(Date.now()),"yyyy/MM/dd"),
            'validiteSpecifique':false,
            'nombreJours':'',
            'slug':'',
            'souscripteur':null,
            'contrat':null,
            'lien':null,
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
        post(route('superAdmin.adherent.store'),{
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
            'code':el.code || '',
            "lieuNaissance":el.lieuNaissance || '',
            "dateNaissance":el.dateNaissance || '',
            "dateAdhesion":el.dateAdhesion || '',
            'validiteSpecifique': !!el.validiteSpecifique || false,
            'nombreJours':el.nombreJours || '',
            'slug': el.slug || '',
            'souscripteur':el.souscripteur || null,
            'contrat':el.contrat || null,
            'lien':el.lien || null,
        })

        setOpenEdit(true);
    };

    const handleShow = (  el ) => {
        setData({
            'id' : el.id,
            'nom': el.nom || '',
            'code':el.code || '',
            'validiteSpecifique': !!el.validiteSpecifique || false,
            'nombreJours':el.nombreJours || '',
            'slug': el.slug || '',
            'souscripteur':el.souscripteur || null,
            'contrat':el.contrat || null,
            'lien':el.lien || null,
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
        put(route('superAdmin.adherent.update',data.id),{
            onSuccess:()=> {
                reset()
                setOpenEdit(false);
            },
        })

    };

    const handleSuspend = () => {
        setOpen(false);
        router.delete(route('superAdmin.adherent.destroy',{id:data.id}))
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'prenom', //access nested data with dot notation
                header: 'Prenom',
                //size: 10,
            },
            {
                accessorKey: 'carte', //access nested data with dot notation
                header: 'N° carte',
                //size: 10,
            },

            {
                accessorKey: 'code',
                header: 'Code',
                //size: 50,
            },
            {
                accessorKey: 'souscripteur',
                header: 'Souscripteur',
                //size: 50,
                Cell: ({ row }) =>(
                    row.original.souscripteur?.libelle
                )
            },
            {
                accessorKey: 'lien',
                header: 'Lien',
                //size: 50,
                Cell: ({ row }) =>(
                    row.original.lien?.nom
                )
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
        data:adherentsSt,
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
           referentiel={'Adherents'}
           active={'referentiel'}
           sousActive={'superAdmin.adherent.index'}
           breadcrumbs={[
               {
                   text:"Adhérent",
                   href:route("superAdmin.adherent.index",[auth.user.id]),
                   active:false
               },
               /*{
                   text:"Création",
                   href:route("superAdmin.adherent.create",[auth.user.id]),
                   active:true
               }*/
           ]}
        >
            <div className={'grid gap-5 bg-gray-200 p-2 rounded border'}>


                <div className={'flex justify-end'}>
                    <Button color={'warning'} variant={'contained'} onClick={handleClickOpen} >
                        <AddCircle className={'mr-1'}></AddCircle> Ajout adherent
                    </Button>

                    {
                        ///////ADD DIALOG
                    }
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle className={'bg-orange-600 text-white'}>Ajout de l'adherent</DialogTitle>
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
                                        id="prenom"
                                        name="prenom"
                                        label="Prenom"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.prenom} className="mt-2" />
                                </div>
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
                                        value={data.nom}
                                        autoFocus
                                        id="sexe"
                                        name="sexe"
                                        label="Sexe"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.sexe} className="mt-2" />
                                </div>
                                <div>
                                    <TextField
                                        value={data.carte}
                                        id="carte"
                                        name="carte"
                                        label="Carte"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.carte} className="mt-2" />
                                </div>

                                <div>
                                    <DesktopDatePicker
                                        className={"w-full"}
                                        value={data.dateNaissance}
                                        label="Date de naissance"
                                        slots={{
                                            textField: textFieldProps => <TextField {...textFieldProps} />
                                        }}
                                        onChange={(date)=>setData('dateNaissance',date)}
                                        required
                                    />
                                    <InputError message={errors.dateNaissance} className="mt-2" />
                                </div>

                                <div>
                                    <TextField
                                        value={data.lieuNaissance}
                                        id="lieuNaissance"
                                        name="lieuNaissance"
                                        label="Lieu de naissance"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.lieuNaissance} className="mt-2" />
                                </div>

                                <div>
                                    <DesktopDatePicker
                                        className={"w-full"}
                                        value={data.dateAdhesion}
                                        label="Date d'adhésion"
                                        slots={{
                                            textField: textFieldProps => <TextField {...textFieldProps} />
                                        }}                                        onChange={(date)=>setData('dateAdhesion',date)}
                                        required
                                    />
                                    <InputError message={errors.dateAdhesion} className="mt-2" />
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

                                <div
                                    className={"w-full"}
                                >
                                    <Autocomplete
                                        value={data.souscripteur}
                                        className={"w-full"}
                                        onChange={(e,val)=>setData("souscripteur",val)}
                                        disablePortal={true}
                                        options={souscripteurs}
                                        getOptionLabel={(option)=>option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Garantie"} label={params.nom}/>}
                                    />
                                    <InputError message={errors["data.souscripteur"]}/>
                                </div>

                                <div
                                    className={"w-full"}
                                >
                                    <Autocomplete
                                        value={data.lien}
                                        className={"w-full"}
                                        onChange={(e,val)=>setData("lien",val)}
                                        disablePortal={true}
                                        options={liens}
                                        getOptionLabel={(option)=>option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"lien"} label={params.nom}/>}
                                    />
                                    <InputError message={errors["data.lien"]}/>
                                </div>

                                <div
                                    className={"w-full"}
                                >
                                    <Autocomplete
                                        value={data.contrat}
                                        className={"w-full"}
                                        onChange={(e,val)=>setData("contrat",val)}
                                        disablePortal={true}
                                        options={contrats}
                                        getOptionLabel={(option)=>option.mouvement}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Contrat"} label={params.mouvement}/>}
                                    />
                                    <InputError message={errors["data.contrat"]}/>
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
                        <DialogTitle className={'bg-orange-600 text-white'}>Modification de l'adherent</DialogTitle>
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
                                        id="prenom"
                                        name="prenom"
                                        label="Prenom"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.prenom} className="mt-2" />
                                </div>
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
                                        value={data.nom}
                                        autoFocus
                                        id="sexe"
                                        name="sexe"
                                        label="Sexe"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.sexe} className="mt-2" />
                                </div>
                                <div>
                                    <TextField
                                        value={data.carte}
                                        id="carte"
                                        name="carte"
                                        label="Carte"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.carte} className="mt-2" />
                                </div>

                                <div>
                                    <DesktopDatePicker
                                        className={"w-full"}
                                        value={data.dateNaissance}
                                        label="Date de naissance"
                                        renderInput={(params) => <TextField {...params} />}
                                        onChange={(date)=>setData('dateNaissance',date)}
                                        required
                                    />
                                    <InputError message={errors.dateNaissance} className="mt-2" />
                                </div>

                                <div>
                                    <TextField
                                        value={data.lieuNaissance}
                                        id="lieuNaissance"
                                        name="lieuNaissance"
                                        label="Lieu de naissance"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.lieuNaissance} className="mt-2" />
                                </div>

                                <div>
                                    <DesktopDatePicker
                                        className={"w-full"}
                                        value={data.dateAdhesion}
                                        label="Date d'incorporation souhaitée"
                                        renderInput={(params) => <TextField {...params} />}
                                        onChange={(date)=>setData('dateAdhesion',date)}
                                        required
                                    />
                                    <InputError message={errors.dateAdhesion} className="mt-2" />
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

                                <div
                                    className={"w-full"}
                                >
                                    <Autocomplete
                                        value={data.souscripteur}
                                        className={"w-full"}
                                        onChange={(e,val)=>setData("souscripteur",val)}
                                        disablePortal={true}
                                        options={souscripteurs}
                                        getOptionLabel={(option)=>option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Garantie"} label={params.nom}/>}
                                    />
                                    <InputError message={errors["data.souscripteur"]}/>
                                </div>

                                <div
                                    className={"w-full"}
                                >
                                    <Autocomplete
                                        value={data.lien}
                                        className={"w-full"}
                                        onChange={(e,val)=>setData("lien",val)}
                                        disablePortal={true}
                                        options={liens}
                                        getOptionLabel={(option)=>option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"lien"} label={params.nom}/>}
                                    />
                                    <InputError message={errors["data.lien"]}/>
                                </div>

                                <div
                                    className={"w-full"}
                                >
                                    <Autocomplete
                                        value={data.contrat}
                                        className={"w-full"}
                                        onChange={(e,val)=>setData("contrat",val)}
                                        disablePortal={true}
                                        options={contrats}
                                        getOptionLabel={(option)=>option.mouvement}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Contrat"} label={params.mouvement}/>}
                                    />
                                    <InputError message={errors["data.contrat"]}/>
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
                        <DialogTitle className={'bg-orange-600 text-white'}>Details de l'adherent</DialogTitle>
                        <DialogContent className={'space-y-5'}>
                            {
                                /*<DialogContentText>
                                To subscribe to this website, please enter your email address here. We
                                will send updates occasionally.
                                </DialogContentText>*/
                            }

                            {
                                <div className={'grid grid-cols-2 mt-5 divide-y divide-x border w-96 min-w-fi'}>
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
                                            CODE
                                        </div>
                                        <div className={'py-2 px-2'}>
                                            {data.code}
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
                                            GARANTIE
                                        </div>
                                        <div className={'py-2 px-2'}>
                                            {data.souscripteur?.nom}
                                        </div>
                                    </>

                                    {
                                        data.nombreJours
                                        &&
                                        <>
                                            <div className={'font-bold py-2 px-2'}>
                                                NOMBRE DE JOURS
                                            </div>
                                            <div className={'py-2 px-2'}>
                                                {data.nombreJours}
                                            </div>
                                        </>
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
                        <DialogTitle className={'bg-orange-600 text-white'}>Suppression du adherent</DialogTitle>
                        <DialogContent className={'space-y-5'}>
                            <div className={'mt-5'}>
                                {
                                    data.message === 'delete' && 'Voulez-vous vraiment suspendre cet adherent'
                                }

                                {
                                    data.message === 'check' && 'Voulez-vous vraiment débloquer cet adherent'
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
