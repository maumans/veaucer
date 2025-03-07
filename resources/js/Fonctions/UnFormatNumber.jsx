export default function unformatNumber(value) {
    // Supprimer les espaces (séparateurs de milliers en français)
    const numericValue = value?.toString()?.replace(/\s/g, '').replace(/,/, '.');
    // Convertir en nombre
    return parseFloat(numericValue);
}
