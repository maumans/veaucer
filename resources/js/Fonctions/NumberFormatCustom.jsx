import React, {useEffect} from 'react';
import {NumericFormat} from "react-number-format";
import TextField from '@mui/material/TextField'; // Assurez-vous d'importer correctement votre TextField

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
        <NumericFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.floatValue !== undefined ? values.floatValue : '',
                    },
                });
            }}
            thousandSeparator=" "
            decimalSeparator=","
            allowNegative={true} // Pour autoriser les nombres négatifs si nécessaire
            isAllowed={(values) => {
                const { floatValue } = values;
                return (
                    ((props.min ? floatValue >= props.min : floatValue >= 0) &&
                        floatValue <= props.max) ||
                    floatValue === undefined
                );
            }}

            suffix={props.devise==="eur"?" €":props.devise==="usd"?" $":props.devise==="%"?" %" :props.devise===" "?"":props.devise==="uv"?"":""

            }
        />
    );
});

export default NumberFormatCustom;
