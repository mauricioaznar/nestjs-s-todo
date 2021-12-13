import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import moment = require('moment');
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsYearMonth' })
@Injectable()
export class IsYearMonth implements ValidatorConstraintInterface {
  validate(value: any) {
    if (typeof value === 'string') {
      return moment(value, 'YYYY-MM', true).isValid();
    }
    return false;
  }

  defaultMessage({ property }) {
    return `${property} must be a valid date (Required format: YYYY-MM)`;
  }
}
