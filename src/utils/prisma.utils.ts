export function exclude<T, K extends keyof T>(obj: T, ...keys: K[]) {
  const newObj = Object.keys(obj).reduce((acc, key) => {
    if (!keys.includes(key as K)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});

  return newObj;
}
