import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs';
import { StorageAccessorService } from 'src/app/shared/services/storage-accessor.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  isWaiting: boolean = false;

  constructor(
    private storage: StorageAccessorService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    if(this.storage.checkExistance("user")) {
      this.router.navigate(['home']);
    }

    const success = this.route.snapshot.queryParams['passwordChanged'];
    this.route
    if(success) this.openSnackBar("You have successfully changed your password");
  }

  submitRecord() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isWaiting = true;

    this.authService
      .loginWithEmailAndPassword(
        this.form.controls['email'].value,
        this.form.controls['password'].value
      )
      .pipe(
        finalize(() => {
          this.isWaiting = false;
        })
      )
      .subscribe({
        next: () => this.onLoginSuccess(),
        error: (error: Error) =>  this.onLoginFailure(error.message)
      });
  }

  onLoginSuccess() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    this.router.navigateByUrl(returnUrl);
  }

  onLoginFailure(message: string) {
    this.openSnackBar(message, true);
  }

  loginWithGoogle() {
    this.authService
      .loginWithGoogle()
      .subscribe({
        next: () => this.onLoginSuccess(),
        error: (error: Error) =>  this.onLoginFailure(error.message)
      });
  }

  openSnackBar(message: string, error: boolean = false) {
    const snackBarClass = error ? 'mat-warn' : 'mat-primary';
    this._snackBar.open(message, 'Ok', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['mat-toolbar', snackBarClass]
    });
  }

  ngOnDestroy(): void {
    this._snackBar.dismiss();
  }
}