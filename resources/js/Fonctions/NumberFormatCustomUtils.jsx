import React, {useEffect} from "react";
import {NumericFormat} from "react-number-format";

const NumberFormatCustomUtils = React.forwardRef(function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
        <NumericFormat
            isAllowed={(values) => {
                const {floatValue} = values;
                return ((floatValue >= props.min &&  floatValue <= props.max) || floatValue === undefined);
            }}
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator=" "
            decimalSeparator="."

            suffix={props.devise==="eur"?" €":props.devise==="usd"?" $":props.devise==="%"?" %":props.devise==="GNF"?" GNF":''

            }
        />
    );
});

export default NumberFormatCustomUtils;

/*import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";

const NumberFormatCustomUtils = React.forwardRef(function NumberFormatCustom(
    props,
    ref
) {
    const { value, onChange, ...other } = props;
    const [formattedValue, setFormattedValue] = useState(value);

    useEffect(() => {
        setFormattedValue(value);
    }, [value]);

    return (
        <NumericFormat
            isAllowed={(values) => {
                const { floatValue } = values;
                return (
                    (floatValue >= props.min && floatValue <= props.max) ||
                    floatValue === undefined
                );
            }}
            {...other}
            getInputRef={ref}
            value={formattedValue} // Utilisez la valeur formatée ici
            onValueChange={(values) => {
                setFormattedValue(values.value);
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator=" "
            decimalSeparator="."
            suffix={
                props.devise === "eur"
                    ? " €"
                    : props.devise === "usd"
                        ? " $"
                        : props.devise === "%"
                            ? " %"
                            : props.devise === "GNF"
                                ? " GNF"
                                : ""
            }
        />
    );
});

export default NumberFormatCustomUtils;*/

