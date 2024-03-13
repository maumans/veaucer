import React, {useEffect} from 'react';
import {Autocomplete, Button, TextareaAutosize, TextField} from "@mui/material";
import {motion} from "framer-motion";

import InputError from "@/Components/InputError";
import {useForm} from "@inertiajs/react";
import Divider from "@mui/material/Divider";
import ReferentielLayout from "@/Layouts/ReferentielLayout.jsx";
import NumberFormatCustomUtils from "@/Pages/Utils/NumberFormatCustomUtils.jsx";

function Create({auth,typeSocietes,errors,success,error,referentiels}) {

    const {data,setData, post, processing}=useForm({
        "nom":"",
        'telephone1':'',
        'telephone2':'',
        'adresseMail':'',
        'description':'',
        'logo':'',
        'typeSociete':null,
        "nomAdmin":"",
        "prenomAdmin":"",
        "adresseAdmin":"",
        "telephoneAdmin":"",
        "login":"",
        "email":"",
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
        post(route("superAdmin.societe.store",auth.user.id),{preserveScroll:true})
    }

    return (
        <ReferentielLayout
            success={success}
            error={error}
            auth={auth}
            errors={errors}
            referentiels={referentiels}
            referentiel={'Société'}
            active={'referentiel'}
            sousActive={'superAdmin.societe.create'}
            breadcrumbs={[
                {
                    text:"Société",
                    href:route("superAdmin.societe.index",auth.user.id),
                    active:false
                },
                {
                    text:"Création",
                    href:route("superAdmin.societe.create",[auth.user.id]),
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
                                <div className={"md:col-span-2 text-xl text-orange-500 font-bold"}>
                                    Société
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
                                        onChange={(e,val)=>setData("typeSociete",val)}
                                        disablePortal={true}
                                        options={typeSocietes}
                                        getOptionLabel={(option)=>option.nom}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Type de societe"} label={params.nom}/>}
                                    />
                                    <InputError message={errors["data.typeSociete"]}/>
                                </div>

                                <div>
                                    <TextField
                                        value={data.adresse}
                                        id="adresse"
                                        name="adresse"
                                        label="Adresse"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={onHandleChange}
                                    />
                                    <InputError message={errors.adresse} className="mt-2" />
                                </div>

                                <div>
                                    <TextField
                                        value={data.telephone1}
                                        id="telephone1"
                                        name="telephone1"
                                        label="Tel"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={onHandleChange}
                                    />
                                    <InputError message={errors.telephone1} className="mt-2" />
                                </div>

                                <div>
                                    <TextField
                                        value={data.telephone2}
                                        id="telephone2"
                                        name="telephone2"
                                        label="Tel 2"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={onHandleChange}
                                    />
                                    <InputError message={errors.telephone2} className="mt-2" />
                                </div>

                                <div>
                                    <TextField
                                        value={data.adresseMail}
                                        type="mail"
                                        id="adresseMail"
                                        name="adresseMail"
                                        label="Adresse mail"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={onHandleChange}
                                    />
                                    <InputError message={errors.adresseMail} className="mt-2" />
                                </div>

                                <div className={"md:col-span-2 mt-8"}>
                                    <TextareaAutosize className={"w-full"} name={"description"} placeholder={"Description"} style={{height:100}} onChange={onHandleChange} autoComplete="description"/>
                                    <InputError message={errors["data.description"]}/>
                                </div>

                                <div>
                                    <TextField
                                        value={data.logo}
                                        id="logo"
                                        name="logo"
                                        label="logo"
                                        className={'bg-white'}
                                        fullWidth
                                        onChange={onHandleChange}
                                    />
                                    <InputError message={errors.logo} className="mt-2" />
                                </div>
                            </div>

                            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded"}>
                                <div className={"md:col-span-2 font-bold text-orange-500"}>
                                    Solde
                                </div>
                                <div className={"w-full"}>
                                    <TextField
                                        InputProps={{
                                            inputComponent: NumberFormatCustomUtils,
                                            inputProps:{
                                                max:100000000000,
                                                min:-1000000000000,
                                                name:"solde",
                                            },
                                        }}
                                        className={"w-full"} label="Solde" name="solde" onChange={onHandleChange}/>
                                    <InputError message={errors.solde}/>
                                </div>
                            </div>

                            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded"}>
                                <div className={"md:col-span-2 text-xl text-orange-500 font-bold"}>
                                    Administrateur de la société
                                </div>
                                <div className={"w-full"}>
                                    <TextField className={"w-full"} label="Prenom" name="prenomAdmin" onChange={onHandleChange}/>
                                    <InputError message={errors.prenomAdmin}/>
                                </div>

                                <div className={"w-full"}>
                                    <TextField className={"w-full"} label="Nom" name="nomAdmin" onChange={onHandleChange}/>
                                    <InputError message={errors.nomAdmin}/>
                                </div>

                                <div className={"w-full"}>
                                    <TextField className={"w-full"} label="Adresse" name="adresseAdmin" onChange={onHandleChange}/>
                                    <InputError message={errors.adresseAdmin}/>
                                </div>

                                <div className={"w-full"}>
                                    <TextField className={"w-full"} label="Telephone" name="telephoneAdmin" onChange={onHandleChange}/>
                                    <InputError message={errors.telephoneAdmin}/>
                                </div>

                                <div className={"w-full"}>
                                    <TextField className={"w-full"} label="Identifiant" name="login" onChange={onHandleChange}/>
                                    <InputError message={errors.login}/>
                                </div>

                                <div className={"w-full"}>
                                    <TextField className={"w-full"} label="Email" name="email" onChange={onHandleChange}/>
                                    <InputError message={errors.email}/>
                                </div>
                                <div className={"w-full"}>
                                    <TextField className={"w-full"} label="Mot de passe" name="password" onChange={onHandleChange}/>
                                    <InputError message={errors.password}/>
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
        </ReferentielLayout>
    );
}

export default Create;
