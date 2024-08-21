import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'RoleValidation' })
export class RoleValidation implements ValidatorConstraintInterface {
  validate(role: string) {
    switch (role) {
      case 'candidate':
      case 'recruiter':
        return true;
      default:
        return false;
    }
  }

  defaultMessage() {
    return 'Invalid role.';
  }
}
