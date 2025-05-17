import React from "react";
import { NumericFormat } from "react-number-format";

const NumberFormatCustomUtils = React.forwardRef(function NumberFormatCustom(props, ref) {
    const { onChange, endAdornment, ...other } = props;

    // Définir des valeurs par défaut pour min et max si elles ne sont pas fournies
    const min = props.min !== undefined ? props.min : Number.MIN_SAFE_INTEGER;
    const max = props.max !== undefined ? props.max : Number.MAX_SAFE_INTEGER;

    // Déterminer le suffixe en fonction de endAdornment
    let suffix = '';
    if (endAdornment) {
        suffix = ` ${endAdornment}`;
    } else if (props.devise) {
        switch (props.devise.toLowerCase()) {
            case 'eur':
                suffix = ' €';
                break;
            case 'usd':
                suffix = ' $';
                break;
            case '%':
                suffix = ' %';
                break;
            case 'gnf':
                suffix = ' GNF';
                break;
            default:
                suffix = '';
        }
    }

    return (
        <NumericFormat
            isAllowed={(values) => {
                const { floatValue } = values;
                return (floatValue === undefined || (floatValue >= min && floatValue <= max));
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
            suffix={suffix}
            valueIsNumericString={true}
        />
    );
});

export default NumberFormatCustomUtils;
