export const findIndexAll = (array: [], formula) => {
  const indexes: number[] = [];
  array.forEach((element, index) => {
    if (formula) {
      indexes.push(index);
    }
  });

  return indexes;
};
