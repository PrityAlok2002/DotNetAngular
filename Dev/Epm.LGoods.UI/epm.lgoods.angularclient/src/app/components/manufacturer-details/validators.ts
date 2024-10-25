
//import { AbstractControl, ValidatorFn } from '@angular/forms';

//// Validator to ensure the first letter is capitalized
//export function capitalizedValidator(): ValidatorFn {
//  return (control: AbstractControl): { [key: string]: any } | null => {
//    const value = control.value as string;
//    if (value && /^[a-z]/.test(value)) {
//      return { 'capitalized': true };  // Change to boolean
//    }
//    return null;
//  };
//}




//// Validator function for positive integers up to a maximum value
//// Validator function for positive integers with regex and range constraints
//export function positiveIntegerWithRangeAndLengthValidator(min: number, max: number, minLength: number): ValidatorFn {
//  return (control: AbstractControl): { [key: string]: any } | null => {
//    const value = control.value?.toString(); // Convert value to string

//    if (value === null || value === '') return null; // No validation for empty values

//    // Regex to validate number format
//    const regex = /^\d{1,6}(?:\.\d{1,2})?$/;
//    const numericValue = Number(value);
//    const isValidFormat = regex.test(value);
//    const withinRange = numericValue >= min && numericValue <= max;
//    const hasMinLength = numericValue.toString().length >= minLength;

//    // Return validation error if any condition fails
//    return isValidFormat && withinRange && hasMinLength ? null : { 'positiveIntegerWithRangeAndLength': true };
//  };
//}


//export function maxThreeDigitsValidator(): ValidatorFn {
//  return (control: AbstractControl): { [key: string]: any } | null => {
//    const value = control.value;

//    if (value === null || value === '') return null; // No validation for empty values

//    // Ensure value is a number and matches the pattern
//    const regex = /^\d{1,3}(\.\d{0,2})?$/;
//    return regex.test(value) ? null : { 'pattern': true };
//  };
//}
