const units = ['','un','deux','trois','quatre','cinq','six','sept','huit','neuf'];
const teens = ['dix','onze','douze','treize','quatorze','quinze','seize','dix-sept','dix-huit','dix-neuf'];
const tens = ['','dix','vingt','trente','quarante','cinquante','soixante','soixante-dix','quatre-vingt','quatre-vingt-dix'];

export function convertNumberToWords(number) {
    if (number === 0) return 'zéro';
    if (number < 0) return 'moins ' + convertNumberToWords(-number);

    let words = '';

    if (Math.floor(number / 1000000) > 0) {
        words += convertNumberToWords(Math.floor(number / 1000000)) + ' million ';
        number %= 1000000;
    }

    if (Math.floor(number / 1000) > 0) {
        words += convertNumberToWords(Math.floor(number / 1000)) + ' mille ';
        number %= 1000;
    }

    if (Math.floor(number / 100) > 0) {
        words += convertNumberToWords(Math.floor(number / 100)) + ' cent ';
        number %= 100;
    }

    if (number > 0) {
        if (number < 10) words += units[number];
        else if (number < 20) words += teens[number - 10];
        else {
            words += tens[Math.floor(number / 10)];
            if ((number % 10) > 0) words += '-' + units[number % 10];
        }
    }

    return words.trim();
}
