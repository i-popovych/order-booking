import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from 'src/common/exeptions/validation.exeption';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  constructor(
    private options?: { whitelist?: boolean; forbidNonWhitelisted?: boolean },
  ) {}

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value;
    }

    const obj = plainToClass(metadata.metatype, value);
    const errors = await validate(obj, this.options);

    if (errors.length) {
      const messages = errors.map((err) => {
        return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
      });
      throw new ValidationException(messages);
    }
    return obj;
  }

  private toValidate(metatype: any): boolean {
    const types: Array<any> = [String, Boolean, Number, Array, Object, Date];
    return !types.includes(metatype);
  }
}
