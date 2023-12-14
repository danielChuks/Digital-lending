import AppValidators from '../../utils/AppValidators';

export const validateLoginForm = values => {
  const {mobile, password} = values;
  const isMobileValid = AppValidators.validatePhone(mobile);
  const isPasswordValid = AppValidators.validateRequiredField(password);
  return isMobileValid && isPasswordValid;
};

export const validateMobileForm = values => {
  const {mobile} = values;
  const isMobileValid = AppValidators.validatePhone(mobile);
  return isMobileValid;
};

export const validateConfirmPasswordForm = values => {
  const {pwd, confirmPwd} = values;

  const isPwdValid = AppValidators.validatePassword(pwd);
  const isConfirmPwdValid = AppValidators.validatePassword(confirmPwd);

  return isPwdValid && isConfirmPwdValid;
};

export const validateRegisterForm = values => {
  const {firstName, lastName, email, mobileNumber, dob, pwd, confirmPwd} =
    values;
  const isFirstNameValid = AppValidators.validateRequiredField(firstName);
  const isLastNameValid = AppValidators.validateRequiredField(lastName);
  const isEmailValid = AppValidators.validateEmail(email);
  const isMobileNumberValid = AppValidators.validatePhone(mobileNumber);
  const isDateValid = AppValidators.validateRequiredField(dob);
  const isPwdValid = AppValidators.validatePassword(pwd);
  const isConfirmPwdValid = AppValidators.validatePassword(confirmPwd);

  return (
    isFirstNameValid &&
    isLastNameValid &&
    isEmailValid &&
    isMobileNumberValid &&
    isDateValid &&
    isPwdValid &&
    isConfirmPwdValid
  );
};

export const validateAddressForm = values => {
  const {
    house,
    street,
    town,
    direction,
    date,
    addressType,
    city,
    state,
    country,
    latitude,
    longitude,
  } = values;
  const isHouseValid = AppValidators.validateRequiredField(house);
  const isStreetValid = AppValidators.validateRequiredField(street);
  const isTownValid = AppValidators.validateRequiredField(town);
  const isDirectionValid = AppValidators.validateRequiredField(direction);
  const isDateValid = AppValidators.validateRequiredField(date);
  const isAddressTypeValid = AppValidators.validateRequiredField(addressType);
  const isCityValid = AppValidators.validateRequiredField(city);
  const isStateValid = AppValidators.validateRequiredField(state);
  const isCountryValid = AppValidators.validateRequiredField(country);
  const isLatitudeValid = AppValidators.validateRequiredField(latitude);
  const isLongitudeValid = AppValidators.validateRequiredField(longitude);

  return (
    isHouseValid &&
    isStreetValid &&
    isTownValid &&
    isDirectionValid &&
    isDateValid &&
    isAddressTypeValid &&
    isCityValid &&
    isStateValid &&
    isCountryValid &&
    isLatitudeValid
  );
};
