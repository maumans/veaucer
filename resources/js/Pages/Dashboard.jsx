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
            active={'superAdminDashboard'}
        >

            <div className={'grid gap-1 bg-gray-100 rounded-t-xl'}>
                <div>
                    Tableau de bord
                </div>
            </div>

        </PanelLayout>
    );
}

export default Index;
