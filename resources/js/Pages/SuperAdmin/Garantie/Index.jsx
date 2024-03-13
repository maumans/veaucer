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

import {createMRTColumnHelper, MaterialReactTable, useMaterialReactTable} from 'material-react-table'

import { MRT_Localization_FR } from 'material-react-table/locales/fr';
import {router, useForm} from "@inertiajs/react";
import {
    Alert,
    AlertTitle,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Snackbar
} from "@mui/material";
import { Box } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { jsPDF } from 'jspdf'; //or use your library of choice here
import autoTable from 'jspdf-autotable';

import {Add, AddCircle, AddOutlined, Check, Close, Delete, Edit, Visibility} from "@mui/icons-material";
import InputError from "@/Components/InputError.jsx";

function Index({auth,errors,referentiels,garanties,error,success}) {
    //PAGINATION

    const [garantiesSt, setGarantiesSt] = useState([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(true);
    const [rowCount, setRowCount] = useState(0);


    //table state
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex:garanties.current_page-1,
        pageSize:garanties.per_page,
    });

    useEffect(()=>{
        setRowCount(garanties.total)
        setGarantiesSt(garanties.data)
        setIsRefetching(false)
    },[garanties])

    //if you want to avoid useEffect, look at the React Query example instead
    useEffect(() => {

        /*if (!garantiesSt.length) {
            setIsLoading(true);
        } else {
            setIsRefetching(true);
        }*/

        setIsRefetching(true);
        setIsLoading(true);

        axios.post(route('superAdmin.garantie.paginationFiltre'),
            {
                'start': pagination.pageIndex * pagination.pageSize,
                "size": pagination.pageSize,
                'filters': columnFilters ?? [],
                'globalFilter': globalFilter ?? '',
                'sorting': sorting ?? []
            })
            .then(response => {
                console.log(response.data.request)
                setGarantiesSt(response.data.data);
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


    //EXPORT EXCEL

    const handleExportRows = (rows) => {
        const rowData = rows.map((row) => row.original);
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
    };

    const handleExportData = () => {
        const csv = generateCsv(csvConfig)(garantiesSt);
        download(csvConfig)(csv);
    };

    const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
    });

    //Export excel

    //Export PDF

    const handleExportPDF = (rows) => {
        const doc = new jsPDF();
        const tableData = rows.map((row) => Object.values(row.original));
        const tableHeaders = columns.map((c) => c.header);

        autoTable(doc, {
            head: [['N°','Libelle',"designation","Base"]],
            body: tableData,
        });

        doc.save('garanties.pdf');
    };


    const {data,setData,post, put, reset} = useForm(
        {
            'id':'',
            'libelle':'',
            'slug':'',
            'type':'base',
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
        post(route('superAdmin.garantie.store'),{preserveScroll:true,preserveState:true,
            onSuccess:()=> {
                reset()
                setOpen(false);
            },
        })
    };

    const handleEdit = (  el ) => {
        setData({
            'id' : el.id,
            'libelle': el.libelle || '',
            'slug': el.slug || '',
            'type': el.type || '',
        })

        setOpenEdit(true);
    };

    const handleShow = (  el ) => {
        setData({
            'id' : el.id,
            'libelle': el.libelle || '',
            'slug': el.slug || '',
            'type': el.type || '',
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
        put(route('superAdmin.garantie.update',data.id),{
            onSuccess:()=> {
                reset()
                setOpenEdit(false);
            },
        })
    };

    const handleSuspend = () => {
        setOpen(false);
        router.delete(route('superAdmin.garantie.destroy',{id:data.id}))
    };

    const columnHelper = createMRTColumnHelper();

    const columns = useMemo(
        () => [
            {
                accessorKey: 'libelle', //access nested data with dot notation
                header: 'Libelle',
                //size: 10,
            },
            {
                accessorKey: 'slug',
                header: 'Slug',
                //size: 50,
            },
            {
                accessorKey: 'base',
                header: 'Base',
                //size: 50,
                Cell: ({ row }) =>(
                    row.original.base ? 'Oui' : 'Non'
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
        data:garantiesSt,
        //enableRowSelection: true,
        getRowId: (row) => row.id,
        initialState: { showColumnFilters: false },
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
        //columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
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
        localization: MRT_Localization_FR,
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                {/*<Button
                    disabled={table.getPrePaginationRowModel().rows.length === 0}
                    //export all rows, including from the next page, (still respects filtering and sorting)
                    onClick={() =>
                        handleExportRows(table.getPrePaginationRowModel().rows)
                    }
                    startIcon={<FileDownloadIcon />}
                >
                    Export Excel
                </Button>*/}

                <Button
                    disabled={table.getPrePaginationRowModel().rows.length === 0}
                    //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                    onClick={handleExportData}
                    startIcon={<FileDownloadIcon />}
                >
                    Export Excel
                </Button>

                <Button
                    disabled={table.getPrePaginationRowModel().rows.length === 0}
                    //export all rows, including from the next page, (still respects filtering and sorting)
                    onClick={() =>
                        handleExportPDF(table.getPrePaginationRowModel().rows)
                    }
                    startIcon={<FileDownloadIcon />}
                >
                    Export PDF
                </Button>
                {/*
                <Button
                    disabled={table.getRowModel().rows.length === 0}
                    //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                    onClick={() => handleExportRows(table.getRowModel().rows)}
                    startIcon={<FileDownloadIcon />}
                >
                    Export Page Rows
                </Button>
                <Button
                    disabled={
                        !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                    }
                    //only export selected rows
                    onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                    startIcon={<FileDownloadIcon />}
                >
                    Lignes selectionnées
                </Button>*/}
            </Box>
        ),
    });

    return (
        <ReferentielLayout
            success={success}
            error={error}
            auth={auth}
            errors={errors}
            referentiels={referentiels}
            referentiel={'Garanties'}
            active={'referentiel'}
            sousActive={'superAdmin.garantie.index'}
            breadcrumbs={[
                {
                    text:"Garanties",
                    href:route("superAdmin.garantie.index",[auth.user.id]),
                    active:false
                },
                /*{
                    text:"Création",
                    href:route("superAdmin.garantie.create",[auth.user.id]),
                    active:true
                }*/
            ]}
        >
            <div className={'grid gap-5 bg-gray-200 p-2 rounded border'}>


                <div className={'flex justify-end'}>
                    <Button color={'warning'} variant={'contained'} onClick={handleClickOpen} >
                        <AddCircle className={'mr-1'}></AddCircle> Ajout garantie
                    </Button>

                    {
                        ///////ADD DIALOG
                    }
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle className={'bg-orange-600 text-white'}>Ajout de la garantie</DialogTitle>
                        <DialogContent className={'space-y-5'}>
                            {/*<DialogContentText>
                                To subscribe to this website, please enter your email address here. We
                                will send updates occasionally.
                            </DialogContentText>*/}
                            <div className={'grid sm:grid-cols-2 grid-cols-1 bg-gray-50 gap-5 p-2 m-2 rounded'}>
                                <div>
                                    <TextField
                                        value={data.libelle}
                                        autoFocus
                                        id="libelle"
                                        name="libelle"
                                        label="Libelle"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.libelle} className="mt-2" />
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

                                <div>
                                    <FormControl>
                                        <FormLabel id="demo-controlled-radio-buttons-group">Type</FormLabel>
                                        <RadioGroup
                                            aria-labelledby="demo-controlled-radio-buttons-group"
                                            value={data.type}
                                            onChange={handleChange}
                                            name={'type'}
                                            row={true}
                                        >
                                            <FormControlLabel defaultChecked={true} value="base" control={<Radio />} label="Base" />
                                            <FormControlLabel value="optionnel" control={<Radio />} label="Optionnel" />
                                        </RadioGroup>
                                    </FormControl>

                                    <InputError message={errors.type} className="mt-2" />
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
                        <DialogTitle className={'bg-orange-600 text-white'}>Modification de la garantie</DialogTitle>
                        <DialogContent className={'space-y-5'}>
                            {/*<DialogContentText>
                                To subscribe to this website, please enter your email address here. We
                                will send updates occasionally.
                            </DialogContentText>*/}
                            <div className={'grid sm:grid-cols-2 grid-cols-1 bg-gray-50 gap-5 p-2 m-2 rounded'}>
                                <div>
                                    <TextField
                                        value={data.libelle}
                                        autoFocus
                                        id="libelle"
                                        name="libelle"
                                        label="Libelle"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <InputError message={errors.libelle} className="mt-2" />
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

                                <FormControl>
                                    <FormLabel id="demo-controlled-radio-buttons-group">Type</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        value={data.type}
                                        onChange={handleChange}
                                        name={'type'}
                                        row={true}
                                    >
                                        <FormControlLabel value="base" control={<Radio />} label="Base" />
                                        <FormControlLabel value="optionnel" control={<Radio />} label="Optionnel" />
                                    </RadioGroup>
                                </FormControl>
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
                        <DialogTitle className={'bg-orange-600 text-white'}>Details de la garantie</DialogTitle>
                        <DialogContent className={'space-y-5'}>
                            {/*<DialogContentText>
                                To subscribe to this website, please enter your email address here. We
                                will send updates occasionally.
                            </DialogContentText>*/}
                            {
                                <div className={'grid grid-cols-2 mt-5 divide-y divide-x border w-96 min-w-fi'}>
                                    <>
                                        <div className={'font-bold py-2 px-2'}>
                                            LIBELLE
                                        </div>
                                        <div className={'py-2 px-2'}>
                                            {data.libelle}
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
                                            {data.typeSouscripteur?.nom}
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
                        <DialogTitle className={'bg-orange-600 text-white'}>Suppression de la garantie</DialogTitle>
                        <DialogContent className={'space-y-5'}>
                            <div className={'mt-5'}>
                                {
                                    data.message === 'delete' && 'Voulez-vous vraiment suspendre cette garantie'
                                }

                                {
                                    data.message === 'check' && 'Voulez-vous vraiment débloquer cette garantie'
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
