import { AbstractControl } from "@angular/forms";

export function yearValidation(control: AbstractControl) {
	let validateYear = false;
	if (typeof control.value === "string") {
		if ((control.value.length === 4 && /^[0-9]+$/.test(control.value)) || control.value === "") {
			const current_year = new Date().getFullYear();
			if((+control.value < 1900) || (+control.value > current_year)) {
				validateYear = true;
			}
			
		}
		
	} else if (!control.value) {
		validateYear = true;
	}
	if (!validateYear) {
		return { validateYear: false };
	}
	return null;
}

export function noWhitespaceValidator(control: AbstractControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}