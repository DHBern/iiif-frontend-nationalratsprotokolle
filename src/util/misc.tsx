export const stringToNumberArray = (str: string): number[] => {
  return str.split(',').map((s) => Number(s));
};

export const numberArrayToString = (arr: number[]): string => {
  return arr.join(',');
};