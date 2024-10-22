import React, {useEffect, useMemo, useState} from 'react';
import {Link, router, useForm} from "@inertiajs/react";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import { MRT_Localization_FR } from 'material-react-table/locales/fr';
import {
    Add,
    AddCircle,
    Check,
    Close,
    Delete,
    Edit,
    FileDownload,
    Lock,
    PictureAsPdf,
    Visibility
} from "@mui/icons-material";
import {
    Box,
    Button, Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Drawer, InputAdornment, Menu, MenuItem,
    Popover,
    TextField,
    Tooltip
} from "@mui/material";
import InputError from "@/Components/InputError.jsx";
import SnackBar from "@/Components/SnackBar.jsx";
import PanelLayout from "@/Layouts/PanelLayout.jsx";

function Index({auth,users,roles,error,errors,success,total,actif,inactif}) {

    //PAGINATION

    const [usersSt, setUsersSt] = useState([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [rowCount, setRowCount] = useState(0);

    const [anchorEl, setAnchorEl] = useState(null);
    const visibleExport = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseExport = () => {
        setAnchorEl(null);
    };

    //table state
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex:users.current_page-1,
        pageSize:users.per_page,
    });

    const {data,setData,post, put, reset} = useForm(
        {
            'id':'',
            'slug':'',
            'nom':'',
            'prenom':'',
            'email':"",
            'password':"",
            'roles':[],
            'filters': columnFilters ?? [],
        }
    )

    useEffect(()=>{
        setRowCount(users.total)
        setUsersSt(users.data)
        setIsRefetching(false)
    },[users])

    useEffect(() => {

        setIsRefetching(true);
        setIsLoading(true);

        axios.post(route('user.paginationFiltre'),
            {
                'start': pagination.pageIndex * pagination.pageSize,
                "size": pagination.pageSize,
                'filters': columnFilters ?? [],
                'globalFilter': globalFilter ?? '',
                'sorting': sorting ?? []
            })
            .then(response => {
                setUsersSt(response.data.data);
                setRowCount(response.data.rowCount);

                setIsLoading(false)
                setIsRefetching(false);
            })
            .catch(err => {
                setIsError(true);
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


    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openShow, setOpenShow] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const handleClickOpen = () => {

        //router.get(route("user.create",auth.user.id),{onSuccess:()=>reset()})

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
        setIsRefetching(true);
        setIsLoading(true);
        post(route('user.store'),{
            onSuccess:()=> {
                reset()
                setOpen(false);
                setIsRefetching(false);
                setIsLoading(false);
            },
        })
    };

    const handleEdit = (  el ) => {
        //router.get(route("user.edit",[auth.user.id,el.id]),{preserveScroll:true})

        setData({
            'id' : el.id,
            'slug' : el.slug,
            'prenom': el.prenom || '',
            'nom': el.nom || '',
            'email': el.email || '',
            'roles': el.roles || [],
        })

        setOpenEdit(true);
    };

    const handleShow = (  el ) => {
        //router.get(route("user.show",[el.slug]),{preserveScroll:true})

        setData({
            'id' : el.id,
            'slug' : el.slug,
            'prenom': el.prenom || '',
            'nom': el.nom || '',
            'email': el.email || '',
            'roles': el.roles || [],
        })

        setOpenShow(true);
    };

    const handleDelete = (slug,message) => {
        setData({
            'slug' : slug,
            message : message
        })

        setOpenDelete(true);
    };

    const handleUpdate = () => {
        put(route('user.update',data.slug),{
            onSuccess:()=> {
                reset()
                setOpenEdit(false);
            },
        })

    };

    const handleSuspend = () => {
        setIsRefetching(true);
        setIsLoading(true);
        setOpenDelete(false);
        router.delete(route('user.destroy',{slug:data.slug}),
            {preserveScroll:true,onSuccess:()=>{
                    setIsRefetching(false);
                    setIsLoading(false);
                }
            })

    };

    const userActions = [
        {
            permission: 'show-users',
            condition: (row) => true, // toujours afficher
            title: 'Détails',
            color: 'secondary',
            icon: <Visibility />,
            onClick: (row) => handleShow(row.original),
        },
        {
            permission: 'edit-users',
            condition: (row) => true, // toujours afficher
            title: 'Modifier',
            color: 'info',
            icon: <Edit />,
            onClick: (row) => handleEdit(row.original),
        },
        {
            permission: 'delete-users',
            condition: (row) => row.original.status, // Afficher "Suspendre" si l'utilisateur est actif
            title: 'Suspendre',
            color: 'error',
            icon: <Delete />,
            onClick: (row) => handleDelete(row.original.slug, 'delete'),
        },
        {
            permission: 'delete-users',
            condition: (row) => !row.original.status, // Afficher "Activer" si l'utilisateur est suspendu
            title: 'Activer',
            color: 'success',
            icon: <Check />,
            onClick: (row) => handleDelete(row.original.slug, 'check'),
        }
    ];


    const columns = useMemo(
        () => [
            {
                accessorKey: 'prenom', //access nested data with dot notation
                header: 'Prénom',
            },
            {
                accessorKey: 'nom',
                header: 'Nom',
            },
            {
                accessorKey: 'login',
                header: 'Login',
            },
            {
                accessorKey: 'email', //normal accessorKey
                header: 'Email',
            },
            {
                accessorKey: 'action',
                header: 'Action',
                enableColumnFilter: false,
                Cell: ({ row }) => (
                    <div className="flex gap-2" key={row.original.id}>
                        {userActions.map(action =>
                                auth?.permissions?.includes(action.permission) &&
                                action.condition(row) && (
                                    <Button
                                        key={action.permission}
                                        title={action.title}
                                        onClick={() => action.onClick(row)}
                                        variant="outlined"
                                        size="small"
                                        color={action.color}
                                    >
                                        {action.icon}
                                    </Button>
                                )
                        )}
                    </div>
                ),
            }
        ],
        [],
    );

    const handleExportRows = (rows) => {
        /*const doc = new jsPDF();
        const tableData = rows.map((row) => Object.values(row.original));
        const tableHeaders = columns.map((c) => c.header);

        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
        });

        doc.save('users.pdf');*/
    };


    const table = useMaterialReactTable({
        columns,
        data:usersSt,
        //enableRowSelection: true,
        getRowId: (row) => row.id,
        initialState: { showColumnFilters: false },
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
        muiToolbarAlertBannerProps: isError
            ? {
                color: 'error',
                children: 'Erreur de chargement des données',
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
        localization: MRT_Localization_FR,
        renderTopToolbarCustomActions:  ({ table }) => (
            <div className={"flex"}>
                <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    size="small"
                    color={"error"}
                    onClick={handleClick}
                    startIcon={<PictureAsPdf color={'error'} />}
                >
                    Export
                </Button>

                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={visibleExport}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={()=>{
                        handleExportRows(table.getPrePaginationRowModel().rows)
                        handleCloseExport()
                    }} disabled={table.getPrePaginationRowModel().rows.length === 0}>
                        Toutes les lignes
                    </MenuItem>

                    <MenuItem onClick={()=>{
                        handleExportRows(table.getRowModel().rows)
                        handleCloseExport()
                    }} disabled={table.getRowModel().rows.length === 0}>
                        Lignes de la page
                    </MenuItem>

                    <MenuItem onClick={()=>{
                        handleExportRows(table.getSelectedRowModel().rows)
                        handleCloseExport()
                    }}
                    disabled={
                        !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                    }>
                        Lignes selectionnées
                    </MenuItem>
                </Menu>

            </div>
        )
    });


    const handleChangeCheckbox = (e) => {
        setData("roles",[
            ...data.roles.filter((p)=>p.id !== e.target.name),
            {
                id:e.target.name,
                status:e.target.checked
            }
        ])
    };

    return (
        <PanelLayout
            auth={auth}
            success={success}
            error={error}
            active={'user'}
        >

            <div className={"grid gap-2 w-full mb-20"}>
                <div className={'flex gap-2'}>
                    <div className={"w-full flex lg:hidden primaryBgColor p-1 font-bold text-white rounded"}>
                        Gestion des users
                    </div>
                </div>
                <div className={"grid grid-cols-3 gap-4 w-full"}>
                    <div className={"primaryBgColor text-white p-2 rounded"}>
                        <div className={'text-3xl font-bold'}>
                            {
                                total
                            }
                        </div>
                        <div>Utilisateurs</div>

                    </div>

                    <div className={"secondaryBgColor text-white p-2 rounded"}>
                        <div className={'text-3xl font-bold'}>
                            {
                                actif
                            }
                        </div>
                        <div>Actifs</div>

                    </div>
                    <div className={"bg-red-500 text-white p-2 rounded"}>
                        <div className={'text-3xl font-bold'}>
                            {
                                inactif
                            }
                        </div>
                        <div>Inactifs</div>

                    </div>
                </div>
                <div className={'flex justify-end gap-2'}>
                    <Button variant={"contained"} color={'error'} size={"small"}>
                        <PictureAsPdf size={5} className={"text-white"}/>
                    </Button>
                    {

                        auth?.permissions?.map(permission =>(
                        (permission==='create-users') ?
                            <Button key={permission} onClick={handleClickOpen} variant={"contained"} color={'secondary'} size={"small"}>
                                <AddCircle className={"text-white"}/> <div className={"text-white"}>User</div>
                            </Button>
                            :
                            ""
                        ))
                    }

                </div>

                <div className={"w-full overflow-hidden"}>
                    <MaterialReactTable table={table} />
                </div>

                {
                    ///////ADD DIALOG
                }
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle className={'primaryBgColor text-white'}>Ajout d'un user</DialogTitle>
                    <DialogContent className={'space-y-5'}>
                        <div className={'grid sm:grid-cols-2 grid-cols-1 bg-gray-50 gap-5 p-2 m-2 rounded'}>
                            <div>
                                <TextField
                                    value={data.prenom}
                                    autoFocus
                                    id="prenom"
                                    name="prenom"
                                    label="Prénom"
                                    className={'bg-white'}
                                    fullWidth
                                    onChange={handleChange}
                                />
                                <InputError message={errors.prenom} className="mt-2" />
                            </div>
                            <div>
                                <TextField
                                    value={data.nom}
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
                                    value={data.email}
                                    id="email"
                                    name="email"
                                    label="Email"
                                    type="email"
                                    className={'bg-white'}
                                    fullWidth
                                    onChange={handleChange}
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <TextField
                                    id="password"
                                    type="password"
                                    name="password"
                                    label="Password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <div className={"text-white mt-2 text-sm"}>
                                    {errors.password}
                                </div>
                            </div>

                        </div>
                        <div className={"bg-white mt-10 w-full"}>
                            <div className={"flex p-2 rounded font-bold text-xl"}>
                                Sélectionnez les roles
                            </div>
                            <div className={"flex gap-10 flex-wrap p-2 rounded"}>
                                {
                                    roles.map((role,index) =>(
                                        <div className={'grip gap-5'} key={index}>
                                            <div className={"capitalize font-bold primaryColor"}>
                                                <Checkbox onClick={handleChangeCheckbox} name={role.id+''}/>
                                                {
                                                    role.libelle
                                                }
                                            </div>
                                            <div className={'flex flex-wrap gap-2'}>
                                                {
                                                    role.permissions?.map((permission,index) =>(
                                                        <span key={index} className={"rounded border px-1"}>
                                                                    {permission.libelle}
                                                                </span>
                                                    ))
                                                }
                                            </div>

                                        </div>
                                    ))
                                }
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
                    <DialogTitle className={'primaryBgColor text-white'}>Modification du user</DialogTitle>
                    <DialogContent className={'space-y-5'}>
                        <div className={'grid sm:grid-cols-2 grid-cols-1 bg-gray-50 gap-5 p-2 m-2 rounded'}>
                            <div>
                                <TextField
                                    value={data.prenom}
                                    autoFocus
                                    id="prenom"
                                    name="prenom"
                                    label="Prénom"
                                    className={'bg-white'}
                                    fullWidth
                                    onChange={handleChange}
                                />
                                <InputError message={errors.prenom} className="mt-2" />
                            </div>
                            <div>
                                <TextField
                                    value={data.nom}
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
                                    value={data.email}
                                    id="email"
                                    name="email"
                                    label="Email"
                                    type="email"
                                    className={'bg-white'}
                                    fullWidth
                                    onChange={handleChange}
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>
                        </div>

                        <div className={"bg-white mt-10 w-full"}>
                            <div className={"flex p-2 rounded font-bold text-xl"}>
                                Sélectionnez les roles
                            </div>
                            <div className={"flex gap-10 flex-wrap p-2 rounded"}>
                                {
                                    roles?.map((role,index) =>(
                                        <div className={'grip gap-5'} key={index}>
                                            <div className={"capitalize font-bold primaryColor"}>
                                                <Checkbox defaultChecked={!!data.roles.find((r)=>(role.id===r.id))} onClick={handleChangeCheckbox} name={role.id+''}/>
                                                {
                                                    role.libelle
                                                }
                                            </div>
                                            <div className={'flex flex-wrap gap-2'}>
                                                {
                                                    role.permissions?.map((permission,index) =>(
                                                        <span key={index} className={"rounded border px-1"}>
                                                                    {permission.libelle}
                                                                </span>
                                                    ))
                                                }
                                            </div>

                                        </div>
                                    ))
                                }
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
                    <DialogTitle className={'primaryBgColor text-white'}>Details du user</DialogTitle>
                    <DialogContent className={'space-y-5'}>
                        {/*<DialogContentText>
                                To subscribe to this website, please enter your email address here. We
                                will send updates occasionally.
                            </DialogContentText>*/}

                            <div className={'grid grid-cols-2 mt-5 min-w-fit'}>
                                <>
                                    <div className={'font-bold py-2 px-2'}>
                                        PRENOM
                                    </div>
                                    <div className={'py-2 px-2'}>
                                        {data.prenom}
                                    </div>
                                </>

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
                                        EMAIL
                                    </div>
                                    <div className={'py-2 px-2'}>
                                        {data.email}
                                    </div>
                                </>
                            </div>

                        {
                            data.roles?.length>0
                            &&
                            <div className={"bg-white mt-10 w-full"}>
                                <div className={"flex p-2 rounded font-bold text-xl"}>
                                    Roles de l'utilisateur
                                </div>
                                <div className={"flex gap-10 flex-wrap p-2 rounded"}>
                                    {
                                        data.roles?.map((role,index) =>(
                                            <div className={'grip gap-5'} key={index}>
                                                <div className={"capitalize font-bold primaryColor"}>
                                                    <Checkbox disabled defaultChecked={true} onClick={handleChangeCheckbox} name={role.id+''}/>
                                                    {
                                                        role.libelle
                                                    }
                                                </div>
                                                <div className={'flex flex-wrap gap-2'}>
                                                    {
                                                        role.permissions?.map((permission,index) =>(
                                                            <span key={index} className={"rounded border px-1"}>
                                                                    {permission.libelle}
                                                                </span>
                                                        ))
                                                    }
                                                </div>

                                            </div>
                                        ))
                                    }
                                </div>
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
                    <DialogTitle className={'primaryBgColor text-white'}>Suppression du produit</DialogTitle>
                    <DialogContent className={'space-y-5'}>
                        <div className={'mt-5'}>
                            {
                                data.message === 'delete' && 'Voulez-vous vraiment suspendre ce user'
                            }

                            {
                                data.message === 'check' && 'Voulez-vous vraiment débloquer ce user'
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

            {
                success &&
                <SnackBar success={success}/>
            }

            {
                error &&
                <SnackBar error={error}/>
            }

        </PanelLayout>
    );
}

export default Index;
