import { Component, inject, signal, ViewChild } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-userslog',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './userslog.component.html',
  styleUrl: './userslog.component.css'
})

export class UserslogComponent {
  private supabaseService = inject(SupabaseService)
  private authService = inject(AuthService)
  private router = inject(Router)

  current_role = signal("")
  user = signal("")
  userEmail = signal("")
  headers = signal(["Usuario", "Dispositivo", "Fecha"])
  rows = signal([])

  constructor() {
    this.supabaseService.subscribeChannel('wave_data', 'wave_data')
    const userid = this.authService.currentUser.subscribe((value) => {
      if (value !== null) {
        console.log(value)
        this.user.set(value.id);
        this.userEmail.set(value.email?.toString() ?? '');
      }
    })
    userid.unsubscribe()
    this.getCurrentUserRole()

    this.getDataUsersLog()
  }


  getDataUsersLog() {
    this.supabaseService.getDataUsersLog()
      .then((data: any) => {
        console.log(data.data)
        this.rows.set(data.data)
      })
  }
  signOut() {
    this.authService.signOut()
    this.router.navigate([''])
  }

  getCurrentUserRole() {
    this.authService.curren_user_role.subscribe((value) => {
      this.current_role.set(value)
    })
  }

}
