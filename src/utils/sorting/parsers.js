export function parseDate(str) {
    if (!str) return 0;

    const cleaned = str
        .trim()
        .replace(',', '')
        .replace(/-/g, '/');

    // CASE 1: numeric dates (10/11/69, 12/05/1955, etc.)
    const numeric = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);

    if (numeric) {
        let [, month, day, year] = numeric;

        if (year.length === 2) {
            year = Number(year) > 50 ? '19' + year : '20' + year;
        }

        return new Date(`${year}-${month}-${day}`).getTime();
    }

    // CASE 2: textual dates (October 1 2005)
    return new Date(cleaned).getTime();
}

export function parseCurrency(price) {
    return Number(
        price
            .replace('$', '')
            .replace(/,/g, '')
    );
}


export function compareVersions(a, b) {
    const aStr = (a?.version ?? a)?.toString();
    const bStr = (b?.version ?? b)?.toString();

    if (!aStr || !bStr) return 0;

    const aParts = aStr.split('.').map(Number);
    const bParts = bStr.split('.').map(Number);

    const len = Math.max(aParts.length, bParts.length);

    for (let i = 0; i < len; i++) {
        const aVal = aParts[i] || 0;
        const bVal = bParts[i] || 0;

        if (aVal !== bVal) {
            return aVal - bVal;
        }
    }

    return 0;
}

export function parseSize(size) {
    if (!size) return 0;

    const units = {
        b: 1,
        k: 1024,
        kb: 1024,
        m: 1024 ** 2,
        mb: 1024 ** 2,
        g: 1024 ** 3,
        gb: 1024 ** 3,
        t: 1024 ** 4,
        tb: 1024 ** 4,
        ti: 1024 ** 4,
        tib: 1024 ** 4,
        y: 1024 ** 8,
        yb: 1024 ** 8,
    };

    const normalized = size
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '');

    const match = normalized.match(/^([\d.]+)([a-z]+)$/);

    if (!match) return 0;

    const [, value, unit] = match;

    return parseFloat(value) * (units[unit] || 1);
}