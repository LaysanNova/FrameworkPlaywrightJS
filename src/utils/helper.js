export function getYesterdayDate() {
  const date = new Date();
  date.setDate(date.getDate() - 1);

  return date.toISOString().split('T')[0];
}

export function getUnixTimestamp(titleAttr) {
  if (!titleAttr) return NaN;

  const parts = titleAttr.split(' ');
  const unixSeconds = Number(parts[1]);

  if (!Number.isFinite(unixSeconds)) {
    throw new Error(`Cannot parse Unix timestamp from title: "${titleAttr}"`);
  }

  return unixSeconds;
}

export function capitalizeFirstLetter(string) {
  return string.replace(/^./, string[0].toUpperCase());
}

export function getLast(values) {
    return values.at(-1)
}

export function extractPaginationInfo(string) {
  const match = string.match(/Page\s+(\d+)\s+of\s+(\d+)/i);

  if (!match) {
    throw new Error(`Invalid pagination format: ${text}`);
  }

  return {
    currentPage: Number(match[1]),
    totalPages: Number(match[2]),
  };
}

