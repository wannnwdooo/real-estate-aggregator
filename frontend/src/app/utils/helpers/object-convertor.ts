export const convertObjectValuesToNumbers = <T>(obj: T): T => {
  if (obj === null) {
    return obj;
  }

  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      convertObjectValuesToNumbers(obj[key]);
    } else {
      (obj[key] as unknown) = Number(obj[key]);
    }
  }
  return obj;
};
