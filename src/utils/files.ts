export function toHumanSize(bytes: number, dp = 1) {
  let size = bytes;
  const thresh = 1024;

  if (Math.abs(size) < thresh) {
    return `${size} B`;
  }

  const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  let u = -1;
  const r = 10 ** dp;

  do {
    size /= thresh;
    u += 1;
  } while (
    Math.round(Math.abs(size) * r) / r >= thresh &&
    u < units.length - 1
  );

  return `${size.toFixed(dp)} ${units[u]}`;
}
