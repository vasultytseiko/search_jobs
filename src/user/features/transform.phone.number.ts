import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';

export const transformNumber = (phoneNumber: string) => {
  const phoneUtil = PhoneNumberUtil.getInstance();
  const number = phoneUtil.parseAndKeepRawInput(phoneNumber, 'GB');

  return phoneUtil.format(number, PhoneNumberFormat.E164);
};
