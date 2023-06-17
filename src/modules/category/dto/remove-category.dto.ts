import { IsFieldEmpty } from '@/src/utils/validators/IsFieldEmpty';
import { IsNumberString, Validate } from 'class-validator';

export class RemoveCategoryDto {
  @Validate(IsFieldEmpty, [
    {
      findKey: 'id',
      modelName: 'category',
      fieldName: 'products',
      isRelationship: true,
      message:
        'Before deleting this category, move the products that belong to this category.',
    },
  ])
  @IsNumberString()
  id: string;

  get fields(): { id: number } {
    return { id: parseInt(this.id) };
  }
}
