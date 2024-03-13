import React, {useEffect, useMemo, useState} from 'react';
import {Autocomplete, Button, TextareaAutosize, TextField} from "@mui/material";
import {motion} from "framer-motion";

import InputError from "@/Components/InputError";
import {useForm} from "@inertiajs/react";
import Divider from "@mui/material/Divider";
import ReferentielLayout from "@/Layouts/ReferentielLayout.jsx";
import NumberFormatCustomUtils from "@/Pages/Utils/NumberFormatCustomUtils.jsx";
import PanelLayout from "@/Layouts/PanelLayout.jsx";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {Check, Close, Delete, Edit, Visibility} from "@mui/icons-material";
import {MRT_Localization_FR} from "material-react-table/locales/fr/index.js";
import {formatNumber} from "chart.js/helpers";
import SnackBar from "@/Components/SnackBar.jsx";
import {DatePicker} from "@mui/x-date-pickers";
import {format} from "date-fns";
import dayjs from 'dayjs';
function Create({auth,produits,departements,departementPrincipal,motifs,fournisseurs,fournisseurPrincipal,devises,uniteMesures,errors,success,error,referentiels}) {

    const {data,setData, post, processing}=useForm({
        "date":Date.now(),
        'nom':'',
        'prixAchat':'',
        'prixVente':'',
        'quantite':'',
        'image':'',
        'produit':null,
        'motif':null,
        'fournisseur':fournisseurPrincipal,
        'departement':departementPrincipal,
        'uniteMesure':null,
        'devise':null,
        'commandes':[],
        'depenses':[],
        'montantDepense':"",
        'totalCommande':null,
        'totalDepense':null,
    });

    const [isRefetching, setIsRefetching] = useState(false);
    const [successSt, setSuccessSt] = useState(false);
    const [errorSt, setErrorSt] = useState(false);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'nom', //access nested data with dot notation
                header: 'Nom',
                //size: 10,
                Cell: ({ row }) =>(
                    row.original.produit?.nom
                )
            },
            {
                accessorKey: 'prixAchat', //access nested data with dot notation
                header: "Prix d'achat",
                //size: 10,
                Cell: ({ row }) =>(
                    formatNumber(row.original.prixAchat)+' GNF'
                )
            },
            {
                accessorKey: 'quantite', //access nested data with dot notation
                header: "Quantité",
                //size: 10,
                Cell: ({ row }) =>(
                    formatNumber(row.original.quantite)
                )
            },
            {
                accessorKey: 'montant', //access nested data with dot notation
                header: "Montant",
                //size: 10,
                Cell: ({ row }) =>(
                    formatNumber(row.original.montant)+' GNF'
                )
            },
            {
                accessorKey: 'action', //access nested data with dot notation
                header: "Action",
                //size: 10,
                Cell: ({ row }) =>(
                    <Button key={row.original.id} onClick={()=>handleRemoveToCommande(row.original.id)} variant={'contained'} size={'small'} color={'error'}>
                        <Close></Close>
                    </Button>
                )
            },
        ],
        [],
    );

    const columnsDepense = useMemo(
        () => [
            {
                accessorKey: 'motif', //access nested data with dot notation
                header: 'Motif',
                //size: 10,
                Cell: ({ row }) =>(
                    row.original.motif?.nom
                )
            },

            {
                accessorKey: 'montant', //access nested data with dot notation
                header: "Montant",
                //size: 10,
                Cell: ({ row }) =>(
                    formatNumber(row.original.montant)+' GNF'
                )
            },
            {
                accessorKey: 'action', //access nested data with dot notation
                header: "Action",
                //size: 10,
                Cell: ({ row }) =>(
                    <Button key={row.original.id} onClick={()=>handleRemoveToDepense(row.original.id)} variant={'contained'} size={'small'} color={'error'} type={'button'}>
                        <Close></Close>
                    </Button>
                )
            },
        ],
        [],
    );

    const onHandleChange = (e) => {
        e.target.type === 'checkbox'
            ?
            setData(e.target.name,e.target.checked)
            :
            setData(e.target.name,e.target.value);
    };


    function handleSubmit(e) {
        e.preventDefault();
        post(route("admin.stockAppro.store",auth.user.id),{preserveScroll:true})
    }

    useEffect(()=> {
        data.produit && setData('prixAchat', data.produit.prixAchat)
    },[data.produit])

    useEffect(()=> {
        data.motif && setData('montantDepense', '')
    },[data.motif])

    function handleAddToCommande()
    {
        if(data.produit && data.prixAchat && data.quantite)
        {
            const p={
                id: data.produit.id,
                produit: data.produit,
                prixAchat: data.prixAchat,
                quantite: data.quantite,
                montant: data.prixAchat*data.quantite,

            }

            let commandes= []
            let trouve=false

            data.commandes.map((c)=>{
                if(c.id === p.id)
                {
                    c.prixAchat=p.prixAchat
                    c.quantite = parseInt(c.quantite) + parseInt(p.quantite)
                    c.montant=parseInt(c.quantite) * parseInt(p.prixAchat)
                    trouve=true
                }
                commandes.push(c)
            })

            if (!trouve)
            {
                commandes.push(p)
            }


            setData((data)=>({
                ...data,
                commandes,
                produit: null,
                prixAchat: '',
                quantite: '',
            }))

            setSuccessSt('Produit ajouté avec succès')
            setTimeout(()=>(
                setSuccessSt(false)
            ),3000)
        }
        else
        {
            setErrorSt('Veuillez remplir les champs de la commande')
            setTimeout(()=>(
                setErrorSt(false)
            ),3000)
        }

    }

    useEffect(()=>{
        let t=0
        data.commandes.map((c)=>t+=parseInt(c.montant))
        setData("totalCommande",t)
    },[data.commandes])

    useEffect(()=>{
        let t=0
        data.depenses.map((d)=>t+=parseInt(d.montant))
        setData("totalDepense",t)
    },[data.depenses])

    function handleRemoveToCommande(id)
    {
        setData("commandes",data.commandes.filter((c)=>(c.id !== id)));
        setSuccessSt('Produit retiré avec succès')
    }

    useEffect(()=>(
        setData((data)=>({
            ...data,
            quantite: '',
        }))
    ),[data.produit])

    function handleAddToDepense()
    {
        if(data.motif && data.montantDepense)
        {
            let d={
                id: data.motif.id,
                motif: data.motif,
                montant: data.montantDepense,
            }

            let trouve=false
            let depenses= []

            data.depenses.map((c)=>{
                if(c.id === data.motif.id)
                {
                    c.montant=d.montant
                    trouve=true
                }
                console.log
                depenses.push(c)
            })

            if (!trouve)
            {
                depenses.push(d)
            }

            setData((data)=>({
                ...data,
                depenses,
                motif: null,
                montantDepense: '',
            }))

            setSuccessSt('Dépense ajoutée avec succès')
            setTimeout(()=>(
                setSuccessSt(false)
            ),3000)
        }
        else
        {
            setErrorSt('Veuillez remplir les champs de la dépense')
            setTimeout(()=>(
                setErrorSt(false)
            ),3000)
        }

    }

    function handleRemoveToDepense(id)
    {
        setData("depenses",data.depenses.filter((d)=>(d.id !== id)));
        setSuccessSt('Dépense retirée avec succès')
    }

    const table = useMaterialReactTable({
        columns,
        data:data.commandes,
        //enableRowSelection: true,
        state: {
            showProgressBars: isRefetching,
        },
        localization: MRT_Localization_FR
    });

    const tableDepense = useMaterialReactTable({
        columns:columnsDepense,
        data:data.depenses,
        //enableRowSelection: true,
        state: {
            showProgressBars: isRefetching,
        },
        localization: MRT_Localization_FR
    });


    return (
        <PanelLayout
            auth={auth}
            success={successSt}
            error={errorSt}
            active={'stock'}
            sousActive={'appro'}
            breadcrumbs={[
                {
                    text:"Appro",
                    href:route("admin.stockAppro.index",auth.user.id),
                    active:false
                },
                {
                    text:"Création",
                    href:route("admin.stockAppro.create",[auth.user.id]),
                    active:true
                }
            ]}
        >
            <div>
                <div className="w-full">
                    <motion.div
                        initial={{y:-10,opacity:0}}
                        animate={{y:0,opacity:1}}
                        transition={{
                            duration:0.5,
                            type:"spring",
                        }}

                        style={{width: '100%' }}
                    >
                        <form onSubmit={handleSubmit} className={"w-full space-y-5 gap-5 rounded bg-white p-5"}>
                            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded"}>
                                <div className={"w-full"}>
                                    <div className={"md:col-span-2 font-bold text-orange-500"}>
                                        Date de la commande
                                    </div>
                                    <DatePicker
                                        className={"w-full"}
                                        /*openTo="day"
                                        views={['year','month','day']}*/
                                        //label="Date de la commande"
                                        value={data.date}
                                        onChange={(newValue) => {
                                            setData("date",newValue);
                                        }}
                                    />

                                </div>
                                <div>
                                    <div className={"md:col-span-2 font-bold text-orange-500"}>
                                        Stock à approvisionner
                                    </div>
                                    <Autocomplete
                                        value={data.departement}
                                        className={"w-full"}
                                        onChange={(e,val)=>setData("departement",val)}
                                        disablePortal={true}
                                        options={departements}
                                        getOptionLabel={(option)=>"Stock "+option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Stock"} label={params.nom}/>}
                                    />
                                    <InputError message={errors["departement"]}/>
                                </div>

                                <div>
                                    <div className={"md:col-span-2 font-bold text-orange-500"}>
                                        Fournisseur
                                    </div>
                                    <Autocomplete
                                        value={data.fournisseur}
                                        className={"w-full"}
                                        onChange={(e,val)=>setData("fournisseur",val)}
                                        disablePortal={true}
                                        options={fournisseurs}
                                        getOptionLabel={(option)=>option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Fournisseur principal"} label={params.nom}/>}
                                    />
                                    <InputError message={errors["fournisseur"]}/>
                                </div>

                            </div>

                            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded"}>

                                <div className={"md:col-span-2 font-bold text-orange-500"}>
                                    Ajout de produits à la commande
                                </div>

                                <div className={"md:col-span-2"}>
                                    <MaterialReactTable table={table}/>
                                </div>
                                {
                                    data.totalCommande ?
                                    <div className={"md:col-span-2 w-fit p-2 rounded bg-black text-white"}>
                                        {"Total: "+formatNumber(data.totalCommande)+' GNF'}
                                    </div>
                                        :
                                        ""
                                }

                                <div>
                                    <Autocomplete
                                        value={data.produit}
                                        className={"w-full"}
                                        onChange={(e,val)=>setData("produit",val)}
                                        disablePortal={true}
                                        options={produits}
                                        getOptionLabel={(option)=>option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Produit"} label={params.nom}/>}
                                    />
                                    <InputError message={errors["data.produit"]}/>
                                </div>
                                <div className={"w-full"}>
                                    <TextField
                                        value={data.prixAchat}
                                        InputProps={{
                                            inputComponent: NumberFormatCustomUtils,
                                            endAdornment:"GNF",
                                            inputProps:{
                                                max:100000000000,
                                                min:-1000000000000,
                                                name:"prixAchat",
                                            },
                                        }}
                                        className={"w-full"} label="Prix d'achat" name="prixAchat" onChange={onHandleChange}/>
                                    <InputError message={errors.prixAchat}/>
                                </div>

                                <div className={"w-full"}>
                                    <TextField
                                        value={data.quantite}
                                        InputProps={{
                                            inputComponent: NumberFormatCustomUtils,
                                            inputProps:{
                                                max:100000000000,
                                                min:-1000000000000,
                                                name:"quantite",
                                            },
                                        }}
                                        className={"w-full"} label="Quantité" name="quantite" onChange={onHandleChange}/>
                                    <InputError message={errors.quantite}/>
                                </div>


                                <div className={"md:col-span-2 w-fit"}>
                                    <Button onClick={handleAddToCommande} variant={'contained'} sx={{color:"white"}} color={'primary'} type={"button"}>
                                        Ajouter
                                    </Button>
                                </div>

                            </div>

                            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded"}>
                                <div className={"md:col-span-2 font-bold text-orange-500"}>
                                    Dépense supplémentaires
                                </div>

                                <div className={"md:col-span-2"}>
                                    <MaterialReactTable table={tableDepense}/>
                                </div>

                                {
                                    data.totalDepense ?
                                    <div className={"md:col-span-2 w-fit p-2 rounded bg-black text-white"}>
                                        {"Total: "+formatNumber(data.totalDepense)+' GNF'}
                                    </div>
                                        :
                                        ""
                                }

                                <div>
                                    <Autocomplete
                                        value={data.motif}
                                        className={"w-full"}
                                        onChange={(e,val)=>setData("motif",val)}
                                        disablePortal={true}
                                        options={motifs}
                                        getOptionLabel={(option)=>option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Motif"} label={params.nom}/>}
                                    />
                                    <InputError message={errors["data.motif"]}/>
                                </div>

                                <div className={"w-full"}>
                                    <TextField
                                        value={data.montantDepense}
                                        InputProps={{
                                            inputComponent: NumberFormatCustomUtils,
                                            endAdornment:"GNF",
                                            inputProps:{
                                                max:100000000000,
                                                min:-1000000000000,
                                                name:"montantDepense",
                                            },
                                        }}
                                        className={"w-full"} label="montant" name="montantDepense" onChange={onHandleChange}/>
                                    <InputError message={errors.montantDepense}/>
                                </div>

                                <div className={"md:col-span-2 w-fit"}>
                                    <Button onClick={handleAddToDepense} variant={'contained'} sx={{color:"white"}} color={'primary'} type={"button"}>
                                        Ajouter
                                    </Button>
                                </div>

                            </div>

                            <div className={"w-full md:col-span-2 flex gap-2 justify-end"}>
                                <Button variant={'contained'} color={'success'} type={"submit"}>
                                    Valider
                                </Button>
                            </div>

                            {/*<SnackBar success={successSt}/>

                            <SnackBar error={errorSt}/>*/}

                        </form>

                    </motion.div>

                </div>
            </div>
        </PanelLayout>
    );
}

export default Create;
