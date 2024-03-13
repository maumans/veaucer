import React, {useEffect, useState} from 'react';
import PanelLayout from "@/Layouts/PanelLayout.jsx";
import {AccountBalance, AddCard, Block, CurrencyExchange, MoneyOff, Widgets} from "@mui/icons-material";
import {formatNumber} from "chart.js/helpers";
import MenuIcon from "@mui/icons-material/Menu";
import ColorIconCard from "@/Components/Card/ColorIconCard.jsx";

function Index({auth,errors}) {

    const restes=[
        {
            id: 1,
            icon:<CurrencyExchange/>,
            title:"Argent",
            montant:100000000,
            color:'orange-500'
        },
        {
            id: 2,
            icon:<Widgets/>,
            title:"Produits",
            montant:54900000,
            color:'green-500'
        },
        {
            id: 3,
            icon:<AddCard/>,
            title:"Créances",
            montant:77800000,
            color:'red-500'
        },
        {
            id: 4,
            icon:<MoneyOff/>,
            title:"Dettes",
            montant:5620000,
            color:'purple-500'
        },
        {
            id: 5,
            icon:<AccountBalance/>,
            title:"Total capitaux propres",
            montant:77800000-5620000+54900000,
            color:'pink-500'
        },

    ]

    const debut=[
        {
            id: 1,
            icon:<CurrencyExchange/>,
            title:"Ventes",
            montant:600000,
            color:'indigo-500'
        },
        {
            id: 2,
            icon:<Widgets/>,
            title:"Profits",
            montant:100000,
            color:'gray-500'
        },
        {
            id: 3,
            icon:<AddCard/>,
            title:"Paiements",
            montant:300000,
            color:'yellow-500'
        },
    ]

    return (
        <PanelLayout
            auth={auth}
            errors={errors}
            active={'adminDashboard'}
        >

            <div className={'grid gap-5'}>
                <div className={'grid gap-2 bg-gray-100 rounded-t-xl p-2'}>
                    <div className={"text-xl font-bold text-orange-500 border border-orange-500 p-2 w-fit rounded"}>
                        RESTES
                    </div>
                    <div className={'grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2'}>
                        {
                            restes.map(({icon,title,montant,color,id})=>(
                                <ColorIconCard id={id} icon={icon} color={color} montant={montant} title={title} />                            ))
                        }

                    </div>
                </div>

                <div className={'grid gap-1 bg-gray-100 rounded-t-xl p-2'}>
                    <div className={"text-xl font-bold p-2 text-orange-500 border border-orange-500 w-fit rounded"}>
                        Dès le début du mois
                    </div>
                    <div className={'grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2'}>
                        {
                            debut.map(({icon,title,montant,color,id})=>(
                                <ColorIconCard id={id} icon={icon} color={color} montant={montant} title={title} />
                                ))
                        }

                    </div>
                </div>
            </div>

        </PanelLayout>
    );
}

export default Index;
