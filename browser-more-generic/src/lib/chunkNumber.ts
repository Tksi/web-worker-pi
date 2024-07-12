export const chunkNumber = (number: number, size: number): number[] => {
  const base = Math.trunc(number / size);
  const remainder = number % size;
  const result = new Array<number>(size).fill(base);

  if (remainder > 0) {
    for (let i = 0; i < remainder; i++) {
      result[i]!++;
    }
  } else {
    for (let i = 0; remainder < i; i--) {
      result[-i]!--;
    }
  }

  return result;
};