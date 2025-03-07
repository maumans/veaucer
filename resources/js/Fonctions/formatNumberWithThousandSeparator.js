export function formatNumberWithThousandSeparator(number) {
    if (typeof number !== "number") {
        return number;
    }
    return number.toLocaleString('en-US').replace(/,/g, ' ');
}
