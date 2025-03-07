import React, {useEffect} from 'react';
import {Autocomplete, Box, Button, Card, CardContent, FormControlLabel, Grid, MenuItem, Switch, TextareaAutosize, TextField, Typography} from "@mui/material";
import {motion} from "framer-motion";

import InputError from "@/Components/InputError";
import {useForm} from "@inertiajs/react";
import Divider from "@mui/material/Divider";
import ReferentielLayout from "@/Layouts/ReferentielLayout.jsx";
import NumberFormatCustomUtils from "@/Pages/Utils/NumberFormatCustomUtils.jsx";
import PanelLayout from "@/Layouts/PanelLayout.jsx";
import ColorPicker from '@/Components/ColorPicker';

function Create({auth,typeSocietes,errors,success,error,referentiels,configuration, options}) {

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

        modules: configuration.modules || {},
        notifications: configuration.notifications || {},
        security: configuration.security || {},
        payment_methods: configuration.payment_methods || {},
        general: configuration.general || {},

        nomTheme: '',
        couleur_primaire: '#1976d2',
        couleur_secondaire: '#9c27b0',
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
        <PanelLayout
            auth={auth}
            success={success}
            error={error}
            active={'societe'}
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
                            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded shadow"}>
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
                                        size='small'
                                    />
                                    <InputError message={errors.nom} className="mt-2" />
                                </div>

                                <div>
                                    <Autocomplete
                                        className={"w-full"}
                                        onChange={(e,val)=>setData("typeSociete",val)}
                                        disablePortal={true}
                                        options={typeSocietes}
                                        getOptionLabel={(option)=>option.libelle}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Type de societe"} label={params.libelle}/>}
                                        size="small"
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
                                        size='small'
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
                                        size='small'
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
                                        size='small'
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
                                        size='small'
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
                                        size='small'
                                    />
                                    <InputError message={errors.logo} className="mt-2" />
                                </div>
                            </div>

                            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded shadow"}>
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
                                        size='small'
                                        className={"w-full"} label="Solde" name="solde" onChange={onHandleChange}/>
                                    <InputError message={errors.solde}/>
                                </div>
                            </div>

                            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded shadow"}>
                                <div className={"md:col-span-2 text-xl text-orange-500 font-bold"}>
                                    Administrateur de la société
                                </div>
                                <div className={"w-full"}>
                                    <TextField className={"w-full"} label="Prenom" name="prenomAdmin" onChange={onHandleChange} size='small'/>
                                    <InputError message={errors.prenomAdmin}/>
                                </div>

                                <div className={"w-full"}>
                                    <TextField className={"w-full"} label="Nom" name="nomAdmin" onChange={onHandleChange} size='small'/>
                                    <InputError message={errors.nomAdmin}/>
                                </div>

                                <div className={"w-full"}>
                                    <TextField className={"w-full"} label="Adresse" name="adresseAdmin" onChange={onHandleChange} size='small'/>
                                    <InputError message={errors.adresseAdmin}/>
                                </div>

                                <div className={"w-full"}>
                                    <TextField className={"w-full"} label="Telephone" name="telephoneAdmin" onChange={onHandleChange} size='small'/>
                                    <InputError message={errors.telephoneAdmin}/>
                                </div>

                                <div className={"w-full"}>
                                    <TextField className={"w-full"} label="Identifiant" name="login" onChange={onHandleChange} size='small'/>
                                    <InputError message={errors.login}/>
                                </div>

                                <div className={"w-full"}>
                                    <TextField className={"w-full"} label="Email" name="email" onChange={onHandleChange} size='small'/>
                                    <InputError message={errors.email}/>
                                </div>
                                <div className={"w-full"}>
                                    <TextField className={"w-full"} label="Mot de passe" name="password" onChange={onHandleChange} size='small'/>
                                    <InputError message={errors.password}/>
                                </div>
                            </div>

                            <Box>
                                <Typography variant="h6" component="h1" sx={{ mb: 3 }}>
                                    Configuration de la société
                                </Typography>
                                <Grid container spacing={3}>
                                    {/* Modules */}
                                    <Grid item xs={12} md={6}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2 }}>
                                                    Modules
                                                </Typography>
                                                {Object.entries(options.modules_disponibles).map(([key, label]) => (
                                                    <FormControlLabel
                                                        key={key}
                                                        control={
                                                            <Switch
                                                                checked={data.modules[key] || false}
                                                                onChange={(e) =>
                                                                    setData('modules', {
                                                                        ...data.modules,
                                                                        [key]: e.target.checked,
                                                                    })
                                                                }
                                                                size='small'
                                                            />
                                                        }
                                                        label={label}
                                                    />
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    {/* Méthodes de paiement */}
                                    <Grid item xs={12} md={6}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2 }}>
                                                    Méthodes de paiement
                                                </Typography>
                                                {Object.entries(options.methodes_paiement_disponibles).map(([key, label]) => (
                                                    <FormControlLabel
                                                        key={key}
                                                        control={
                                                            <Switch
                                                                checked={data.payment_methods[key] || false}
                                                                onChange={(e) =>
                                                                    setData('payment_methods', {
                                                                        ...data.payment_methods,
                                                                        [key]: e.target.checked,
                                                                    })
                                                                }
                                                                size='small'
                                                            />
                                                        }
                                                        label={label}
                                                    />
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    {/* Paramètres généraux */}
                                    <Grid item xs={12}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2 }}>
                                                    Paramètres généraux
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={4}>
                                                        <TextField
                                                            select
                                                            fullWidth
                                                            label="Langue par défaut"
                                                            value={data.general.default_language || ''}
                                                            onChange={(e) =>
                                                                setData('general', {
                                                                    ...data.general,
                                                                    default_language: e.target.value,
                                                                })
                                                            }
                                                            size='small'
                                                        >
                                                            {Object.entries(options.langues_disponibles).map(([code, name]) => (
                                                                <MenuItem key={code} value={code} size='small'>
                                                                    {name}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <TextField
                                                            select
                                                            fullWidth
                                                            label="Devise"
                                                            value={data.general.currency || ''}
                                                            onChange={(e) =>
                                                                setData('general', {
                                                                    ...data.general,
                                                                    currency: e.target.value,
                                                                })
                                                            }
                                                            size='small'
                                                        >
                                                            {Object.entries(options.devises_disponibles).map(([code, name]) => (
                                                                <MenuItem key={code} value={code} size='small'>
                                                                    {name}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box>
                                <Typography variant="h6" component="h6" sx={{ mb: 3 }}>
                                    Thème par défaut
                                </Typography>

                                <Card>
                                    <CardContent>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={6}>
                                                <ColorPicker
                                                    label="Couleur primaire"
                                                    value={data.couleur_primaire}
                                                    onChange={color => setData('couleur_primaire', color)}
                                                    error={!!errors.couleur_primaire}
                                                    helperText={errors.couleur_primaire}
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <ColorPicker
                                                    label="Couleur secondaire"
                                                    value={data.couleur_secondaire}
                                                    onChange={color => setData('couleur_secondaire', color)}
                                                    error={!!errors.couleur_secondaire}
                                                    helperText={errors.couleur_secondaire}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Box>  


                            <div className={"w-full md:col-span-2 flex gap-2 justify-end"}>
                                <Button variant={'contained'} color={'primary'} type={"submit"}>  
                                    Enregistrer la société
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
