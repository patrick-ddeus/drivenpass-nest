export function exclude<T, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  const newObj = JSON.parse(JSON.stringify(obj));

  for (const key of keys) {
    delete newObj[key];
  }

  return newObj;
}
