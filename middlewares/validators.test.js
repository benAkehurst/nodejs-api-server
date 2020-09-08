const validators = require('./validators');
const mocks = {
  emailValid: 'test@test.com',
  emailNotValid: 'qaaa',
  passwordValid: 'goodpassword',
  passwordNotValidLength: 'asd',
  passwordNotValidChars: '',
};

describe('email validator tests', () => {
  it('should be a valid email', () => {
    expect(validators.validateEmail(mocks.emailValid)).toBeTruthy();
  });

  it('should be an invalid email', () => {
    expect(validators.validateEmail(mocks.emailNotValid)).toBeFalsy();
  });

  it('should be a single email', () => {
    expect(validators.validateEmail(mocks.emailValid)).toBeTruthy();
  });
});

describe('password validator tests', () => {
  it('should be a valid password', () => {
    expect(validators.validatePassword(mocks.passwordValid)).toBeTruthy();
  });

  it('should not be an short password', () => {
    expect(
      validators.validatePassword(mocks.passwordNotValidLength)
    ).toBeFalsy();
  });

  it('should not be an empty string', () => {
    expect(
      validators.validatePassword(mocks.passwordNotValidChars)
    ).toBeFalsy();
  });
});
