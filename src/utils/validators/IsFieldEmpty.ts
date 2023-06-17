import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { PrismaService } from 'nestjs-prisma';

type ValidationArgumentType = {
  findKey: string;
  modelName: string;
  fieldName: string;
  isRelationship: boolean;
  message: string | null | undefined;
};

@ValidatorConstraint({ name: 'IsFieldEmpty', async: true })
@Injectable()
export class IsFieldEmpty implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}
  async validate(value: any, validationArguments: ValidationArguments) {
    const argument = validationArguments
      .constraints[0] as ValidationArgumentType;
    const prismaModel = this.prisma[argument.modelName];

    let isFieldEmpty: boolean;
    if (argument.isRelationship) {
      const data = await prismaModel.findFirst({
        where: {
          [argument.findKey]: +value,
        },
        include: {
          _count: {
            select: { [argument.fieldName]: true },
          },
        },
      });
      isFieldEmpty = data._count[argument.fieldName] === 0;
    } else {
      const data = await prismaModel.findFirst({
        where: {
          [argument.findKey]: +value,
        },
      });
      isFieldEmpty = !data[argument.fieldName];
    }
    return isFieldEmpty;
  }

  defaultMessage(validationArguments: ValidationArguments) {
    const argument = validationArguments
      .constraints[0] as ValidationArgumentType;
    if (argument.message) return argument.message;
    return `${argument.fieldName} is not empty`;
  }
}
