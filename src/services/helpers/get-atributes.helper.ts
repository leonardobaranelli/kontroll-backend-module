import 'reflect-metadata';

// Retrieves all property keys of a given class that are decorated with `@Property()`
export function getAttributes<T extends object>(
  target: new () => T,
): (keyof T)[] {
  const instance = new target();
  const keys = Object.keys(instance) as (keyof T)[];
  return keys.filter((key) => typeof instance[key] !== 'function');
}
