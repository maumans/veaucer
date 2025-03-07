import React, {useEffect} from 'react';
import {Autocomplete, Button, TextareaAutosize, TextField} from "@mui/material";
import {motion} from "framer-motion";

import InputError from "@/Components/InputError";
import {useForm} from "@inertiajs/react";
import Divider from "@mui/material/Divider";
import ReferentielLayout from "@/Layouts/ReferentielLayout.jsx";
import NumberFormatCustomUtils from "@/Pages/Utils/NumberFormatCustomUtils.jsx";
import PanelLayout from "@/Layouts/PanelLayout.jsx";
import formatNumber from '@/Fonctions/FormatNumber';
import unformatNumber from '@/Fonctions/UnFormatNumber';

function Create({auth,typeProduits,typeProduit,categories,fournisseurs,devises,uniteMesures,errors,success,error,referentiels}) {

    const {data,setData, post, processing}=useForm({
        'id':'',
        'nom':'',
        'prixAchat':'',
        'prixVente':'',
        'stockGlobal':'',
        'stockMinimal':'',
        'image':'',
        'typeProduit':typeProduit,
        'categorie':null,
        'fournisseur':null,
        'uniteMesure':null,
        'devise':null,      
        "type":'UNITE',
        "quantite":''
    });

    const onHandleChange = (e) => {
        e.target.type === 'checkbox'
            ?
            setData(e.target.name,e.target.checked)
            :
            setData(e.target.name,e.target.value);
    };

    const onHandleChangeNumber = (e) => {
        setData(e.target.name,formatNumber(e.target.value));
            
    };


    function handleSubmit(e) {
        e.preventDefault();
        post(route("admin.produit.store",auth.user.id),{...data,quantite:unformatNumber(data.quantite)},{preserveScroll:true})
    }

    return (
        <PanelLayout
            auth={auth}
            active={'stock'}
            sousActive={'produit'}
            breadcrumbs={[
                {
                    text:"Produit",
                    href:route("admin.produit.index",auth.user.id),
                    active:false
                },
                {
                    text:"Création",
                    href:route("admin.produit.create",[auth.user.id]),
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
                                    />
                                    <InputError message={errors.nom} className="mt-2" />
                                </div>

                                <div>
                                    <Autocomplete
                                        className={"w-full"}
                                        onChange={(e,val)=>setData("categorie",val)}
                                        disablePortal={true}
                                        options={categories}
                                        getOptionLabel={(option)=>option.libelle}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Categorie de produit"} label={params.libelle}/>}
                                    />
                                    <InputError message={errors["data.categorie"]}/>
                                </div>

                                <div>
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

                                {
                                    data.typeProduit?.nom === "ensemble" ?
                                    <div>
                                        <TextField
                                            value={data.quantite}
                                            autoFocus
                                            id="quantite"
                                            name="quantite"
                                            label="Quantité"
                                            className={'bg-white'}
                                            fullWidth
                                            onChange={onHandleChangeNumber}
                                        />
                                        <InputError message={errors.quantite} className="mt-2" />
                                    </div>
                                    :
                                    null
                                }

                                


                                <div className={"md:col-span-2 mt-8"}>
                                    <TextareaAutosize className={"w-full"} name={"description"} placeholder={"Description"} style={{height:100}} onChange={onHandleChange} autoComplete="description"/>
                                    <InputError message={errors["data.description"]}/>
                                </div>

                            </div>

                            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded"}>
                                <div className={"md:col-span-2 font-bold text-orange-500"}>
                                    Fixation du prix
                                </div>
                                <div className={"w-full"}>
                                    <TextField
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
                                        InputProps={{
                                            inputComponent: NumberFormatCustomUtils,
                                            endAdornment:"GNF",
                                            inputProps:{
                                                max:100000000000,
                                                min:-1000000000000,
                                                name:"prixVente",
                                            },
                                        }}
                                        className={"w-full"} label="Prix de vente" name="prixVente" onChange={onHandleChange}/>
                                    <InputError message={errors.prixVente}/>
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
                                            inputProps:{
                                                max:100000000000,
                                                min:-1000000000000,
                                                name:"stockGlobal",
                                            },
                                        }}
                                        className={"w-full"} label="Stock global" name="stockGlobal" onChange={onHandleChange}/>
                                    <InputError message={errors.stockGlobal}/>
                                </div>

                                <div className={"w-full"}>
                                    <TextField
                                        InputProps={{
                                            inputComponent: NumberFormatCustomUtils,
                                            inputProps:{
                                                max:100000000000,
                                                min:-1000000000000,
                                                name:"stockMinimal",
                                            },
                                        }}
                                        className={"w-full"} label="Stock minimal" name="stockMinimal" onChange={onHandleChange}/>
                                    <InputError message={errors.stockMinimal}/>
                                </div>

                            </div>

                            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded"}>
                                <div className={"md:col-span-2 text-orange-500 font-bold"}>
                                    Image
                                </div>
                                <div className={"w-full"}>
                                    <TextField className={"w-full"} label="Image" name="image" onChange={onHandleChange}/>
                                    <InputError message={errors.image}/>
                                </div>

                            </div>

                            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded"}>
                                <div className={"md:col-span-2 text-orange-500 font-bold"}>
                                    Fournisseur principal
                                </div>
                                <div>
                                    <Autocomplete
                                        className={"w-full"}
                                        onChange={(e,val)=>setData("fournisseur",val)}
                                        disablePortal={true}
                                        options={fournisseurs}
                                        getOptionLabel={(option)=>option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Fournisseur principal"} label={params.nom}/>}
                                    />
                                    <InputError message={errors["data.fournisseur"]}/>
                                </div>

                            </div>



                            <div className={"w-full md:col-span-2 flex gap-2 justify-end"}>
                                <Button variant={'contained'} color={'success'} type={"submit"}>                                    Valider
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
