import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
	registerForm: FormGroup = null;
	isLoading = false;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private renderer: Renderer2
	) { }

	ngOnInit() {
		this.createForm();
	}

	createForm() {
		this.registerForm = this.fb.group({
			fname: ['', Validators.required],
			lname: ['', Validators.required],
			email: ['', Validators.required],
			password: ['', Validators.required],
			cpassword: ['', Validators.required],
			agreement: [false, Validators.requiredTrue]
		});
	}

	async submitRegister() {
		if (this.registerForm.invalid) {
			return false;
		}
		this.isLoading = true;

		await this.router.navigate(['login'])
	}

}
