import { ValidationOptions, registerDecorator } from 'class-validator';
const iso31661 = require('iso-3166-1');
const iso31662 = require('iso-3166-2');

export function IsISO(
  validationType: 'country' | 'location',
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isISO3166',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          if (validationType === 'country') {
            return iso31661.whereAlpha2(value.toUpperCase()) !== undefined;
          } else if (validationType === 'location') {
            return iso31662.subdivision(value) !== undefined;
          }
          return false;
        },
        defaultMessage() {
          return `${propertyName} must be a valid ISO ${validationType === 'country' ? '3166-1' : '3166-2'} code`;
        },
      },
    });
  };
}
