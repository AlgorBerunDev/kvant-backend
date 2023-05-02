import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as multer from 'multer';

@ValidatorConstraint({ name: 'isImage', async: false })
export class IsImageConstraint implements ValidatorConstraintInterface {
  validate(file: any) {
    return file.mimetype.startsWith('image/');
  }
}

export function IsImage(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isImage',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsImageConstraint,
    });
  };
}
