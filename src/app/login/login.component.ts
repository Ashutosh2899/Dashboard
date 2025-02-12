import { Component } from '@angular/core';
import { MainService } from '../services/main.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { ToasterService } from '../toaster.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent {

    loginForm!: FormGroup;


    constructor(
        private fb: FormBuilder,
        private loginService: MainService,
        private router: Router,
        private tokenService: TokenService,
        private toastr: ToasterService
    ) {

    }

    ngOnInit(): void {
        this.initLoginForm();
    }

    initLoginForm() {
        this.loginForm = this.fb.group({
            userName: ["", Validators.required],
            password: ["", Validators.required],
        });
    }

    login() {
        if (!this.loginForm.valid) {
            this.toastr.warning('Please fill all required fields', 'Warning');
            return;
        }
        this.loginService.login(this.loginForm.value).subscribe(
            (resp: any) => {
                if (resp.errorCode === 0) {
                    this.toastr.success('Login successful!', 'Success');
                    this.loginForm.reset();
                    this.tokenService.setUserInfo(resp.result[0]);
                    this.router.navigate(['main']);
                } else {
                    this.toastr.error(resp.message || 'Login failed', 'Error');
                }
            },
            (error) => {
                this.toastr.error('Something went wrong. Please try again.', 'Error');
                console.error("API error: ", error);
            }
        );
    }


}
