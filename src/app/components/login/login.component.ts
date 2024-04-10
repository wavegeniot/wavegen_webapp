import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  register = signal('logIn')

  private authService = inject(AuthService)
  private formBuilder = inject(FormBuilder)

  constructor() {}

  logInForm = this.formBuilder.group({
    email: '',
    password: '',
    name: '',
    lastname: '',
  })

  signUp() {
    this.register.set("logUp")
  }
  signIn() {
    this.register.set("logIn")
  }

  async handleLogin() {
    const email = this.logInForm.value.email as string
    const password = this.logInForm.value.password as string
    const name = this.logInForm.value.name as string
    const lastname = this.logInForm.value.lastname as string

    if (this.register() === "logIn") {
      this.authService.signInWithPassword(email, password)
    } else {
      this.authService.signUp(email, password, name, lastname)
    }
  }

}
