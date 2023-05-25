import { FormGroup } from '@angular/forms';

export const getErrorMsg = (
  data: FormGroup,
  controlName: string,
  errorName: string,
  errorMsg: string
): string => {
  const control = data.get(controlName);
  return control?.hasError(errorName) && control?.touched ? errorMsg : '';
};
