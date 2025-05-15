import React, { useEffect, useMemo, useState } from 'react';
import { Autocomplete, Button, TextareaAutosize, TextField } from "@mui/material";
import { motion } from "framer-motion";

import InputError from "@/Components/InputError";
import { router, useForm } from "@inertiajs/react";
import NumberFormatCustomUtils from "@/Pages/Utils/NumberFormatCustomUtils.jsx";
import PanelLayout from "@/Layouts/PanelLayout.jsx";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { ArrowBack, Check, Close, Delete, Edit, Visibility } from "@mui/icons-material";
import { MRT_Localization_FR } from "material-react-table/locales/fr/index.js";
import { formatNumber } from "chart.js/helpers";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from 'dayjs';
function Create({ auth, produits, departements, departementPrincipal, caisses, caissePrincipale, motifsEntrees, motifsSorties, motifsTransferts, motifsDepenses, motifEntreeDefaut, motifSortieDefaut, motifTransfertDefaut, fournisseurs, fournisseurPrincipal, devises, uniteMesures, errors, success, error, referentiels, typeOperations, typeOperation, mouvement }) {

    const { data, setData, processing } = useForm({
        "date": dayjs(),
        'nom': '',
        'prixAchat': '',
        'prixVente': '',
        'quantiteAchat': '',
        'produit': null,
        'motif': null,
        'fournisseur': fournisseurPrincipal,
        'departementSource': null,
        'departementDestination': null,
        'caisse': caissePrincipale,
        'uniteMesure': null,
        'devise': null,
        'operations': [],
        'depenses': [],
        'montantDepense': "",
        'totalOperation': null,
        'totalDepense': null,
        'enregistrer': false,
        "typeOperation": typeOperation,
        produits: [],
        motifsDepenses: [],
        motifEntree: motifEntreeDefaut,
        motifSortie: motifSortieDefaut,
        motifTransfert: motifTransfertDefaut,
    });

    useEffect(() => {
        if (data.typeOperation?.nom === "entrée") {
            setData("departementDestination", departementPrincipal);
        }
        if (data.typeOperation?.nom === "sortie") {
            setData("departementSource", departementPrincipal);
        }
        if (data.typeOperation?.nom === "transfert") {
            setData(prevData => ({
                ...prevData,
                "departementSource": departementPrincipal,
                "departementDestination": null,
            }));
        }
    }, [data.typeOperation]);



    const [isRefetching, setIsRefetching] = useState(false);
    const [successSt, setSuccessSt] = useState(false);
    const [errorSt, setErrorSt] = useState(false);

    const onHandleChangeOperation = (e) => {
        e.target.type === 'checkbox'
            ?
            setData(prevData => ({
                ...prevData,
                [e.target.name]: e.target.checked
            }))
            :
            setData(prevData => ({
                ...prevData,
                [e.target.name]: e.target.value
            }));
    };

    const onHandleChangeDepense = (e) => {
        e.target.type === 'checkbox'
            ?
            setData(prevData => ({
                ...prevData,
                [e.target.name]: e.target.checked
            }))
            :
            setData(prevData => ({
                ...prevData,
                [e.target.name]: e.target.value
            }));
    };

    useEffect(() => {
        let totalOperation = 0
        let operationData = []
        // Initialiser les valeurs par défaut pour chaque `row` si elles n'existent pas
        data.operations.forEach((op) => {


            if (data.typeOperation?.nom === "entrée") {
                if (data[`quantiteAchat.${op.id}`] && data[`prixAchat.${op.id}`]) {
                    totalOperation += data[`quantiteAchat.${op.id}`] * data[`prixAchat.${op.id}`]

                    operationData.push({
                        id: op.id,
                        prixAchat: parseInt(data[`prixAchat.${op.id}`]),
                        quantiteAchat: parseInt(data[`quantiteAchat.${op.id}`]),
                        produit_id: op.produit_id,
                        produit_nom: op.produit_nom,
                        type_produit_achat_id: op.type_produit_achat_id,
                    })
                }

                if (!data[`prixAchat.${op.id}`]) {
                    setData((prevData) => ({
                        ...prevData,
                        [`prixAchat.${op.id}`]: op.prixAchat,
                    }));
                }
            }
            else if (data.typeOperation?.nom === "sortie" || data.typeOperation?.nom === "transfert") {
                if (data[`quantiteAchat.${op.id}`]) {

                    operationData.push({
                        id: op.id,
                        quantiteAchat: parseInt(data[`quantiteAchat.${op.id}`]),
                        produit_id: op.produit_id,
                        produit_nom: op.produit_nom,
                    })
                }
            }
        });

        setData((prevData) => ({
            ...prevData,
            totalOperation,
            operationData
        }));
    }, [data.operations, data]);



    useEffect(() => {
        let depenseData = []
        let totalDepense = 0
        // Initialiser les valeurs par défaut pour chaque `row` si elles n'existent pas
        data.depenses.forEach((dep) => {
            if (data[`montantDepense.${dep.id}`]) {
                totalDepense += parseInt(data[`montantDepense.${dep.id}`])
                depenseData.push({
                    id: dep.id,
                    montant: parseInt(data[`montantDepense.${dep.id}`]),
                    motif: dep.motif,
                    motif_id: dep.motif_id,
                    commentaire: data[`commentaire.${dep.id}`]
                })
            }
        });

        setData((prevData) => ({
            ...prevData,
            totalDepense,
            depenseData
        }));
    }, [data.depenses, data]);

    const [columnVisibility, setColumnVisibility] = useState({
        prixAchat: data.typeOperation?.nom === "entrée",
        montant: data.typeOperation?.nom === "entrée",
        typeProduitAchat: data.typeOperation?.nom === "entrée"
    });

    useEffect(() => {
        setData((prevData) => ({
            ...prevData,
            total: (data.totalOperation || 0) + (data.totalDepense || 0)
        }));

    }, [data.totalOperation,data.totalDepense]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'N°', //access nested data with dot notationid', //access nested data with dot notation
                header: 'N°',
                Cell: ({ row }) => (
                    row.index + 1
                )
            },
            {
                accessorKey: 'nom', //access nested data with dot notation
                header: 'Nom',
                //size: 10,
                Cell: ({ row }) => (
                    row.original.produit?.nom
                )
            },
            {
                accessorKey: 'typeProduitAchat',
                header: "Type d'achat",
                Cell: ({ row }) => (
                    row.original.type_produit_achat?.toLowerCase() == 'ensemble' ? 'Engros' : 'Unité'
                )
            },

            {
                accessorKey: 'prixAchat',
                header: "Prix d'achat (GNF)",
                Cell: ({ row }) => (
                    <TextField
                        name={`prixAchat.${row.original.id}`}
                        value={data[`prixAchat.${row.original.id}`] || ''}
                        InputProps={{
                            inputComponent: NumberFormatCustomUtils,
                            inputProps: {
                                max: 100000000000,
                                min: -1000000000000,
                            },
                        }}
                        className="w-full"
                        onChange={onHandleChangeOperation}
                        size="small"
                    />
                )
            },
            {
                accessorKey: 'quantiteAchat',
                header: "Quantité",
                Cell: ({ row }) => (
                    <TextField
                        name={`quantiteAchat.${row.original.id}`}
                        value={data[`quantiteAchat.${row.original.id}`] || ''}
                        InputProps={{
                            inputComponent: NumberFormatCustomUtils,
                            inputProps: {
                                max: 100000000000,
                                min: -1000000000000,
                            },
                        }}
                        className="w-full"
                        onChange={onHandleChangeOperation}
                        size="small"
                    />
                )
            },
            {
                accessorKey: 'montant',
                header: "Montant (GNF)",
                Cell: ({ row }) => {
                    const prixAchat = parseFloat(data[`prixAchat.${row.original.id}`] || 0);
                    const quantiteAchat = parseFloat(data[`quantiteAchat.${row.original.id}`] || 0);
                    const montant = prixAchat * quantiteAchat;

                    return montant > 0
                        ? `${formatNumber(montant)} GNF`
                        : '';
                }
            },
            {
                accessorKey: 'action', //access nested data with dot notation
                header: "Action",
                //size: 10,
                Cell: ({ row }) => (
                    <Button key={row.original.id} onClick={() => handleRemoveToOperation(row.original.id)} variant={'contained'} size={'small'} color={'error'}>
                        <Close />
                    </Button>
                )
            },
        ],
        [data, onHandleChangeOperation, handleRemoveToOperation],
    );

    const columnsDepense = useMemo(
        () => [
            {
                accessorKey: 'motif', //access nested data with dot notation
                header: 'Motif',
                //size: 10,
                Cell: ({ row }) => (
                    row.original.motif?.nom
                )
            },

            {
                accessorKey: 'montant',
                header: "Montant (GNF)",
                Cell: ({ row }) => (
                    <TextField
                        name={`montantDepense.${row.original.id}`}
                        value={data[`montantDepense.${row.original.id}`] || ''}
                        InputProps={{
                            inputComponent: NumberFormatCustomUtils,
                            inputProps: {
                                max: 100000000000,
                                min: -1000000000000,
                            },
                        }}
                        className="w-full"
                        onChange={onHandleChangeDepense}
                        size="small"
                    />
                )
            },

            {
                accessorKey: 'commentaire', //access nested data with dot notation
                header: 'Commentaire',
                //size: 10,
                Cell: ({ row }) => (
                    <TextareaAutosize
                        name={`commentaire.${row.original.id}`}
                        value={data[`commentaire.${row.original.id}`] || ''}
                        className="w-full"
                        onChange={onHandleChangeDepense}
                        size="small"
                        multiline
                        minRows={1}
                        required={row?.original?.motif?.nom === 'autres'}
                    />
                )
            },

            {
                accessorKey: 'action', //access nested data with dot notation
                header: "Action",
                //size: 10,
                Cell: ({ row }) => (
                    <Button key={row.original.id} onClick={() => handleRemoveToDepense(row.original.id)} variant={'contained'} size={'small'} color={'error'} type={'button'}>
                        <Close></Close>
                    </Button>
                )
            },
        ],
        [data, onHandleChangeDepense, handleRemoveToDepense],
    );

    useEffect(() => {
        setSuccessSt(success)
    }, [success])

    useEffect(() => {
        setErrorSt(error)
    }, [error])


    function handleSubmit(e) {
        e.preventDefault();
        router.post(route("admin.mouvement.store", auth.user.id), {
            date: data.date,
            typeOperation: data.typeOperation?.id,
            typeOperation_nom: data.typeOperation?.nom,
            fournisseur: data.typeOperation?.nom === "entrée" ? data.fournisseur?.id : null,
            departementSource: data.departementSource?.id,
            departementDestination: data.departementDestination?.id,
            motifSortie: data.typeOperation?.nom === "sortie" ? data.motifSortie?.id : null,
            motifTransfert: data.typeOperation?.nom === "transfert" ? data.motifTransfert?.id : null,
            caisse: data.caisse?.id,
            operations: data.operationData,
            depenses: data.depenseData,
            totalOperation: data.totalOperation,
            totalDepense: data.totalDepense,
        }, { preserveScroll: true })
    }

    useEffect(() => {
        let operations = []

        if (data.typeOperation?.nom === "entrée") {
            data.produits.map((p) => {
                operations.push({
                    id: p.id,
                    produit: p,
                    produit_id: p?.id,
                    produit_nom: p?.nom,
                    type_produit_achat: p?.type_produit_achat?.nom,
                    type_produit_achat_id: p?.type_produit_achat?.id,
                    prixAchat: p.prixAchat,
                    quantiteAchat: '',
                    montant: '',
                })

            })
        }
        else if (data.typeOperation?.nom === "sortie" || data.typeOperation?.nom === "transfert") {
            data.produits.map((p) => {
                operations.push({
                    id: p.id,
                    produit: p,
                    produit_id: p?.id,
                    produit_nom: p?.nom,
                    quantiteAchat: '',
                })

            })
        }



        setData(prevData => ({
            ...prevData,
            "operations": operations
        }))

    }, [data.produits])

    function handleRemoveToOperation(id) {
        setData(prevData => ({
            ...prevData,
            "produits": prevData.produits.filter((c) => c.id !== id)
        }))

        setData((prevData) => ({
            ...prevData,
            ["prixAchat." + id]: '',
            ["quantiteAchat." + id]: '',
        }))

        setSuccessSt('Produit retiré avec succès')
    }

    useEffect(() => {
        let depenses = []
        data.motifsDepenses.map((m) => {
            depenses.push({
                id: m.id,
                motif: m,
                motif_id: m?.id,
                montant: '',
                commentaire: '',
            })
        })

        setData(prevData => ({
            ...prevData,
            "depenses": depenses
        }))

    }, [data.motifsDepenses])


    function handleRemoveToDepense(id) {
        setData((prevData) => ({
            ...prevData,
            "motifsDepenses": prevData.motifsDepenses.filter((c) => c.id !== id)
        }));

        setData((prevData) => ({
            ...prevData,
            ["montantDepense." + id]: ''
        }))

        setSuccessSt('Dépense retirée avec succès')
    }

    const table = useMaterialReactTable({
        columns,
        data: data.operations,
        state: {
            columnVisibility,
            showProgressBars: isRefetching,
        },
        onColumnVisibilityChange: setColumnVisibility,
        localization: MRT_Localization_FR
    });

    const tableDepense = useMaterialReactTable({
        columns: columnsDepense,
        data: data.depenses,
        //enableRowSelection: true,
        state: {
            showProgressBars: isRefetching,
        },
        localization: MRT_Localization_FR
    });


    const [selectAll, setSelectAll] = useState(false);

    // Create a "Select All" option
    const selectAllOption = { id: 'select-all', nom: 'Tous les produits' };

    // Modified options list to include "Select All"
    const optionsWithSelectAll = [selectAllOption, ...produits];

    const handleChangeProduits = (event, newValues) => {
        // Handle "Select All" logic
        if (newValues.some(option => option.id === 'select-all')) {
            // If "Select All" is selected, toggle between all products and no products
            if (selectAll) {
                setData('produits', []);
                setSelectAll(false);
            } else {
                setData('produits', produits);
                setSelectAll(true);
            }
        } else {
            // Normal selection
            setData('produits', newValues);
            // Check if all products are now selected
            setSelectAll(newValues.length === produits.length);
        }
    };

    const [selectAllMotif, setSelectAllMotif] = useState(false);

    // Create a "Select All" option
    const selectAllOptionMotif = { id: 'select-all', nom: 'Tous les motifs' };

    // Modified options list to include "Select All"
    const optionsWithSelectAllMotif = [selectAllOptionMotif, ...motifsDepenses];

    const handleChangeMotifs = (event, newValues) => {
        // Handle "Select All" logic
        if (newValues.some(option => option.id === 'select-all')) {
            // If "Select All" is selected, toggle between all products and no products
            if (selectAllMotif) {
                setData('motifsDepenses', []);
                setSelectAllMotif(false);
            } else {
                setData('motifsDepenses', motifsDepenses);
                setSelectAllMotif(true);
            }
        } else {
            // Normal selection
            setData('motifsDepenses', newValues);
            // Check if all products are now selected
            setSelectAllMotif(newValues.length === motifsDepenses.length);
        }
    };

    return (
        <PanelLayout
            auth={auth}
            success={successSt}
            error={errorSt}
            active={'stock'}
            sousActive={'mouvement'}
            breadcrumbs={[
                {
                    text: "Mouvement",
                    href: route("admin.mouvement.index", auth.user.id),
                    active: false
                },
                {
                    text: "Nouveau",
                    href: route("admin.mouvement.create", auth.user.id),
                    active: true
                }
            ]}
        >
            <div>
                <div className="w-full">
                    <div className="p-4 bg-white rounded mb-4">
                        <div className="flex justify-between items-center">
                            <div className="bg-black w-fit p-2 rounded text-xl font-bold text-white">
                                <h2>Nouveau mouvement de stock</h2>
                            </div>
                            <Button 
                                variant={'outlined'} 
                                startIcon={<ArrowBack />}
                                onClick={() => router.get(route('admin.mouvement.index', auth.user.id))}
                            >
                                Retour à la liste
                            </Button>
                        </div>
                    </div>
                    <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            duration: 0.5,
                            type: "spring",
                        }}

                        style={{ width: '100%' }}
                    >
                        <form onSubmit={handleSubmit} className={"w-full space-y-5 gap-5 rounded bg-white p-5"}>
                            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded"}>
                
                                <div className={"w-full"}>
                                    <div className={"md:col-span-2 font-bold text-orange-500"}>
                                        Date de l'operation
                                    </div>
                                    <DatePicker
                                        className={"w-full"}
                                        openTo="day"
                                        views={['year', 'month', 'day']}
                                        format={'DD/MM/YYYY'}
                                        value={data.date}
                                        onChange={(newValue) => {
                                            setData("date", newValue);
                                        }}
                                        slotProps={{ textField: { size: 'small' } }}
                                    />
                                </div>
                                <div>
                                    <div className={"md:col-span-2 font-bold text-orange-500"}>
                                        Mouvement
                                    </div>
                                    <Autocomplete
                                        value={data.typeOperation}
                                        className={"w-full"}
                                        onChange={(e, val) => setData("typeOperation", val)}
                                        disablePortal={true}
                                        options={typeOperations}
                                        getOptionLabel={(option) => option.libelle}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => <TextField fullWidth {...params} placeholder={"mouvement"} label={params.libelle} required />}
                                        size="small"
                                    />
                                    <InputError message={errors["typeOperation"]} />
                                </div>

                                {/* {
                                    data.typeOperation?.nom === "entrée" &&
                                    <div>
                                        <div className={"md:col-span-2 font-bold text-orange-500"}>
                                            Motif
                                        </div>
                                        <Autocomplete
                                            value={data.motifEntree}
                                            className={"w-full"}
                                            onChange={(e, val) => setData("motifEntree", val)}
                                            disablePortal={true}
                                            options={motifsEntrees}
                                            getOptionLabel={(option) => option.nom}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            renderInput={(params) => <TextField fullWidth {...params} placeholder={"motif d'entree"} label={params.libelle} required />}
                                            size="small"
                                        />
                                        <InputError message={errors["motifEntree"]} />
                                    </div>
                                } */}

                                {
                                    data.typeOperation?.nom === "sortie" &&
                                    <div>
                                        <div className={"md:col-span-2 font-bold text-orange-500"}>
                                            Motif de sortie
                                        </div>
                                        <Autocomplete
                                            value={data.motifSortie}
                                            className={"w-full"}
                                            onChange={(e, val) => setData("motifSortie", val)}
                                            disablePortal={true}
                                            options={motifsSorties}
                                            getOptionLabel={(option) => option.nom?.charAt(0).toUpperCase() + option.nom?.slice(1)}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            renderInput={(params) => <TextField fullWidth {...params} placeholder={"motif"} label={params.libelle} required />}
                                            size="small"
                                        />
                                        <InputError message={errors["motifSortie"]} />
                                    </div>
                                }

                                {
                                    data.typeOperation?.nom === "transfert" &&
                                    <div>
                                        <div className={"md:col-span-2 font-bold text-orange-500"}>
                                            Motif de transfert
                                        </div>
                                        <Autocomplete
                                            value={data.motifTransfert}
                                            className={"w-full"}
                                            onChange={(e, val) => setData("motifTransfert", val)}
                                            disablePortal={true}
                                            options={motifsTransferts}
                                            getOptionLabel={(option) => option.nom?.charAt(0).toUpperCase() + option.nom?.slice(1)}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            renderInput={(params) => <TextField fullWidth {...params} placeholder={"motif de transfert"} label={params.libelle} required />}
                                            size="small"
                                        />
                                        <InputError message={errors["motifTransfert"]} />
                                    </div>
                                }
                                <div className={"md:col-span-2 grid md:grid-cols-2 gap-2"}>
                                    {
                                        (data.typeOperation?.nom === "sortie" || data.typeOperation?.nom === "transfert") &&
                                        <div>
                                            <div className={"md:col-span-2 font-bold text-orange-500"}>
                                                Stock source
                                            </div>
                                            <Autocomplete
                                                value={data.departementSource}
                                                className={"w-full"}
                                                onChange={(e, val) => setData("departementSource", val)}
                                                disablePortal={true}
                                                options={departements.filter((d) => d.id !== data.departementDestination?.id)}
                                                getOptionLabel={(option) => "Stock " + option.nom}
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                                renderInput={(params) => <TextField fullWidth {...params} placeholder={"Stock"} label={params.nom} required />}
                                                size="small"
                                            />
                                            <InputError message={errors["departementSource"]} />
                                        </div>
                                    }
                                    {
                                        (data.typeOperation?.nom === "entrée" || data.typeOperation?.nom === "transfert") &&
                                        <div>
                                            <div className={"md:col-span-2 font-bold text-orange-500"}>
                                                Stock de destination
                                            </div>
                                            <Autocomplete
                                                value={data.departementDestination}
                                                className={"w-full"}
                                                onChange={(e, val) => setData("departementDestination", val)}
                                                disablePortal={true}
                                                options={departements.filter((d) => d.id !== data.departementSource?.id)}
                                                getOptionLabel={(option) => "Stock " + option.nom}
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                                renderInput={(params) => <TextField fullWidth {...params} placeholder={"Stock"} label={params.nom} required />}
                                                size="small"
                                            />
                                            <InputError message={errors["departementDestination"]} />
                                        </div>
                                    }
                                </div>


                                {
                                    data.typeOperation?.nom === "entrée" &&
                                    <div>
                                        <div className={"md:col-span-2 font-bold text-orange-500"}>
                                            Caisse de paiement
                                        </div>
                                        <Autocomplete
                                            value={data.caisse}
                                            className={"w-full"}
                                            onChange={(e, val) => setData("caisse", val)}
                                            disablePortal={true}
                                            options={caisses}
                                            getOptionLabel={(option) => "Caisse dep. " + option?.departement?.nom}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            renderInput={(params) => <TextField fullWidth {...params} placeholder={"Caisse"} label={params.nom} required />}
                                            size="small"
                                        />
                                        <InputError message={errors["caisse"]} />
                                        {
                                            data.caisse
                                            &&
                                            <div className={'text-orange-500 font-bold mt-1'}>
                                                Solde: {formatNumber(data.caisse.solde) + ' GNF'}
                                            </div>
                                        }
                                    </div>
                                }

                                {data.typeOperation?.nom === "entrée" &&
                                    <div>
                                        <div className={"md:col-span-2 font-bold text-orange-500"}>
                                            Fournisseur
                                        </div>
                                        <Autocomplete
                                            value={data.fournisseur}
                                            className={"w-full"}
                                            onChange={(e, val) => setData("fournisseur", val)}
                                            disablePortal={true}
                                            options={fournisseurs}
                                            getOptionLabel={(option) => option.nom}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            renderInput={(params) => <TextField fullWidth {...params} placeholder={"Fournisseur"} label={params.nom} /* required */ />}
                                            size="small"
                                        />
                                        <InputError message={errors["fournisseur"]} />
                                    </div>
                                }
                            </div>
                            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded"}>

                                <div className={"md:col-span-2 font-bold text-orange-500 text-xl"}>
                                    Ajout des produits
                                </div>

                                <div>
                                    <Autocomplete
                                        value={data.produits}
                                        className="w-full"
                                        onChange={handleChangeProduits}
                                        disablePortal={true}
                                        options={optionsWithSelectAll}
                                        multiple={true}
                                        getOptionLabel={(option) => option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => (
                                            <TextField
                                                fullWidth
                                                {...params}
                                                placeholder="Produits"
                                                label={params.nom}
                                            />
                                        )}
                                        disableCloseOnSelect={true}
                                        size="small"
                                    />
                                    <InputError message={errors["produits"]} />
                                </div>


                                <div className={"md:col-span-2"}>
                                    <MaterialReactTable table={table} />
                                </div>
                                {
                                    data.totalOperation ?
                                        <div className={"md:col-span-2 w-fit p-2 rounded bg-black text-white"}>
                                            {"Total des produits : " + formatNumber(data.totalOperation) + ' GNF'}
                                        </div>
                                        :
                                        ""
                                }

                            </div>
                            {
                                data.typeOperation?.nom === "entrée" &&
                                <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded"}>
                                    <div className={"md:col-span-2 font-bold text-orange-500 text-xl"}>
                                        Dépense supplémentaires
                                    </div>

                                    <div>
                                        <Autocomplete
                                            value={data.motifsDepenses}
                                            className="w-full"
                                            onChange={handleChangeMotifs}
                                            disablePortal={true}
                                            options={optionsWithSelectAllMotif}
                                            multiple={true}
                                            getOptionLabel={(option) => option.nom}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            renderInput={(params) => (
                                                <TextField
                                                    fullWidth
                                                    {...params}
                                                    placeholder="Motifs"
                                                    label={params.nom}
                                                />
                                            )}
                                            disableCloseOnSelect={true}
                                            size="small"
                                        />
                                        <InputError message={errors["motifsDepenses"]} />
                                    </div>

                                    <div className={"md:col-span-2"}>
                                        <MaterialReactTable table={tableDepense} />
                                    </div>

                                    {
                                        data.totalDepense ?
                                            <div className={"md:col-span-2 w-fit p-2 rounded bg-black text-white"}>
                                                {"Total des dépenses: " + formatNumber(data.totalDepense) + ' GNF'}
                                            </div>
                                            :
                                            ""
                                    }

                                </div>
                            }
                            {
                                data.total ?
                                    <div className={"md:col-span-2 w-fit p-2 rounded bg-black text-white"}>
                                        {"Total: " + formatNumber(data.total) + ' GNF'}
                                    </div>
                                    :
                                    ""
                            }
                            
                            <div className={"w-full md:col-span-2 flex justify-end gap-4 mt-10 py-2 px-1 bg-gray-100 rounded"}>
                                <Button variant={'contained'} color={'success'} type={"submit"}>
                                    Enregistrer
                                </Button>
                            </div>

                        </form>

                    </motion.div>

                </div>
            </div>
        </PanelLayout>
    );
}
export default Create;
