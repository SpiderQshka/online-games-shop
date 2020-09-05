export const processArrayAsync = async (
  array: any[],
  handler: (el: any) => Promise<any>
) => {
  const promises = array.map(handler);
  return await Promise.all(promises);
};

export const deleteRepeatedValuesFromArray = (array: any[]) => [
  ...new Set(array),
];
