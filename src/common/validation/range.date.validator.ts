import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'DateRange', async: false })
export class DateRangeConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const startDate = new Date(value);
    const endDate = new Date(args.object[args.constraints[0]]);

    // Convert dates to UTC
    const startWithoutTime = Date.UTC(
      startDate.getUTCFullYear(),
      startDate.getUTCMonth(),
      startDate.getUTCDate(),
    );
    const endWithoutTime = Date.UTC(
      endDate.getUTCFullYear(),
      endDate.getUTCMonth(),
      endDate.getUTCDate(),
    );

    return startWithoutTime < endWithoutTime;
  }

  defaultMessage() {
    return `The start date must be less than or equal to the end date by one or more days`;
  }
}

export function DateRange(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: ['end_date'],
      validator: DateRangeConstraint,
    });
  };
}
