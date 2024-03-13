import React from 'react';
import {formatNumber} from "chart.js/helpers";

function ColorIconCard({id,title,icon,color,montant}) {
    return (
        <div key={id} className={`rounded p-5 text-white sm:grid flex justify-between flex-wrap gap-2  bg-${color}`}>
            <div className={'flex gap-5'}>
                <div className={`rounded-full w-fit h-fit bg-white p-1 text-${color}`}>
                    {
                        icon
                    }
                </div>
                <div>
                    {
                        title.toUpperCase()
                    }
                </div>
            </div>

            <div className={'flex gap-1 border-2 p-2 rounded w-fit'}>
                <div className={'lg:text-3xl text-xl font-bold'}>
                    {
                        formatNumber(montant)
                    }
                </div>
                <div className={'self-end'}>
                    GNF
                </div>
            </div>
        </div>

    );
}

export default ColorIconCard;
