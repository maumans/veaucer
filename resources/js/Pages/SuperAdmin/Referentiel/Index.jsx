import React, {useEffect, useState} from 'react';
import PanelLayout from "@/Layouts/PanelLayout.jsx";
import ReferentielLayout from "@/Layouts/ReferentielLayout.jsx";
import {Search} from "@mui/icons-material";
import {Button} from "@mui/material";
import {router} from "@inertiajs/react";

function Index({auth,errors,referentiels,active}) {

    const [nom,setNom] = useState('')

    return (
        <PanelLayout
           auth={auth}
           errors={errors}
           active={'referentiel'}
        >

            <div className={'grid gap-1 bg-gray-100 rounded-t-xl'}>
                <div className={'w-full bg-black rounded-t-xl flex items-center p-2 gap-5'}>
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

                <div className={'flex gap-2 flex-wrap p-2'}>
                    {
                        referentiels.map((referentiel)=>(
                            ((referentiel.nom.toLowerCase().indexOf(nom.toLowerCase()) !== -1) || (referentiel.route.toLowerCase().indexOf(nom.toLowerCase()) !== -1))
                            &&
                            <Button key={referentiel.id} onClick={()=>(
                                router.get(route(referentiel.route,auth.user.id))
                            )} color={"warning"}  variant={active?'outlined':'contained'} sx={{borderRadius:8}} className={' rounded-full bg-white border border-blue-600 text-blue-600'}>
                                {referentiel.nom}
                            </Button>
                        ))
                    }
                </div>
            </div>

        </PanelLayout>
    );
}

export default Index;
