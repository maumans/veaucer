export const validateConfiguration = (data) => {
    const errors = {};

    // Validation des moyens de paiement
    if (data.payment_methods) {
        if (data.payment_methods.orange_money_enabled) {
            if (!data.payment_methods.orange_money_numbers?.length) {
                errors.orange_money_numbers = 'Au moins un numéro Orange Money est requis';
            }
            if (!data.payment_methods.orange_money_merchant_code) {
                errors.orange_money_merchant_code = 'Le code marchand Orange Money est requis';
            }
        }
        if (data.payment_methods.momo_enabled) {
            if (!data.payment_methods.momo_numbers?.length) {
                errors.momo_numbers = 'Au moins un numéro Mobile Money est requis';
            }
            if (!data.payment_methods.momo_merchant_code) {
                errors.momo_merchant_code = 'Le code marchand Mobile Money est requis';
            }
        }
    }

    // Validation des informations générales
    if (data.general) {
        // Validation du NIF (format guinéen)
        if (data.general.nif && !/^\d{9}[A-Z]$/.test(data.general.nif)) {
            errors.nif = 'Le NIF doit contenir 9 chiffres suivis d\'une lettre majuscule';
        }

        // Validation du RCCM (format guinéen)
        if (data.general.rccm && !/^GN\s?[A-Z]{3}\s?\d{4}\s?[A-Z]\d{5}$/.test(data.general.rccm)) {
            errors.rccm = 'Format RCCM invalide (ex: GN KAL 2023 A12345)';
        }

        // Validation du numéro de téléphone (format guinéen)
        if (data.general.contact_phone && !/^\+224\s?[6-7]\d{8}$/.test(data.general.contact_phone)) {
            errors.contact_phone = 'Le numéro doit commencer par +224 suivi de 9 chiffres';
        }

        // Validation de l'email
        if (data.general.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.general.contact_email)) {
            errors.contact_email = 'Format d\'email invalide';
        }

        // Validation du taux de TVA
        if (data.general.tva_rate < 0 || data.general.tva_rate > 100) {
            errors.tva_rate = 'Le taux de TVA doit être compris entre 0 et 100';
        }
    }

    // Validation de la sécurité
    if (data.security) {
        if (data.security.password_min_length < 8) {
            errors.password_min_length = 'La longueur minimale du mot de passe doit être d\'au moins 8 caractères';
        }
        if (data.security.session_lifetime < 1) {
            errors.session_lifetime = 'La durée de session doit être d\'au moins 1 heure';
        }
    }

    return errors;
};
