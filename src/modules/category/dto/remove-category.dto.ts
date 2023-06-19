import { IsFieldEmpty } from '@/src/utils/validators/IsFieldEmpty';
import { IsNumberString, Validate } from 'class-validator';

export class RemoveCategoryDto {
  @Validate(IsFieldEmpty, [
    {
      findKey: 'id',
      modelName: 'category',
      fieldName: 'products',
      isRelationship: true,
      message: 'validation.IMPOSSIBLE_TO_DELETE',
    },
  ])
  @IsNumberString()
  id: string;

  get fields(): { id: number } {
    return { id: parseInt(this.id) };
  }
}
