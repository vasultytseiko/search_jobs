import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PostcodesService } from '../postcodes.service';

@ValidatorConstraint({ name: 'PostcodeValidation', async: true })
@Injectable()
export class PostcodeValidation implements ValidatorConstraintInterface {
  constructor(private postcodeService: PostcodesService) {}

  async validate(postcode: string) {
    return this.postcodeService.validatePostcode(postcode);
  }
  defaultMessage(): string {
    return 'Provided postcode is not in the UK format.';
  }
}
