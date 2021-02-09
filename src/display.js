function display(decimal, maxlength) {
    const sign = decimal.s > 0 ? ' ' : '-';
    const d = decimal.abs();

    let repr = d.toFixed();
    if (repr.length + 1 <= maxlength) return sign + repr;

    repr = d.toPrecision(maxlength - 1);
    if (!repr.includes('e')) return sign + repr;

    const precision = maxlength - 5 - Math.abs(decimal.e).toString().length;
    return sign + d.toExponential(precision);
}

export { display }