import React from 'react';

export default function formatNumber(value) {
    // Remplacer les virgules par des points pour gérer les décimales
    let numericValue = value?.toString()?.replace(',', '.');
    // Supprimer tous les caractères sauf les chiffres et le point
    numericValue = numericValue.replace(/[^0-9.]/g, '');

    // Convertir en nombre flottant
    const numberValue = parseFloat(numericValue);

    // Vérifier si la conversion a été réussie avant de formater
    if (isNaN(numberValue)) {
        return ''; // Retourner une chaîne vide si la valeur n'est pas un nombre valide
    }

    // Formater avec espaces comme séparateurs de milliers et point pour les décimales
    return numberValue.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 20 }).replace(',', '.');
}
