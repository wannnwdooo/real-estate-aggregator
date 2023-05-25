export const prepareHttpParams = (
  params: Record<string, any>
): { [key: string]: string } => {
  let result: { [key: string]: string } = {};

  for (let key in params) {
    if (params[key] !== undefined) {
      if (typeof params[key] === 'number') {
        result[key] = Math.round(params[key]).toString();
      } else {
        result[key] = params[key].toString();
      }
    }
  }

  return result;
};
