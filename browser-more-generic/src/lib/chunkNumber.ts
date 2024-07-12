/**
 * 合計がnumberになるようにsizeで分割する
 * @param number 分割する元の数
 * @param size 分割数
 * @returns 分割した数を配列にして返す
 * 
 * @example
 * ```typescript
 * chunkNumber(10, 3); // [4, 3, 3]
 * ```
 */
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