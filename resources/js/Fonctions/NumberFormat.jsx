export default function NumberFormatCurrency(number,currency) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: currency || 'GNF' }).format(
        number,
    )
}
