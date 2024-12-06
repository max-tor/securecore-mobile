export const toTitleCase = (str: string) =>
  str.replace(/([A-Z])/g, ' $1').replace(/^./, sub => sub.toUpperCase());

export const pluralize = (
  count: number | undefined,
  noun: string,
  suffix = 's',
) => {
  if (!count) {
    return noun;
  }

  return `${noun}${count !== 1 ? suffix : ''}`;
};
