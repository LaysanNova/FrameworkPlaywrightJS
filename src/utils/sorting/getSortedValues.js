import {compareVersions, parseCurrency, parseDate, parseSize} from "./parsers";


export async function getSortedValues(pageData, key, type = 'text', direction = 'asc') {
    const extract = {
        text: (v) => v,
        currency: parseCurrency,
        number: Number,
        date: parseDate,
        filesize: parseSize,
        version: compareVersions,
    }[type];

    const actual = pageData.map(row => row[key]);

    const expected = [...actual].sort((a, b) => {
        if (type === 'version') {
            return direction === 'asc'
                ? compareVersions({ version: a }, { version: b })
                : compareVersions({ version: b }, { version: a });
        }

        const A = extract(a);
        const B = extract(b);

        if (typeof A === 'string' && typeof B === 'string') {
            return direction === 'asc'
                ? A.localeCompare(B)
                : B.localeCompare(A);
        }

        return direction === 'asc'
            ? A - B
            : B - A;
    });

    console.log(`direction -> ${direction}`);
    console.log(`Actual -> ${actual}`);
    console.log(`Expected -> ${expected}`);

    return { actual, expected };
}