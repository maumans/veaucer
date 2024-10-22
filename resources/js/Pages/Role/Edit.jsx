import React, {useEffect, useMemo, useState} from 'react';
import Authenticated from "@/Layouts/AuthenticatedLayout.jsx";
import {Link, router, useForm} from "@inertiajs/react";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import { MRT_Localization_FR } from 'material-react-table/locales/fr';
import {
    Add,
    AddCircle,
    Check,
    Close,
    Delete,
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

function Edit({auth,role,error,errors,success,permissions,total,actif,inactif}) {

    const {data,setData,post, put, reset} = useForm(
        {
            'id':role.id,
            'slug':role.slug,
            'name':role.name,
            'libelle':role.libelle,
            'permissions':[],
        }
    )

    const handleChange = (e) => {
        e.target.type === 'checkbox'
            ?
            setData(e.target.name,e.target.checked)
            :
            setData(e.target.name,e.target.value);
    };

    const handleChangeCheckbox = (e) => {
        setData("permissions",[
            ...data.permissions.filter((p)=>p.id !== e.target.name),
            {
                id:e.target.name,
                status:e.target.checked
            }
        ])
    };

    const handleSubmit = () => {
        put(route('role.update',role.id),{
            onSuccess:()=> {
                reset()
            },
        })
    };

    return (
        <PanelLayout
            auth={auth}
            success={success}
            error={error}
            active={'role'}
            breadcrumbs={[
                {
                    text:"Role",
                    href:route("role.index"),
                    active:false
                },
                {
                    text:"Modification",
                    href:route("role.edit",[auth.user.id]),
                    active:true
                }
            ]}
        >

            <div className={"grid gap-2 w-full mb-20"}>
                <div className={'flex gap-2'}>
                    <div className={"w-full flex lg:hidden primaryBgColor p-1 font-bold text-white rounded"}>
                        Gestion des roles
                    </div>
                </div>
                <div className={"grid grid-cols-3 gap-4 w-full"}>
                    <div className={"primaryBgColor text-white p-2 rounded"}>
                        <div className={'text-3xl font-bold'}>
                            {
                                total
                            }
                        </div>
                        <div>roles</div>

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
                <form onSubmit={handleSubmit}>
                    <div className={'grid sm:grid-cols-2 grid-cols-1 bg-gray-50 gap-5 p-2 rounded'}>
                        <div>
                            <TextField
                                value={data.name}
                                autoFocus
                                id="name"
                                name="name"
                                label="Nom"
                                className={'bg-white'}
                                fullWidth
                                onChange={handleChange}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div>
                            <TextField
                                value={data.libelle}
                                id="libelle"
                                name="libelle"
                                label="Libellé"
                                className={'bg-white'}
                                fullWidth
                                onChange={handleChange}
                            />
                            <InputError message={errors.libelle} className="mt-2" />
                        </div>
                    </div>
                    <div className={"bg-white mt-10"}>
                        <div className={"flex p-2 rounded font-bold text-xl"}>
                            Sélectionnez les permissions
                        </div>

                        <div className={"flex gap-10 flex-wrap p-2 rounded"}>
                            {
                                permissions.map((permission,index) =>(
                                    <div className={'grid gap-5'} key={index}>
                                        <div className={"capitalize font-bold primaryColor"}>
                                                {
                                                    permission.groupe
                                                }
                                            </div>
                                        <div className={'flex flex-wrap gap-2'}>
                                            {
                                                permission.liste?.map((permission,index) =>(
                                                    <span key={index} className={"rounded border px-1"}>
                                                        <Checkbox defaultChecked={!!role.permissions.find((per)=>(permission.id===per.id))} onClick={handleChangeCheckbox} name={permission.id+''}/> {permission.libelle}
                                                    </span>
                                                ))
                                            }
                                        </div>

                                    </div>
                                ))
                            }
                        </div>

                    </div>

                    <div className={'mt-5'}>
                        <Button variant={'contained'} color={'success'} onClick={handleSubmit}>Enregistrer</Button>
                    </div>
                </form>

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

export default Edit;
