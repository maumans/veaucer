import React, {useEffect, useRef, useState} from 'react';
import PanelLayout from "@/Layouts/PanelLayout.jsx";
import {Dataset, ListAlt, Search, Storage} from "@mui/icons-material";
import {Autocomplete, Button, InputAdornment, TextField} from "@mui/material";
import {router} from "@inertiajs/react";
import AOS from 'aos';
import 'aos/dist/aos.css';

function ReferentielLayout({auth,errors,children,referentiels,referentiel,active,sousActive,breadcrumbs,error,success}) {

    const [nom,setNom] = useState('')

    return (
        <PanelLayout
            success={success}
            error={error}
            auth={auth}
            errors={errors}
            active={active || 'referentiel'}
            breadcrumbs={breadcrumbs}
        >
            <div className={'grid gap-1 bg-gray-100 {/*rounded-t-xl*/}'}>
                <div className={'w-full bg-black rounded-t-xl md:flex items-center p-2 gap-5 hidden'}>
                    {/*<div className={'text-2xl text-blue-600 font-bold'}>
                        Referentiels
                    </div>*/}

                    <div className={'flex items-center gap-2 bg-gray-100 rounded border'}>
                        <input
                            value={nom}
                            placeholder="Entrez un référentiel"
                            size="small"
                            className={'h-fit'}
                            style={{border:'none'}}
                            onChange={(e)=>setNom(e.target.value)}
                        />
                        <Search className={'text-gray-500'}/>

                    </div>
                </div>

                <div className={'flex gap-2 flex-wrap p-2 md:hidden bg-white'}>
                    <Autocomplete
                        className={'w-full'}
                        defaultValue={referentiels?.find(ref=>ref.nom === referentiel)}
                        name="referentielSt"
                        disableClearable
                        options={referentiels}
                        isOptionEqualToValue={(option,value)=>(option.id===value.id)}
                        onChange={(e, newValue) => {
                            router.get(route(newValue.route,auth.user.id))
                        }}
                        getOptionLabel={(option)=>option.nom}
                        renderInput={(params) => <TextField {...params} label={params.nom} />}
                    />
                </div>

                <div className={'md:flex hidden gap-2 flex-wrap p-2'}>
                    {
                        referentiels.map((ref)=>(
                            ((ref.nom.toLowerCase().indexOf(nom.toLowerCase()) !== -1) || (ref.route.toLowerCase().indexOf(nom.toLowerCase()) !== -1))
                            &&
                            <Button key={ref.id} onClick={()=>(
                                router.get(route(ref.route,auth.user.id))
                            )} style={{maxHeight: '25px',fontSize:10}} color={"warning"}  variant={referentiel===ref.nom?'outlined':'contained'} sx={{borderRadius:8}} className={' rounded-full bg-white border border-blue-600 text-blue-600'}>
                                 {ref.nom}
                            </Button>
                        ))
                    }
                </div>

                <div className={'p-2 mb-32'}>
                    {children}
                </div>
            </div>

        </PanelLayout>
    );
}

export default ReferentielLayout;
