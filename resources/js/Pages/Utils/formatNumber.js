export default function formatNumber(inputNumber) {
    let formetedNumber = (Number(inputNumber)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

    let splitArray = formetedNumber.split('.');
    if (splitArray.length > 1) {
        formetedNumber = splitArray[0].replace(",",".");
    }
    return (formetedNumber.replace(",","."));
}

