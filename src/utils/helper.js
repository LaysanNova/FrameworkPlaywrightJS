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
