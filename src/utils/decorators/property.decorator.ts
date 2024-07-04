import 'reflect-metadata';

// Property decorator to mark properties for metadata handling
export function Property() {
  return function (target: any, propertyKey: string) {
    const properties = Reflect.getMetadata('properties', target) || [];
    properties.push(propertyKey);
    Reflect.defineMetadata('properties', properties, target);
  };
}
