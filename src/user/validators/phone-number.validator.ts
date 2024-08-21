import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PhoneNumberUtil } from 'google-libphonenumber';

@ValidatorConstraint({ name: 'PhoneNumberValidation' })
export class PhoneNumberValidation implements ValidatorConstraintInterface {
  validate(phoneNumber: string) {
    const phoneUtil = PhoneNumberUtil.getInstance();

    try {
      const number = phoneUtil.parseAndKeepRawInput(phoneNumber, 'GB');
      return phoneUtil.isValidNumber(number);
    } catch (error) {
      return false;
    }
  }

  defaultMessage() {
    return 'Phone number must be valid and in the UK format.';
  }
}
