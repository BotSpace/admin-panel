export function variableNameValidator(value: string) {
  const isValid = /^[A-Za-z_][A-Za-z0-9_]*$/.test(value);
  return value && isValid;
}

/** @deprecated Use `variableNameValidator` instead */
export const varibulNameValidator = variableNameValidator;
