import React, { useEffect } from 'react';
import { Autocomplete, Button, TextareaAutosize, TextField } from "@mui/material";
import { motion } from "framer-motion";
import { ArrowBack } from "@mui/icons-material";

import InputError from "@/Components/InputError";
import { router, useForm } from "@inertiajs/react";
import Divider from "@mui/material/Divider";
import ReferentielLayout from "@/Layouts/ReferentielLayout.jsx";
import NumberFormatCustomUtils from "@/Pages/Utils/NumberFormatCustomUtils.jsx";
import PanelLayout from "@/Layouts/PanelLayout.jsx";
import formatNumber from '@/Fonctions/FormatNumber';
import unformatNumber from '@/Fonctions/UnFormatNumber';

function Create({ auth, typeProduits, typeProduitAchat, typeProduitVente, categories, fournisseurs, devises, uniteMesures, errors, success, error, referentiels }) {

    const { data, setData, post, processing } = useForm({
        'nom': '',
        'prixAchat': '',
        'prixVente': '',
        'stockGlobal': '',
        'seuilMinimal': '',
        //'image':'',
        'typeProduitAchat': typeProduitAchat,
        "quantiteAchat": '',
        'typeProduitVente': typeProduitVente,
        "quantiteVente": '',
        'categorie': null,
        'fournisseur': null,
        'uniteMesure': null,
        'devise': null,
    });

    useEffect(()=>{
        if(typeProduitAchat?.nom === "unité"){
            setData("quantiteAchat", 1);
        }
    },[typeProduitAchat])

    useEffect(()=>{
        if(typeProduitVente?.nom === "unité"){
            setData("quantiteVente", 1);
        }
    },[typeProduitVente])

    const onHandleChange = (e) => {
        e.target.type === 'checkbox'
            ?
            setData(e.target.name, e.target.checked)
            :
            setData(e.target.name, e.target.value);
    };

    const onHandleChangeNumber = (e) => {
        setData(e.target.name, formatNumber(e.target.value));

    };


    function handleSubmit(e) {
        e.preventDefault();
        post(route("admin.produit.store", auth.user.id), { ...data, quantiteAchat: unformatNumber(data.quantiteAchat), quantiteVente: unformatNumber(data.quantiteVente) }, { preserveScroll: true })
    }

    return (
        <PanelLayout
            auth={auth}
            active={'stock'}
            sousActive={'produit'}
            breadcrumbs={[
                {
                    text: "Produit",
                    href: route("admin.produit.index", auth.user.id),
                    active: false
                },
                {
                    text: "Création",
                    href: route("admin.produit.create", [auth.user.id]),
                    active: true
                }
            ]}
        >
            <div>
                <div className="w-full">
                    <div className="p-4 bg-white rounded mb-4">
                        <div className="flex justify-between items-center">
                            <div className="bg-black w-fit p-2 rounded text-xl font-bold text-white">
                                <h2>Nouveau produit</h2>
                            </div>
                            <Button 
                                variant={'outlined'} 
                                startIcon={<ArrowBack />}
                                onClick={() => router.get(route('admin.produit.index', auth.user.id))}
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
                                <div className={"md:col-span-2 text-orange-500 font-bold"}>
                                    Infos de base
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
                                        onChange={onHandleChange}
                                        size="small"
                                    />
                                    <InputError message={errors.nom} className="mt-2" />
                                </div>

                                <div>
                                    <Autocomplete
                                        className={"w-full"}
                                        onChange={(e, val) => setData("categorie", val)}
                                        disablePortal={true}
                                        options={categories}
                                        getOptionLabel={(option) => option.libelle}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => <TextField fullWidth {...params} placeholder={"Categorie de produit"} label={params.libelle} size='small'/>}
                                    />
                                    <InputError message={errors["data.categorie"]} />
                                </div>

                                <div className={"md:col-span-2 mt-8"}>
                                    <TextareaAutosize className={"w-full"} name={"description"} placeholder={"Description"} style={{ height: 100 }} onChange={onHandleChange} autoComplete="description" />
                                    <InputError message={errors["data.description"]} />
                                </div>

                            </div>

                            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded"}>
                                <div className={"md:col-span-2 font-bold text-orange-500"}>
                                    Options d'achat
                                </div>

                                <div>
                                    <Autocomplete
                                        value={data.typeProduitAchat}
                                        className={"w-full"}
                                        onChange={(e, val) => setData("typeProduitAchat", val)}
                                        disablePortal={true}
                                        options={typeProduits}
                                        getOptionLabel={(option) => option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => <TextField fullWidth {...params} placeholder={"Type de produit"} label={params.nom} size="small" />}
                                    />
                                    <InputError message={errors["data.typeProduitAchat"]} />
                                </div>

                                {
                                    data.typeProduitAchat?.nom === "ensemble" ?
                                        <div>
                                            <TextField
                                                value={data.quantiteAchat}
                                                id="quantiteAchat"
                                                name="quantiteAchat"
                                                label="Quantité"
                                                className={'bg-white'}
                                                fullWidth
                                                onChange={onHandleChangeNumber}
                                                size="small"
                                            />
                                            <InputError message={errors.quantiteAchat} className="mt-2" />
                                        </div>
                                        :
                                        null
                                }

                                <div className={"w-full"}>
                                    <TextField
                                        InputProps={{
                                            inputComponent: NumberFormatCustomUtils,
                                            endAdornment: "GNF",
                                            inputProps: {
                                                max: 100000000000,
                                                min: -1000000000000,
                                                name: "prixAchat",
                                            },
                                        }}
                                        className={"w-full"} label={`Prix d'achat ${data.typeProduitAchat?.nom === "unité" ? "unitaire" : "total"}`} name="prixAchat" onChange={onHandleChange} size='small'/>
                                    <InputError message={errors.prixAchat} />
                                </div>
                            </div>

                            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded"}>
                                <div className={"md:col-span-2 font-bold text-orange-500"}>
                                    Options de vente
                                </div>

                                <div>
                                    <Autocomplete
                                        value={data.typeProduitVente}
                                        className={"w-full"}
                                        onChange={(e, val) => setData("typeProduitVente", val)}
                                        disablePortal={true}
                                        options={typeProduits}
                                        getOptionLabel={(option) => option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => <TextField fullWidth {...params} placeholder={"Type de produit"} label={params.nom} size="small" />}
                                    />
                                    <InputError message={errors["data.typeProduitVente"]} />
                                </div>

                                {
                                    data.typeProduitVente?.nom === "ensemble" ?
                                        <div>
                                            <TextField
                                                value={data.quantiteVente}
                                                id="quantiteVente"
                                                name="quantiteVente"
                                                label="Quantité"
                                                className={'bg-white'}
                                                fullWidth
                                                onChange={onHandleChangeNumber}
                                                size="small"
                                            />
                                            <InputError message={errors.quantiteVente} className="mt-2" />
                                        </div>
                                        :
                                        null
                                }

                                <div className={"w-full"}>
                                    <TextField
                                        InputProps={{
                                            inputComponent: NumberFormatCustomUtils,
                                            endAdornment: "GNF",
                                            inputProps: {
                                                max: 100000000000,
                                                min: -1000000000000,
                                                name: "prixVente",
                                            },
                                        }}
                                        className={"w-full"} label={`Prix de vente ${data.typeProduitVente?.nom === "unité" ? "unitaire" : "total"}`} name="prixVente" onChange={onHandleChange} size='small' />
                                    <InputError message={errors.prixVente} />
                                </div>
                            </div>

                            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded"}>
                                <div className={"md:col-span-2 font-bold text-orange-500"}>
                                    Stock principal
                                </div>
                                <div className={"w-full"}>
                                    <TextField
                                        InputProps={{
                                            inputComponent: NumberFormatCustomUtils,
                                            inputProps: {
                                                max: 100000000000,
                                                min: -1000000000000,
                                                name: "stockGlobal",
                                            },
                                        }}
                                        className={"w-full"} label="Stock global" name="stockGlobal" onChange={onHandleChange} size="small" />
                                    <InputError message={errors.stockGlobal} />
                                </div>

                                <div className={"w-full"}>
                                    <TextField
                                        InputProps={{
                                            inputComponent: NumberFormatCustomUtils,
                                            inputProps: {
                                                max: 100000000000,
                                                min: -1000000000000,
                                                name: "seuilMinimal",
                                            },
                                        }}
                                        className={"w-full"} label="Seuil minimal" name="seuilMinimal" onChange={onHandleChange} size="small" />
                                    <InputError message={errors.seuilMinimal} />
                                </div>

                            </div>

                            {/* <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded"}>
                                <div className={"md:col-span-2 text-orange-500 font-bold"}>
                                    Image
                                </div>
                                <div className={"w-full"}>
                                    <TextField className={"w-full"} label="Image" name="image" onChange={onHandleChange}/>
                                    <InputError message={errors.image}/>
                                </div>

                            </div> */}

                            {/* <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded"}>
                                <div className={"md:col-span-2 text-orange-500 font-bold"}>
                                    Fournisseur principal
                                </div>
                                <div>
                                    <Autocomplete
                                        className={"w-full"}
                                        onChange={(e, val) => setData("fournisseur", val)}
                                        disablePortal={true}
                                        options={fournisseurs}
                                        getOptionLabel={(option) => option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => <TextField fullWidth {...params} placeholder={"Fournisseur principal"} label={params.nom} size="small" />}
                                    />
                                    <InputError message={errors["data.fournisseur"]} />
                                </div>

                            </div> */}



                            <div className={"w-full md:col-span-2 flex gap-2 justify-end"}>
                                <Button variant={'contained'} color={'success'} type={"submit"} size="small">
                                    Valider
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
