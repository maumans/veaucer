import React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr'; // Importer la localisation française

// Configurer dayjs pour utiliser la langue française
dayjs.locale('fr');

const formatDateFr = (date,format) => {
    // Formater la date en français
    const formattedDate = dayjs(date).format(format || 'dddd D MMMM YYYY, HH:mm');

    return formattedDate
};

export default formatDateFr;
