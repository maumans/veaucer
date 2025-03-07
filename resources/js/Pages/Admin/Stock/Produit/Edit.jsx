import React, {useEffect} from 'react';
import {Autocomplete, Button, TextareaAutosize, TextField} from "@mui/material";
import {motion} from "framer-motion";

import InputError from "@/Components/InputError";
import {useForm} from "@inertiajs/react";
import Divider from "@mui/material/Divider";
import ReferentielLayout from "@/Layouts/ReferentielLayout.jsx";
import NumberFormatCustomUtils from "@/Pages/Utils/NumberFormatCustomUtils.jsx";
import PanelLayout from "@/Layouts/PanelLayout.jsx";

function Create({auth,typeProduits,categories,fournisseurs,devises,uniteMesures,errors,success,error,produit}) {

    const {data,setData, post, processing}=useForm({
        'id':produit.id,
        'nom':produit.nom,
        'prixAchat':produit.prixAchat,
        'prixVente':produit.prixVente,
        'stockGlobal':produit.stockGlobal,
        'stockMinimal':produit.stockMinimal,
        'image':produit.image,
        'typeProduit':produit.type_produit,
        'categorie':produit.categorie,
        'fournisseur':produit.fournisseur_principal,
        'uniteMesure':produit.unite_mesure,
        'devise':produit.devise,
    });

    const onHandleChange = (e) => {
        e.target.type === 'checkbox'
            ?
            setData(e.target.name,e.target.checked)
            :
            setData(e.target.name,e.target.value);
    };


    function handleSubmit(e) {
        e.preventDefault();
        post(route("admin.produit.store",auth.user.id),{preserveScroll:true})
    }

    return (
        <PanelLayout
            auth={auth}
            active={'stock'}
            sousActive={'produit'}
            breadcrumbs={[
                {
                    text:"Société",
                    href:route("admin.produit.index",auth.user.id),
                    active:false
                },
                {
                    text:"Modification",
                    href:route("admin.produit.edit",[auth.user.id,produit.id]),
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

                                <div>
                                    <Autocomplete
                                        value={data.categorie}
                                        className={"w-full"}
                                        onChange={(e,val)=>setData("categorie",val)}
                                        disablePortal={true}
                                        options={categories}
                                        groupBy={(option) => option.categorie.libelle}
                                        getOptionLabel={(option)=>option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Categorie de produit"} label={params.nom}/>}
                                    />
                                    <InputError message={errors["data.categorie"]}/>
                                </div>


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
                                        value={data.prixVente}
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
                                        value={data.stockGlobal}
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
                                        value={data.stockMinimal}
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
                                        value={data.fournisseur}
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
