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

function Create({ auth, typeProduits, categories, fournisseurs, devises, uniteMesures, errors, success, error, referentiels }) {

    const { data, setData, post, processing } = useForm({
        'nom': '',
        'description': '',
        'stockGlobal': '',
        'stockCritique': '',
        'seuilMaximal': '',
        'prixAchat': '',
        'prixVente': '',
        'quantiteEnsemble': '',
        'prixEnsemble': '',
        'categorie': null,
        'fournisseurPrincipal': null,
        'uniteMesure': null,
        'devise': null,
    });

    // Les hooks useEffect pour typeProduitAchat et typeProduitVente ont été supprimés
    // car nous avons simplifié la structure de la table produits

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
        post(route("admin.stock.produit.store", auth.user.id), { ...data, quantiteAchat: unformatNumber(data.quantiteAchat), quantiteVente: unformatNumber(data.quantiteVente) }, { preserveScroll: true })
    }

    return (
        <PanelLayout
            auth={auth}
            active={'stock'}
            sousActive={'produit'}
            breadcrumbs={[
                {
                    text: "Produit",
                    href: route("admin.stock.produit.index", auth.user.id),
                    active: false
                },
                {
                    text: "Création",
                    href: route("admin.stock.produit.create", [auth.user.id]),
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
                                onClick={() => router.get(route('admin.stock.produit.index', auth.user.id))}
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
                                    Options d'achat et vente par défaut
                                </div>

                                <div className="">
                                    <TextField
                                        InputProps={{
                                            inputComponent: NumberFormatCustomUtils,
                                            endAdornment: "GNF",
                                            inputProps: {
                                                name: "prixAchat",
                                                value: data.prixAchat,
                                                max: 100000000000,
                                                min: 0,
                                            }
                                        }}
                                        className={"w-full"} label="Prix unitaire d'achat" name="prixAchat" onChange={onHandleChange} size='small'/>
                                    <InputError message={errors.prixAchat} />
                                </div>

                                <div className="">
                                    <TextField
                                        InputProps={{
                                            inputComponent: NumberFormatCustomUtils,
                                            endAdornment: "GNF",
                                            inputProps: {
                                                name: "prixVente",
                                                value: data.prixVente,
                                                max: 100000000000,
                                                min: 0,
                                            }
                                        }}
                                        className={"w-full"} label="Prix unitaire de vente" name="prixVente" onChange={onHandleChange} size='small' />
                                    <InputError message={errors.prixVente} />
                                </div>

                                <div className="">
                                    <TextField
                                        InputProps={{
                                            inputComponent: NumberFormatCustomUtils,
                                            inputProps: {
                                                name: "quantiteEnsemble",
                                                value: data.quantiteEnsemble,
                                                max: 100000000000,
                                                min: 0,
                                            }
                                        }}
                                        className={"w-full"} label="Quantité par ensemble" name="quantiteEnsemble" onChange={onHandleChange} size='small' />
                                    <InputError message={errors.quantiteEnsemble} />
                                </div>

                                <div className="">
                                    <TextField
                                        InputProps={{
                                            inputComponent: NumberFormatCustomUtils,
                                            endAdornment: "GNF",
                                            inputProps: {
                                                name: "prixEnsemble",
                                                value: data.prixEnsemble,
                                                max: 100000000000,
                                                min: 0,
                                            }
                                        }}
                                        className={"w-full"} label="Prix par ensemble" name="prixEnsemble" onChange={onHandleChange} size='small' />
                                    <InputError message={errors.prixEnsemble} />
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
                                                min: 0,
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
                                                min: 0,
                                                name: "stockCritique",
                                            },
                                        }}
                                        className={"w-full"} label="Stock critique" name="stockCritique" onChange={onHandleChange} size="small" />
                                    <InputError message={errors.stockCritique} />
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
